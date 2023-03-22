import {useEffect, useState} from "react";
import {supabase} from "../../../utils/supabaseClient";
import {useRouter} from "next/router";
import loadDataFromLocalStorage from "../../../utils/localStorage";

const Create = (props) => {
    const { date } = props;
    const router = useRouter();
    const [formData, setFormData] = useState({
        company: "",
        place: "",
        area: "",
        workType: "",
        head: 0,
        hole: 0,
        groove: 0,
        memo: "",
        initial: "",
    });
    const [errors, setErrors] = useState({});
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

            await supabase.from("product_list").insert({
                company: formData.company,
                place: formData.place,
                area: formData.area,
                work_type: formData.workType,
                head: formData.head,
                hole: formData.hole,
                groove: formData.groove,
                memo: formData.memo,
                test_date: date,
                initial: formData.initial,
                name: userData.name,
                uid: user.id
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

                    {/* 작업 선택 */}
                    <div className="mb-4">
                        <label htmlFor="workType" className="block mb-2">
                            도착 시간
                        </label>
                        <select
                            name="workType"
                            id="workType"
                            value={formData.workType} onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="">선택해주세요</option>
                            <option value="야상">야상</option>
                            <option value="당착">당착</option>
                            <option value="내착">내착</option>
                            <option value="택배">택배</option>
                        </select>
                        {errors.workType && (
                            <p className="text-red-500 text-sm">{errors.workType}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <label htmlFor="head" className="block mb-2">
                                출하내용
                            </label>
                            <input
                                type="text"
                                name="head"
                                id="head"
                                value={formData.head}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                            {errors.head && (
                                <p className="text-red-500 text-sm">{errors.head}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="hole" className="block mb-2">
                                홀
                            </label>
                            <input
                                type="number"
                                name="hole"
                                min="0"
                                id="hole"
                                value={formData.hole}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                            {errors.hole && (
                                <p className="text-red-500 text-sm">{errors.hole}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="groove" className="block mb-2">
                                그루브
                            </label>
                            <input
                                type="number"
                                name="groove"
                                min="0"
                                id="groove"
                                value={formData.groove}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                            {errors.groove && (
                                <p className="text-red-500 text-sm">{errors.groove}</p>
                            )}
                        </div>
                    </div>

                    {/* 비고 */}
                    <div className="mb-4">
                        <label htmlFor="memo" className="block mb-2">
                            비고
                        </label>
                        <textarea
                            name="memo"
                            id="memo"
                            value={formData.memo}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                            rows="2"
                            maxLength="100"
                        ></textarea>
                        {errors.memo && (
                            <p className="text-red-500 text-sm">{errors.memo}</p>
                        )}
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