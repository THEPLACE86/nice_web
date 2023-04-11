import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {supabase} from "../../../utils/supabaseClient";
import TestListModal from "../../../components/quality/TestListModal";

function TestListPrint(props) {
    const {date} = props
    const router = useRouter();

    const [data, setData] = useState([])
    const [totalH, setTotalH] = useState(0)
    const [totalB, setTotalB] = useState(0)

    const [testDateInfo, setTestDateInfo] = useState({
        'lot_name':'','lot_num': 0,'lot_nameH':'','lot_numH': 0,
        'lot_name2':'','lot_num2': 0,'lot_nameH2':'','lot_numH2': 0,
        'lot_name3':'','lot_num3': 0,'lot_nameH3':'','lot_numH3': 0,
        'lot_name4':'','lot_num4': 0,'lot_nameH4':'','lot_numH4': 0,
        'memo':''
    })

    useEffect(() => {
        const getData = async () => {
            const {data, error} = await supabase.from('product').select().eq('test_date', date)
                .order('test_round', {ascending:true}).order('created_at', { ascending: true })
            setData(data)
        }
        getData().then(r => console.log(r))
    },[])

    useEffect(() => {
        const totalH = data.reduce((acc, item) => acc + item.totalH, 0);
        const totalB = data.reduce((acc, item) => acc + item.a25, 0);
        setTotalH(totalH);
        setTotalB(totalB)
    }, [data])

    useEffect(() => {
        const getTestDateListInfo = async () => {
            const {data, error} = await supabase.from('test_date').select().eq('test_date', date).single()
            console.log(data)
            if(data != null){
                setTestDateInfo({
                    'lot_name': data.lot_name,'lot_num': data.lot_num,'lot_nameH': data.lot_nameH,'lot_numH': data.lot_numH,
                    'lot_name2': data.lot_name2,'lot_num2': data.lot_num2,'lot_nameH2': data.lot_nameH2,'lot_numH2': data.lot_numH2,
                    'lot_name3': data.lot_name3,'lot_num3': data.lot_num3,'lot_nameH3': data.lot_nameH3,'lot_numH3': data.lot_numH3,
                    'lot_name4': data.lot_name4,'lot_num4': data.lot_num4,'lot_nameH4': data.lot_nameH4,'lot_numH4': data.lot_numH4,
                    'memo': data.memo
                })
            }
        }
        getTestDateListInfo().then(r => console.log(`testDateInfo ${r}`))
    }, [])

    return (
        <>
            <div className="mx-auto px-4">
                <div className="flex justify-end">
                    <span className={"font-bold text-xl pt-2 pb-2 mr-20 text-orange-500"}>{date} 검수 리스트</span>
                    <span className={"font-bold text-xl pt-2 pb-2"}>비확관 합계 : {totalB}</span>
                    <span className="ml-6 font-bold text-xl pt-2 pb-2">확관합계 : {totalH}</span>
                </div>
                <table className="table-auto w-full">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 w-8">No</th>
                            <th className="border border-gray-300 w-[280px]">현 장 명</th>
                            <th className="border border-gray-300 w-52">비 확 관</th>
                            <th className="border border-gray-300 w-52">확 관</th>
                            <th className="border border-gray-300 bg-gray-200 text-center">25A</th>
                            <th className="border border-gray-300 bg-orange-200 text-center">32A</th>
                            <th className="border border-gray-300 bg-orange-200 text-center">40A</th>
                            <th className="border border-gray-300 bg-orange-200 text-center">50A</th>
                            <th className="border border-gray-300 bg-orange-200 text-center">65A</th>
                            <th className="border border-gray-300 bg-blue-200 text-center">65A</th>
                            <th className="border border-gray-300 bg-blue-200 text-center">80A</th>
                            <th className="border border-gray-200 bg-blue-200 text-center">100A</th>
                            <th className="border border-gray-300 bg-blue-200 text-center">125A</th>
                            <th className="border border-gray-300 bg-blue-200 text-center">150A</th>
                            <th className="border border-gray-300 bg-gray-200 w-24 text-center">합계</th>
                        </tr>
                    </thead>
                    <tbody>
                    {data.map((item, index) => {
                        return (
                            <tr key={item.id} className={item.cancel ? "bg-red-500" : ""}>
                                <td className="border border-gray-300 text-center">{index + 1}</td>
                                <td className="border border-gray-300 pl-4">
                                    {item.company} {item.place} {item.area}
                                </td>
                                <td className="border border-gray-300 pt-2 pb-2">
                                    {item.a25 !== 0 && (
                                        <div className="flex items-center justify-center">
                                            {item.test_round === "1차" && (
                                                <p className="mr-2">
                                                    ({testDateInfo.lot_num}) {testDateInfo.lot_name}{" "}
                                                </p>
                                            )}
                                            {item.test_round === "2차" && (
                                                <p className="mr-2">
                                                    ({testDateInfo.lot_num2}) {testDateInfo.lot_name2}{" "}
                                                </p>
                                            )}
                                            {item.test_round === "3차" && (
                                                <p className="mr-2">
                                                    ({testDateInfo.lot_num3}) {testDateInfo.lot_name3}{" "}
                                                </p>
                                            )}
                                            {item.test_round === "4차" && (
                                                <p className="mr-2">
                                                    ({testDateInfo.lot_numH4}) {testDateInfo.lot_nameH4}{" "}
                                                </p>
                                            )}
                                            <p>{item.lot_number_start}&nbsp;~&nbsp;{item.lot_number_end} </p>
                                        </div>
                                    )}
                                </td>
                                <td className="border border-gray-300 pt-2 pb-2">
                                    {item.totalH !== 0 && (
                                        <div className="flex items-center justify-center">
                                            {item.test_round === "1차" && (
                                                <p className="mr-2">
                                                    ({testDateInfo.lot_numH}) {testDateInfo.lot_nameH}{" "}
                                                </p>
                                            )}
                                            {item.test_round === "2차" && (
                                                <p className="mr-2">
                                                    ({testDateInfo.lot_numH2}) {testDateInfo.lot_nameH2}{" "}
                                                </p>
                                            )}
                                            {item.test_round === "3차" && (
                                                <p className="mr-2">
                                                    ({testDateInfo.lot_numH3}) {testDateInfo.lot_nameH3}{" "}
                                                </p>
                                            )}
                                            {item.test_round === "4차" && (
                                                <p className="mr-2">
                                                    ({testDateInfo.lot_numH4}) {testDateInfo.lot_nameH4}{" "}
                                                </p>
                                            )}
                                            <p>{item.lot_number_startH}&nbsp;~&nbsp;{item.lot_number_endH} </p>
                                        </div>
                                    )}
                                </td>
                                <td className="border border-gray-300 bg-gray-100 text-center font-bold text-xl pt-2 pb-2">
                                    {item.a25 !== 0 && <p>{item.a25}</p>}
                                </td>
                                <td className="border border-gray-300 bg-orange-50 text-center font-bold text-xl pt-2 pb-2">
                                    {item.a32 !== 0 && <p>{item.a32}</p>}
                                </td>
                                <td className="border border-gray-300 bg-orange-50 text-center font-bold text-xl pt-2 pb-2">
                                    {item.a40 !== 0 && <p>{item.a40}</p>}
                                </td>
                                <td className="border border-gray-300 bg-orange-50 text-center font-bold text-xl pt-2 pb-2">
                                    {item.a50 !== 0 && <p>{item.a50}</p>}
                                </td>
                                <td className="border border-gray-300 bg-orange-50 text-center font-bold text-xl pt-2 pb-2">
                                    {item.a65 !== 0 && <p>{item.a65}</p>}
                                </td>
                                <td className="border border-gray-300 bg-blue-50 text-center font-bold text-xl pt-2 pb-2">
                                    {item.m65 !== 0 && <p>{item.m65}</p>}
                                </td>
                                <td className="border border-gray-300 bg-blue-50 text-center font-bold text-xl pt-2 pb-2">
                                    {item.m80 !== 0 && <p>{item.m80}</p>}
                                </td>
                                <td className="border border-gray-300 bg-blue-50 text-center font-bold text-xl pt-2 pb-2">
                                    {item.m100 !== 0 && <p>{item.m100}</p>}
                                </td>
                                <td className="border border-gray-300 bg-blue-50 text-center font-bold text-xl pt-2 pb-2">
                                    {item.m125 !== 0 && <p>{item.m125}</p>}
                                </td>
                                <td className="border border-gray-300 bg-blue-50 text-center font-bold text-xl pt-2 pb-2">
                                    {item.m150 !== 0 && <p>{item.m150}</p>}
                                </td>
                                <td className="border border-gray-300 pt-2 pb-2">
                                    <div className="flex flex-col items-center cursor-pointer">
                                        <p>확관 : {item.totalH}</p>
                                        <p>총합 : {item.totalH + item.a25}</p>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </>
    );
}

TestListPrint.getInitialProps = ({ query }) => {
    return { date: query.date };
};
export default TestListPrint