import {useEffect, useState} from "react";
import {supabase} from "../../utils/supabaseClient";
import MonthPicker from "../../components/MonthPicker";
import Pagination from "../../components/pagination";
import SalesDate from "../../components/shipment/SalesDate";
import {useRouter} from "next/router";

const itemsPerPage = 25;

const Processing = () => {
    const router = useRouter();
    const [data, setData] = useState([]);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totals, setTotals] = useState({
        hole: 0, head: 0, groove: 0
    });

    const fetchData = async () => {
        const yearMonth = `${year}년 ${String(month).padStart(2, '0')}월`.toString();

        const response = await supabase
            .from('product_list')
            .select('*', { count: 'exact' })
            .eq('drawing', true)
            .like('test_date', `%${yearMonth}%`)
            .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)
            .order('test_date', { ascending: true })
            .order('sales_date', {ascending: true})

        if (response.data) {
            setData(response.data);
            if (response.count) {
                setTotalPages(Math.ceil(response.count / itemsPerPage));
            }
        }
        console.log(response)
    }

    const fetchTotals = async () => {
        const yearMonth = `${year}년 ${String(month).padStart(2, '0')}월`.toString();

        const response = await supabase
            .from('product_list')
            .select('hole, head, groove')
            .like('test_date', `%${yearMonth}%`)

        let totalHole = 0;
        let totalHead = 0;
        let totalGroove = 0;

        if (response.data) {
            response.data.forEach(row => {
                totalHole += row.hole;
                totalHead += row.head;
                totalGroove += row.groove;
            });

            setTotals({
                hole: totalHole,
                head: totalHead,
                groove: totalGroove
            });
        }
    };

    useEffect(() => {
        fetchData()
    }, [currentPage, year, month]);

    useEffect(() => {
        fetchTotals()
    }, [year, month]);

    const handleMonthSelect = (year, month) => {
        setYear(year);
        setMonth(month);
    };

    const onPageChange = (page) => {
        setCurrentPage(page);
    }

    return (
        <div className="mx-auto mt-6">
            <div className="flex justify-between mb-4">
                <div className={"print:hidden"}>
                    <MonthPicker onMonthSelect={handleMonthSelect} />
                </div>
                <div className="text-3xl font-bold">
                    {year}년 {month}월달 배포대장
                </div>
                <div className={"print:hidden"}>
                    <button className="btn btn-accent text-white mr-4" onClick={() => router.push('/processing/print')}>출력</button>
                    <button className="btn btn-primary text-white">등록</button>
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
                        <td className="border text-center px-4 py-2">{totals.hole}</td>
                        <td className="border text-center px-4 py-2">{totals.head}</td>
                        <td className="border text-center px-4 py-2">{totals.groove}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <table className="w-full border-collapse">
                <thead>
                <tr className="bg-blue-200 font-bold">
                    <th className="border px-4 text-sm py-2 w-24">배포날짜</th>
                    <th className="border px-4 text-sm py-2 w-16">담당</th>
                    <th className="border px-4 text-sm py-2">회사</th>
                    <th className="border px-4 text-sm py-2">현장</th>
                    <th className="border px-4 text-sm py-2">구역</th>
                    <th className="border px-4 text-sm py-2 w-20">홀</th>
                    <th className="border px-4 text-sm py-2 w-20">헤드</th>
                    <th className="border px-4 text-sm py-2 w-20">그루브</th>
                    <th className="border px-4 text-sm py-2 w-24">검사날짜</th>
                    <th className="border px-4 text-sm py-2 w-28">출하날짜(가)</th>
                    <th className="border px-4 text-sm py-2 w-28">출하날짜(메)</th>
                    <th className="border px-4 text-sm py-2 w-28">매출날짜</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={index} className="border">
                        <td className="border text-center p-1 text-sm">{item.drawing_date && item.drawing_date.substring(6)}</td>
                        <td className="border text-center p-1 text-sm">{item.name}</td>
                        <td className="border text-center p-1 text-sm">{item.company} (<span className={'text-orange-600 font-bold'}>{item.initial}</span>)</td>
                        <td className="border text-center p-1 text-sm">{item.place}</td>
                        <td className="border text-center p-1 text-sm">{item.area}</td>
                        <td className="border text-center p-1 text-sm">{item.hole !== 0 && item.hole}</td>
                        <td className="border text-center p-1 text-sm">{item.head !== 0 && item.head}</td>
                        <td className="border text-center p-1 text-sm">{item.groove !== 0 && item.groove}</td>
                        <td className="border text-center p-1 text-sm">{item.test_date && item.test_date.substring(6)}</td>
                        <td className="border text-center p-1 text-sm">{item.shipment_date && item.shipment_date.substring(6)}</td>
                        <td className="border text-center p-1 text-sm">{item.shipment_dateM && item.shipment_dateM.substring(6)}</td>
                        <td className="border text-center p-1 text-sm text-orange-600"><SalesDate item={item} onDataChange={fetchData} /></td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="container mx-auto">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
        </div>
    )
}

export default Processing