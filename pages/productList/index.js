import DatePicker from "react-datepicker";
import ko from 'date-fns/locale/ko';
import "react-datepicker/dist/react-datepicker.css";
import {useState} from "react";
import {useRouter} from "next/router";

const ProductList = () => {
    const [startDate, setStartDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const router = useRouter();

    const handleDateChange = (date) => {
        setStartDate(date);
        setShowDatePicker(false);
        const formattedDate = new Date(date).toLocaleDateString('ko-KR', {year: 'numeric',month: 'long',day: 'numeric',});
        router.push({
            pathname: '/productList/list',
            query: { date: formattedDate },
        });
    };

    return(
        <>
            <div className="min-h-screen flex justify-center mt-32">
                <div className="mx-auto">
                    <button className="btn btn-active btn-warning w-full text-white h-16" onClick={() => setShowDatePicker(!showDatePicker)}>
                        {startDate ? startDate.toLocaleDateString('ko-KR', {year: 'numeric',month: 'long',day: 'numeric'}) : '검사날짜 선택'}
                    </button>
                    {showDatePicker && (
                        <DatePicker
                            selected={startDate}
                            onChange={handleDateChange}
                            locale={ko} dateFormat="yyyy년 MM월 dd일"
                            inline
                            filterDate={(date) => date.getDay() === 2}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

export default ProductList