import {useEffect, useState} from "react";
import {supabase} from "../../utils/supabaseClient";
import formatDate from "../../utils/formatDate";
import MonthPicker from "../../components/MonthPicker";
import Pagination from "../../components/pagination";
import SalesDate from "../../components/shipment/SalesDate";

const itemsPerPage = 25;

const Processing = () => {
    const [data, setData] = useState([]);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totals, setTotals] = useState({
        hole: 0, head: 0, groove: 0
    });

    // useEffect(() => {
    //     fetchAndUpdateData();
    // },[])
    // const fetchAndUpdateData = async () => {
    //     // 1. 기존 데이터 가져오기
    //     const { data, error } = await supabase
    //         .from("shipment")
    //         .select("id, test_date");
    //
    //     if (error) {
    //         console.error("Error fetching data: ", error);
    //         return;
    //     }
    //
    //     // 2. 가져온 데이터를 반복하고 각 행의 test_date 값을 수정합니다.
    //     const updatedData = data.map((item) => {
    //         const dateParts = item.test_date.match(/(\d+)/g);
    //         const [year, month, day] = dateParts;
    //
    //         const paddedMonth = String(month).padStart(2, "0");
    //         const paddedDay = String(day).padStart(2, "0");
    //
    //         const formattedDate = `${year}년 ${paddedMonth}월 ${paddedDay}일`;
    //
    //         // 3. 기존 데이터가 2023년 10월 20일 이런 식으로 앞에 0이 안 들어가도 되면 수정하지 않고 앞에 0이 들어가야 하는 경우에만 수정하도록
    //         if (formattedDate !== item.test_date) {
    //             return { id: item.id, test_date: formattedDate };
    //         }
    //
    //         return null;
    //     });
    //
    //     // 필터링하여 null 값을 제거합니다.
    //     const filteredData = updatedData.filter((item) => item !== null);
    //
    //     // 4. 수정된 데이터를 다시 데이터베이스에 업데이트합니다.
    //     const { error: updateError } = await supabase
    //         .from("shipment")
    //         .upsert(filteredData, { onConflict: "id" });
    //
    //     if (updateError) {
    //         console.error("Error updating data: ", updateError);
    //         return;
    //     }
    //
    //     console.log("Data updated successfully");
    // };

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

    const getTotal = (field) => {
        return data.reduce((total, item) => total + parseInt(item[field]), 0);
    };

    const onPageChange = (page) => {
        setCurrentPage(page);
    }

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
                    <th className="border px-4 py-2">배포날짜</th>
                    <th className="border px-4 py-2">회사</th>
                    <th className="border px-4 py-2">현장</th>
                    <th className="border px-4 py-2">구역</th>
                    <th className="border px-4 py-2 w-20">홀</th>
                    <th className="border px-4 py-2 w-20">헤드</th>
                    <th className="border px-4 py-2 w-20">그루브</th>
                    <th className="border px-4 py-2">검사날짜</th>
                    <th className="border px-4 py-2">출하날짜</th>
                    <th className="border px-4 py-2">매출날짜</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={index} className="border">
                        <td className="border text-center p-1 text-sm">{item.drawing_date}</td>
                        <td className="border text-center p-1 text-sm">{item.company}</td>
                        <td className="border text-center p-1 text-sm">{item.place}</td>
                        <td className="border text-center p-1 text-sm">{item.area}</td>
                        <td className="border text-center p-1 text-sm">{item.hole !== 0 && item.hole}</td>
                        <td className="border text-center p-1 text-sm">{item.head !== 0 && item.head}</td>
                        <td className="border text-center p-1 text-sm">{item.groove !== 0 && item.groove}</td>
                        <td className="border text-center p-1 text-sm">{item.test_date}</td>
                        <td className="border text-center p-1 text-sm">{item.shipment_date}</td>
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
