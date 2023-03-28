import React, { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabaseClient";
import { useRouter } from "next/router";
import { parse } from "date-fns";
import DatePicker from "react-datepicker";
import ko from "date-fns/locale/ko";

const Update = (props) => {
    const { date , id } = props;
    const router = useRouter();
    const [drawing, setDrawing] = useState(false)
    const [notTest, setNotTest] = useState(false)

    const [formData, setFormData] = useState({
        company: "",
        place: "",
        type_time: "",
        shipment_content: "",
        test_date: "",
        memo: "",
        initial: "",
    });
    const [errors, setErrors] = useState({});
    const findTuesday = (date) => {
        const dayOfWeek = date.getDay();
        const diff = (dayOfWeek < 2 ? 1 : 9) - dayOfWeek;
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + diff);
    };

    const [startDate, setStartDate] = useState(findTuesday(new Date()));

    const handleDateChange = (date) => {
        setStartDate(date);
        setNotTest(false)
        setFormData({ ...formData, test_date: date });
    };

    useEffect(() => {
        const fetchProductList = async () => {
            const { data, error } = await supabase
                .from("shipment")
                .select()
                .eq("id", id).single()

            if (error) {
                console.log("error", error);
                return;
            }

            setFormData({
                company: data.company,
                place: data.place,
                type_time: data.type_time,
                shipment_content: data.shipment_content,
                test_date: data.test_date,
                memo: data.memo,
                initial: data.initial,
            });
            setDrawing(data.drawing)
            if(data.test_date === ""){
                setNotTest(true)
            }else{
                const parsedDate = parse(data.test_date, "yyyy년 M월 d일", new Date());
                setStartDate(parsedDate);
                setNotTest(false)
            }
        };
        fetchProductList();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            if (
                !formData[key] &&
                key !== "memo"
            ) {
                newErrors[key] = "빈칸을 입력해주세요";
            }
        });
        if (Object.keys(newErrors).length === 0) {
            const formattedDate = startDate.toLocaleDateString("ko-KR", {year: 'numeric',month: 'long',day: 'numeric'});

            await supabase
                .from("shipment")
                .update({
                    company: formData.company,
                    place: formData.place,
                    shipment_content: formData.shipment_content,
                    type_time: formData.type_time,
                    memo: formData.memo,
                    initial: formData.initial,
                    test_date: notTest ? "" : formattedDate,
                    drawing: drawing
                })
                .eq("id", id);
            router.back();
        } else {
            setErrors(newErrors);
        }
    }

    return (
        <div className="flex justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
                <div className="bg-white p-6 rounded-lg">
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        <div>
                            <label htmlFor="company" className="block mb-2">
                                회사명
                            </label>
                            <input
                                type="text"
                                name="company"
                                id="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                            {errors.company && (
                                <p className="text-red-500 text-sm">{errors.company}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="place" className="block mb-2">
                                현장명
                            </label>
                            <input
                                type="text"
                                name="place"
                                id="place"
                                value={formData.place}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                            {errors.place && (
                                <p className="text-red-500 text-sm">{errors.place}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="area" className="block mb-2">
                                이니셜
                            </label>
                            <input
                                type="text"
                                name="initial"
                                id="initial"
                                value={formData.initial}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                            {errors.initial && (
                                <p className="text-red-500 text-sm">{errors.initial}</p>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <div>
                            <label htmlFor="shipment_content" className="block mb-2">출하내용</label>
                            <input
                                type="text"
                                name="shipment_content"
                                id="shipment_content"
                                value={formData.shipment_content}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                            {errors.shipment_content && (
                                <p className="text-red-500 text-sm">{errors.shipment_content}</p>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <div>
                            <label htmlFor="memo" className="block mb-2">특이사항(도착시간)</label>
                            <input
                                type="text"
                                name="memo"
                                id="memo"
                                value={formData.memo}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                            {errors.memo && (
                                <p className="text-red-500 text-sm">{errors.memo}</p>
                            )}
                        </div>
                    </div>

                    {/* 작업 선택 */}
                    <div className="mb-4">
                        <label htmlFor="type_time" className="block mb-2">
                            작업 선택
                        </label>
                        <select
                            name="type_time"
                            id="type_time"
                            value={formData.type_time}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="">선택해주세요</option>
                            <option value="당착(오전)">당착(오전)</option>
                            <option value="당착(오후)">당착(오후)</option>
                            <option value="야상">야상</option>
                            <option value="택배">택배</option>
                        </select>
                        {errors.type_time && (
                            <p className="text-red-500 text-sm">{errors.type_time}</p>
                        )}
                    </div>
                    <div>
                        <span className={"mt-4 mb-4"}>검수날짜 선택</span>
                        <DatePicker
                            selected={startDate}
                            onChange={handleDateChange}
                            locale={ko}
                            dateFormat="yyyy년 M월 d일"
                            inline
                            filterDate={(date) => date.getDay() === 2}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label w-36">
                            <span className="label-text font-bold ">비검수</span>
                            <input
                                type="checkbox"
                                className="checkbox ml-2"
                                value={notTest}
                                checked={notTest}
                                onChange={(e) => setNotTest(e.target.checked)}
                            />
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label w-36">
                            <span className="label-text font-bold ">도면배포 여부</span>
                            <input
                                type="checkbox"
                                className="checkbox ml-2"
                                value={drawing}
                                checked={drawing}
                                onChange={(e) => setDrawing(e.target.checked)}
                            />
                        </label>
                    </div>

                    {/* 제출 버튼 */}
                    <div className="text-right">
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2">
                            수정하기
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

Update.getInitialProps = ({ query }) => {
    return { id: query.id, date: query.date };
};

export default Update;

