import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';

const MonthPickerComponent = ({ onMonthSelect }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [isOpen, setIsOpen] = useState(false);

    const handleMonthChange = (date) => {
        setStartDate(date);
        onMonthSelect(date.getFullYear(), date.getMonth() + 1);
        setIsOpen(false);
    };

    const toggleCalendar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <button className={"btn btn-primary text-white"} onClick={toggleCalendar}>
                {startDate.getFullYear()}년 {startDate.getMonth() + 1}월
            </button>
            {isOpen && (
                <DatePicker
                    selected={startDate}
                    onChange={handleMonthChange}
                    dateFormat="yyyy년 M월"
                    showMonthYearPicker
                    inline
                    locale={ko}
                />
            )}
        </div>
    );
};

export default MonthPickerComponent;
