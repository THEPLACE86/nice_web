import {useEffect, useState} from "react";
import {supabase} from "../../../utils/supabaseClient";
import BarChartStats from "../../../components/productList/BarChartStats";
import DatePicker from 'react-datepicker';

const Statistics = () => {
    const [stats, setStats] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date());
    const pageTitle = `${selectedYear.getFullYear()}년 작업 통계`;

    async function getMonthlyStats(year) {
        const { data, error } = await supabase
            .from('product_list')
            .select('test_date, head, groove, hole')
            .ilike('test_date', `${year}년 %`)
            .order('test_date', { ascending: true });

        if (error) throw error;

        // 데이터를 월별로 그룹화
        return data.reduce((acc, item) => {
            const month = item.test_date.slice(0, 8);
            if (!acc[month]) {
                acc[month] = { head: 0, groove: 0, hole: 0 };
            }
            acc[month].head += item.head;
            acc[month].groove += item.groove;
            acc[month].hole += item.hole;
            return acc;
        }, {});
    }

    useEffect(() => {
        async function fetchData() {
            const monthlyStats = await getMonthlyStats(selectedYear.getFullYear());
            const chartData = Object.entries(monthlyStats).map(([month, data]) => ({
                month,
                ...data,
            }));
            setStats(chartData);
        }

        fetchData();
    }, [selectedYear]);

    function calculateTotal(data, field) {
        return data.reduce((acc, row) => acc + row[field], 0);
    }

    return (
        <div className="mx-auto px-4">
            <div className="flex mt-10 mb-10 items-center">
                <div className="flex-grow text-center">
                    <span className="font-bold text-3xl">
                      <span className="text-orange-600 font-bold text-3xl">{pageTitle}</span>
                    </span>
                </div>
                <div className="flex items-center">
                    <DatePicker
                        className="btn btn-primary text-white border border-gray-300 rounded-md p-2"
                        selected={selectedYear}
                        onChange={(date) => setSelectedYear(date)}
                        showYearPicker
                        dateFormat="yyyy년"
                    />
                </div>
            </div>
            <div className="flex justify-center">
                <BarChartStats data={stats} />
            </div>
            <div className="mt-8">
                <table className="w-full text-center border-collapse border border-gray-300">
                    <thead>
                    <tr>
                        <th className="border border-gray-300 bg-orange-100 p-2">항목</th>
                        {stats.map((row) => (
                            <th key={row.month} className="border border-gray-300 bg-orange-100 p-2">
                                {row.month.slice(5)}
                            </th>
                        ))}
                        <th className="border border-gray-300 bg-orange-100 p-2">최종 합계</th>
                    </tr>
                    </thead>
                    <tbody>
                    {['hole', 'head', 'groove'].map((field) => (
                        <tr key={field}>
                            <td className={`border border-gray-300 p-2`}>
                                {field === 'hole' ? '홀' : field === 'head' ? '헤드' : '그루브'}
                            </td>
                            {stats.map((row) => (
                                <td key={row.month} className={`border border-gray-300 p-2`}>
                                    {row[field]}
                                </td>
                            ))}
                            <td className={`border border-gray-300 p-2`}>
                                {calculateTotal(stats, field)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Statistics