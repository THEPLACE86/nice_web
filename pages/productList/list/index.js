import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {supabase} from "../../../utils/supabaseClient";
import ProductListTable from "../../../components/productList/ProductListTable";
import { format, addDays, subDays } from 'date-fns';

const List = (props) => {
    const { date } = props;
    const router = useRouter()
    const [data, setData] = useState([]);
    const workTypes = ["용접/무용접", "전실/입상", "나사", "기타"];

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase.from("product_list").select().eq('test_date', date).order('created_at', {ascending: true});
            if (error) {
                console.error("Error fetching data:", error);
            } else {
                setData(data);
            }
        };
        fetchData()
    }, [date]);

    useEffect(() => {
        const ch = supabase.channel('any')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'product_list' }, payload => {
                console.log('Change received!', payload)

                if (payload.eventType === "UPDATE") {
                    if (payload.new.test_date !== date) {
                        console.log(payload.old.test_date)
                        console.log(payload.new.test_date)

                        setData((prevChannels) => {
                            const updatedChannels = prevChannels.map((channel) =>
                                channel.id === payload.new.id ? payload.new : channel
                            );
                            if (payload.new.test_date === date) {
                                // 새로운 test_date가 현재 페이지의 날짜와 같으면 목록에 추가
                                return [...updatedChannels, payload.new];
                            } else {
                                // 현재 목록에서 test_date가 변경된 항목을 제거
                                return updatedChannels.filter(channel => channel.test_date === date);
                            }
                        });
                    } else {
                        console.log('실행됨')
                        setData((prevChannels) => {
                            return prevChannels.map((channel) =>
                                channel.id === payload.new.id ? payload.new : channel
                            );
                        });
                    }
                } else {
                    switch (payload.eventType) {
                        case "INSERT":
                            if (payload.new.test_date === date) {
                                setData((prevChannels) => [...prevChannels, payload.new]);
                            }
                            break;
                        case "DELETE":
                            setData((prevChannels) =>
                                prevChannels.filter((channel) => channel.id !== payload.old.id)
                            );
                            break;
                        default:
                            break;
                    }
                }
            }).subscribe()
    }, [])

    const goToCreate = () => {
        router.push({
            pathname: '/productList/create',
            query: { date: date },
        });
    }

    const moveDate = (next) => {
        if (next){
            const newDate = new Date(date.replace(/(\d{4})년 (\d{1,2})월 (\d{1,2})일/, '$1-$2-$3'));
            newDate.setDate(newDate.getDate() - 7);

            const dateFormatter = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
            const dateString = dateFormatter.format(newDate);

            router.push({
                pathname: '/productList/list',
                query: { date: dateString },
            });
        }else{
            const newDate = new Date(date.replace(/(\d{4})년 (\d{1,2})월 (\d{1,2})일/, '$1-$2-$3'));
            newDate.setDate(newDate.getDate() + 7);

            const dateFormatter = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
            const dateString = dateFormatter.format(newDate);

            router.push({
                pathname: '/productList/list',
                query: { date: dateString },
            });
        }
    }

    const totalHead = data.reduce((sum, item) => sum + item.head, 0);
    const totalHole = data.reduce((sum, item) => sum + item.hole, 0);
    const totalGroove = data.reduce((sum, item) => sum + item.groove, 0);

    return (
        <div>
            <div className="flex mt-10 mb-10 items-center">
                <div className="flex items-center">
                    <button className="print:hidden btn btn-primary rounded text-white w-32 mr-4" onClick={() => moveDate(true)}>지난주</button>
                    <button className="print:hidden btn btn-primary rounded text-white w-32 mr-4" onClick={() => moveDate(false)}>다음주</button>
                </div>
                <div className="flex-grow text-center">
                    <span className="font-bold text-3xl">
                      <span className="text-orange-600 font-bold text-3xl">{date}</span> 생산계획표
                    </span>
                </div>
                <div className="flex items-center">
                    <button className="print:hidden btn btn-info rounded text-white w-32 mr-4" onClick={goToCreate}>히스토리</button>
                    <button className="print:hidden btn btn-primary rounded text-white w-32 mr-4" onClick={goToCreate}>등록</button>
                </div>
            </div>
            {workTypes.map((type) => (
                <ProductListTable
                    key={type}
                    type={type}
                    data={data.filter((item) => item.work_type === type)}
                />
            ))}
            <div className="mt-10">
                <h1 className="text-2xl text-orange-600 font-semibold mb-2 text-center">총 합계</h1>
                <table className="w-1/3 border-collapse mx-auto">
                    <thead>
                    <tr>
                        <th className="border border-gray-400 bg-orange-50 p-2 text-center w-32">헤드 합계</th>
                        <th className="border border-gray-400 bg-orange-50 p-2 text-center w-32">홀 합계</th>
                        <th className="border border-gray-400 bg-orange-50 p-2 text-center w-32">그루브 합계</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="border border-gray-400 p-2 text-center">{totalHead}</td>
                        <td className="border border-gray-400 p-2 text-center">{totalHole}</td>
                        <td className="border border-gray-400 p-2 text-center">{totalGroove}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

List.getInitialProps = ({ query }) => {
    return { date: query.date }
};

export default List
