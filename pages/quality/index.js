import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { format, setDay } from 'date-fns';
import ko from "date-fns/locale/ko";

const Quality = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [startDate, setStartDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const getNextTuesday = (date) => {
        return setDay(date, 2);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setShowDatePicker(false)
    };

    return (
        <div>
            <div className="flex justify-center justify-between mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">
                    {format(getNextTuesday(selectedDate), 'yyyy년 M월 d일')} 검사품목 리스트
                </h1>
                <div>
                    <button className="btn btn-active btn-primary text-white" onClick={() => setShowDatePicker(!showDatePicker)}>
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
        </div>
    )
}

export default Quality