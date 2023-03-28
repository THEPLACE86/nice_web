import React, {useEffect, useState} from "react";
import {supabase} from "../../../utils/supabaseClient";
import {useRouter} from "next/router";
import loadDataFromLocalStorage from "../../../utils/localStorage";
import ko from "date-fns/locale/ko";
import DatePicker from "react-datepicker";

const Create = (props) => {
    const { date } = props;
    const router = useRouter();
    const [selectDate, setSelectDate] = useState(new Date());
    const dateFormatter = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    const dateString = dateFormatter.format(selectDate);
    const [formData, setFormData] = useState({
        company: "",
        place: "",
        shipment: "",
        type_time: "",
        memo: "",
        initial: ""
    });
    const [drawing, setDrawing] = useState(false)
    const [notTest, setNotTest] = useState(false)
    const [errors, setErrors] = useState({});

    const handleDateChange = (date) => {
        console.log(date.value)
        setSelectDate(date);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {}
        Object.keys(formData).forEach((key) => {
            if (!formData[key] && key !== "head" && key !== "hole" && key !== "groove" && key !== "memo") {
                newErrors[key] = "빈칸을 입력해주세요";
            }
        })
        if (Object.keys(newErrors).length === 0) {
            const { data: { user } } = await supabase.auth.getUser()

            const userData = loadDataFromLocalStorage('user')

            await supabase.from("shipment").insert({
                "company": formData.company,
                "place": formData.place,
                "type_time": formData.type_time,
                "memo": formData.memo,
                "shipment_content": formData.shipment,
                "test_date": notTest ? '' : dateString,
                "shipment_date": date,
                "name": userData.name,
                "initial": formData.initial,
                "uid": user.id,
                "drawing" : drawing
            });
            router.back();
        } else {
            setErrors(newErrors)
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
                            <label htmlFor="place" className="block mb-2">
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
                        <label htmlFor="memo" className="block mb-2">
                            출하내용
                        </label>
                        <textarea
                            name="shipment"
                            id="shipment"
                            value={formData.shipment}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                            rows="1"
                        ></textarea>
                        {errors.memo && (
                            <p className="text-red-500 text-sm">{errors.memo}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="memo" className="block mb-2">
                            특이사항
                        </label>
                        <textarea
                            name="memo"
                            id="memo"
                            value={formData.memo}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                            rows="1"
                        ></textarea>
                        {errors.memo && (
                            <p className="text-red-500 text-sm">{errors.memo}</p>
                        )}
                    </div>


                    <div className="mb-4">
                        <label htmlFor="type_time" className="block mb-2">
                            도착 시간
                        </label>
                        <select
                            name="type_time"
                            id="type_time"
                            value={formData.type_time} onChange={handleChange}
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
                    <DatePicker
                        onChange={handleDateChange}
                        locale={ko} dateFormat="yyyy년 MM월 dd일"
                        inline
                        filterDate={(date) => date.getDay() === 2}
                    />
                    <div className="form-control">
                        <label className="label w-36">
                            <span className="label-text font-bold ">비검수</span>
                            <input
                                type="checkbox"
                                className="checkbox ml-2"
                                value={notTest}
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
                                onChange={(e) => setDrawing(e.target.checked)}
                            />
                        </label>
                    </div>

                    {/* 제출 버튼 */}
                    <div className="text-right">
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2">
                            저장
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

Create.getInitialProps = ({ query }) => {
    return { date: query.date }
}
export default Create