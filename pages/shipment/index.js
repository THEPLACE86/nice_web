import { useEffect, useState } from 'react';
import {supabase} from "../../utils/supabaseClient";
import DatePicker from 'react-datepicker';
import {router} from "next/client";

export default function ShipmentList() {
    const [shipments, setShipments] = useState([]);
    const [selectDate, setSelectDate] = useState(new Date());
    const dateFormatter = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    const dateString = dateFormatter.format(selectDate);

    const handleDateChange = (date) => {
        setSelectDate(date);
    };

    useEffect(() => {

        fetchShipments();
    }, [dateString]);

    async function fetchShipments() {
        const { data, error } = await supabase.from('shipment').select().eq('shipment_date', dateString);
        if (error) console.error('Error fetching shipments:', error);
        else setShipments(data);
    }

    const goToCreate = () => {
        router.push({
            pathname: '/shipment/create',
            query: { date: dateString },
        });
    }

    return (
        <div className="mx-auto px-4">
            <div className="flex mt-10 mb-10 items-center">
                <div className="text-center w-full ml-32">
                    <span className="font-bold text-3xl">
                        <span className="text-orange-600 font-bold text-3xl">{dateString}</span> 출하목록
                    </span>
                </div>
                <div className="flex items-center">
                    <div className="flex items-center space-x-4">
                        <DatePicker
                            selected={selectDate}
                            onChange={handleDateChange}
                            dateFormat="yyyy년 M월 d일"
                            className="print:hidden cursor-pointer bg-white border border-gray-300 rounded p-2 text-gray-600 text-center w-48"
                        />
                        <button onClick={goToCreate} className="print:hidden btn btn-primary rounded text-white w-32">등록</button>
                    </div>
                </div>
            </div>

            <table className="w-full table-auto border-collapse">
                <thead>
                <tr className="text-center bg-light-blue-200">
                    <th className="w-10 p-2 bg-blue-50 border border-gray-300">no</th>
                    <th className="w-16 p-2 bg-blue-50 border border-gray-300">담당자</th>
                    <th className="w-12 p-2 bg-blue-50 border border-gray-300">도면</th>
                    <th className="w-14 p-2 bg-blue-50 border border-gray-300">이니셜</th>
                    <th className="w-48 p-2 bg-blue-50 border border-gray-300">업체 및 현장명</th>
                    <th className="w-96 p-2 bg-blue-50 border border-gray-300">출하내용</th>
                    <th className="w-32 p-2 bg-blue-50 border border-gray-300">검수일자</th>
                    <th className="w-56 p-2 bg-blue-50 border border-gray-300">특이사항</th>
                </tr>
                </thead>
                <tbody>
                {shipments.map((shipment, index) => (
                    <tr key={index} className="text-center">
                        <td className="p-2 border border-gray-300">{index + 1}</td>
                        <td className="p-2 border border-gray-300">{shipment.name}</td>
                        <td className="p-2 border border-gray-300">{shipment.drawing ? 'O' : 'X'}</td>
                        <td className="p-2 border border-gray-300">{shipment.initial}</td>
                        <td className="p-2 border border-gray-300">{shipment.place}</td>
                        <td className="p-2 border border-gray-300">{shipment.shipment_content}</td>
                        <td className="p-2 border border-gray-300">{shipment.test_date}</td>
                        <td className="p-2 border border-gray-300">{shipment.memo} (<span className="font-bold text-red-600">{shipment.radio}</span>)</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}