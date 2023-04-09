import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import formatDate from "../../utils/formatDate";
import {supabase} from "../../utils/supabaseClient";

const SalesDate = ({ item, onDataChange }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(item.sales_date || '');

    const handleDateChange = async () => {
        setIsModalOpen(false);
        const formattedDate = selectedDate ? formatDate(new Date(selectedDate)) : '';

        await supabase
            .from('product_list')
            .update({ sales_date: formattedDate })
            .match({ id: item.id });

        onDataChange();
    };

    const handleDateCancel = async () => {
        setIsModalOpen(false);

        await supabase
            .from('product_list')
            .update({ sales_date: null })
            .match({ id: item.id });

        onDataChange();
    };

    return (
        <>
          <span
              onClick={() => setIsModalOpen(true)}
              className={`cursor-pointer ${!item.sales_date ? 'text-gray-400' : 'text-orange-600 font-bold'}`}
          >
              {item.sales_date || '날짜선택'}
            </span>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={() => setIsModalOpen(false)}
                    ></div>
                    <div className="relative p-8 bg-white rounded shadow-xl">
                        <h2 className="text-xl font-bold mb-4 text-black">매출날짜 선택</h2>
                        <input
                            type="date"
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="border border-gray-300 px-3 py-2 rounded w-full"
                        />
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={handleDateChange}
                                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                            >
                                저장
                            </button>
                            <button
                                onClick={handleDateCancel}
                                className="bg-gray-300 text-black px-4 py-2 rounded"
                            >
                                매출취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default SalesDate