import {useEffect, useState} from "react";
import {supabase} from "../../utils/supabaseClient";
import formatDate from "../../utils/formatDate";
import MonthPicker from "../../components/MonthPicker";

const Processing = () => {
    const [data, setData] = useState([]);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    useEffect(() => {
        async function fetchData() {
            const monthlyData = await getMonthlyData(year, month);
            setData(monthlyData);
        }
        fetchData();
    }, [month, year]);

    async function getMonthlyData(year, month) {
        const yearMonth = `${year}년 ${String(month).padStart(2, '0')}월`;

        const { data, error } = await supabase.rpc('get_monthly_data', { year_month: yearMonth });

        if (error) {
            console.error('Error fetching data:', error);
            return [];
        }
        return data;
    }

    const handleMonthSelect = (year, month) => {
        setYear(year);
        setMonth(month);
    };

    const getTotal = (field) => {
        return data.reduce((total, item) => total + parseInt(item[field]), 0);
    };


    return (
        <div className="mx-auto px-4 mt-6">
            <div className="flex justify-between items-center mb-4 w-full">
                <div className={"print:hidden"}>
                    <MonthPicker onMonthSelect={handleMonthSelect} />
                </div>
                <div className="text-3xl font-bold">
                    {year}년 {month}월달 배포대장
                </div>
                <div className={"print:hidden"}>
                    <button className="print:hidden btn btn-primary text-white">등록</button>
                </div>
            </div>
            <div className="flex justify-end mb-4">
                <table className="border-collapse">
                    <thead>
                    <tr className="bg-orange-200 font-bold">
                        <th className="border px-4 py-2">홀 합계</th>
                        <th className="border px-4 py-2">헤드 합계</th>
                        <th className="border px-4 py-2">그루브 합계</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="border text-center px-4 py-2">{getTotal('hole')}</td>
                        <td className="border text-center px-4 py-2">{getTotal('head')}</td>
                        <td className="border text-center px-4 py-2">{getTotal('groove')}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <table className="w-full border-collapse">
                <thead>
                <tr className="bg-blue-200 font-bold">
                    <th className="border px-4 py-2">회사</th>
                    <th className="border px-4 py-2">현장</th>
                    <th className="border px-4 py-2">구역</th>
                    <th className="border px-4 py-2">검사날짜</th>
                    <th className="border px-4 py-2">홀</th>
                    <th className="border px-4 py-2">헤드</th>
                    <th className="border px-4 py-2">그루브</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={index} className="border">
                        <td className="border text-center p-1 text-sm">{item.company}</td>
                        <td className="border text-center p-1 text-sm">{item.place}</td>
                        <td className="border text-center p-1 text-sm">{item.area}</td>
                        <td className="border text-center p-1 text-sm">{item.test_date}</td>
                        <td className="border text-center p-1 text-sm">{item.hole !== 0 && item.hole}</td>
                        <td className="border text-center p-1 text-sm">{item.head !== 0 && item.head}</td>
                        <td className="border text-center p-1 text-sm">{item.groove !== 0 && item.groove}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default Processing
