import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabaseClient";
import {useRouter} from "next/navigation";

const History = (props) => {
    const { date } = props;
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const router = useRouter()

    useEffect(() => {
        fetchData();
    }, [search]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
    };

    const fetchData = async () => {
        const { data, error } = await supabase
            .from("product_history")
            .select()
            .like('place', `%${search}%`)
            .eq("test_date", date)
            .order("updated_at", { ascending: false });
        if (error) console.error(error);
        else setData(data);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    return (
        <div className="w-[800px] mx-auto p-4">
            <div className="text-center mb-6 mt-6">
                <span className="font-bold text-2xl">{date} 히스토리</span>
                <button className="btn btn-primary ml-4" onClick={() => router.back()}>뒤로가기</button>
                <div className="mt-4">
                    <input
                        type="text"
                        className="border-2 border-gray-300 p-2 rounded w-full"
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="회사명 , 현장명, 구역명 전체 검색"
                    />
                </div>
            </div>
            <ul>
                {data.map((item) => (
                    <li key={item.id} className="mb-4">
                        <div className="w-full rounded shadow-lg p-4 bg-gray-100">
                            <div className="font-bold text-xl mb-2">
                                {item.place}
                                <span className={"ml-4"}>{item.old_state}</span>
                                <span>{item.new_state !== null && ' -> '}</span>
                                <span className={`${item.new_state === '작업중' && 'text-blue-700'} ${item.new_state === '작업완료' && 'text-yellow-600'} ${item.new_state === '출하완료' && 'text-red-700'}`}>{item.new_state}</span>
                            </div>
                            <p>{item.name}</p>
                            <p className="text-gray-700 text-base">{formatDate(item.created_at)}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

History.getInitialProps = ({ query }) => {
    return { date: query.date };
};

export default History;