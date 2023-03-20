import { useRouter } from "next/router";
import { supabase } from "../../../utils/supabaseClient";
import { useState } from "react";

function Create(props) {
    const { testDate, testRound } = props;
    const router = useRouter();
    const [formValues, setFormValues] = useState({});

    async function onSave(e) {
        e.preventDefault();
        console.log("Success:", formValues.company);

        const dataToInsert = {
            company: formValues.company,
            place: formValues.place,
            area: formValues.area,
            a25: formValues.a25,
            a32: formValues.a32,
            a40: formValues.a40,
            a50: formValues.a50,
            a65: formValues.a65,
            m65: formValues.m65,
            m80: formValues.m80,
            m100: formValues.m100,
            m125: formValues.m125,
            m150: formValues.m150,
            test_date: testDate,
            initial: formValues.initial,
            test_round: testRound,
            totalH: parseInt(formValues.a32) + parseInt(formValues.a40) + parseInt(formValues.a50) + parseInt(formValues.a65) + parseInt(formValues.m65) +
                parseInt(formValues.m80) + parseInt(formValues.m100) + parseInt(formValues.m125) + parseInt(formValues.m150),
        };

        const { data, error } = await supabase
            .from("product")
            .insert(dataToInsert)
            .select("id");

        await supabase.from("bunch").insert({
            place: `${formValues.company} ${formValues.place} ${formValues.area}`,
            test_list_id: data[0].id,
            test_date: testDate,
        });

        router.back();
    }

    const handleChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex justify-center">
            <form className="w-1200px" onSubmit={onSave}>
                {/* 회사명, 현장명, 구역명, 이니셜 가로로 한 줄 */}
                <div className="flex">
                    {[
                        { label: "회사명", name: "company" },
                        { label: "현장명", name: "place" },
                        { label: "구역명", name: "area" },
                        { label: "이니셜", name: "initial" },
                    ].map(({ label, name, index }) => (
                        <div key={index} className="mr-4">
                            <label className="label">
                                <span className="label-text">{label}</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered"
                                name={name}
                                placeholder={label}
                                value={formValues[name] || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}
                </div>

                {/* 숫자 입력 필드 첫 번째 줄 */}
                <div className=" flex">
                    {["A25", "A32", "A40", "A50", "A65"].map((label,index) => (
                        <div key={index} className="mr-4">
                            <label className="label">
                                <span className="label-text">{label}</span>
                            </label>
                            <input
                                type="number"
                                className="input input-bordered"
                                name={label}
                                placeholder={label}
                                min="0"
                                value={formValues[label] || ""}
                                onChange={handleChange}
                            />
                        </div>
                    ))}
                </div>

                {/* 숫자 입력 필드 두 번째 줄 */}
                <div className=" flex">
                    {["M65", "M80", "M100", "M125", "M150"].map((label, index) => (
                        <div key={index} className="mr-4">
                            <label className="label">
                                <span className="label-text">{label}</span>
                            </label>
                            <input
                                type="number"
                                className="input input-bordered"
                                name={label}
                                placeholder={label}
                                min="0"
                                value={formValues[label] || ""}
                                onChange={handleChange}
                            />
                        </div>
                    ))}
                </div>

                <button className="w-96 btn btn-primary mt-4 text-white" type="submit">
                    저장
                </button>
            </form>
        </div>
    );

}

Create.getInitialProps = ({ query }) => {
    return { testDate: query.testDate, testRound: query.testRound };
};

export default Create;