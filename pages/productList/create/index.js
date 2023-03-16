import {useState} from "react";

const Create = (props) => {
    const {date} = props
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!name) {
            newErrors.name = '이름을 입력해 주세요.';
        }
        if (!age || age < 0 || age > 120) {
            newErrors.age = '나이를 올바르게 입력해 주세요.';
        }
        if (!gender) {
            newErrors.gender = '성별을 선택해 주세요.';
        }
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            alert('폼이 성공적으로 제출되었습니다.');
        }
    };


    return (
        <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto my-10">
            <div className="mb-4">
                <label className="block mb-2 text-sm font-bold">이름</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="mb-4">
                <label className="block mb-2 text-sm font-bold">나이</label>
                <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                />
                {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age}</p>}
            </div>

            <div className="mb-4">
                <label className="block mb-2 text-sm font-bold">성별</label>
                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                >
                    <option value="">선택해 주세요</option>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                </select>
                {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
            </div>

            <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded">
                제출하기
            </button>
        </form>
    );
}

Create.getInitialProps = ({ query }) => {
    return { date: query.date }
};
export default Create