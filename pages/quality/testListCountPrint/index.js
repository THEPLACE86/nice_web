import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {supabase} from "../../../utils/supabaseClient";

function TestListCountPrint(props) {
    const {date} = props
    const router = useRouter();

    const [data, setData] = useState([])


    useEffect(() => {
        const getData = async () => {
            const {data, error} = await supabase.from('bunch').select().eq('test_date', date)
                .order('created_at', { ascending: true })
            setData(data)
        }
        getData().then(() => console.log())
    }, [])

    return(
        <>
            {data.map((item, index) => {
                if(item.print){
                    return(
                        <>
                            <table className="w-full text-center">
                                <thead>
                                <tr>
                                    <th
                                        className="border border-black p-6 font-bold text-4xl"
                                        colSpan="12"
                                        style={{ fontWeight: "bold", color: "#CB0000" }}
                                    >
                                        {index + 1}번 {item.place}
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className="border border-black py-2 w-36" rowSpan="2">
                                        1번다발
                                    </td>
                                    {/* 1번다발 - 25A */}
                                    <td className="border border-black py-2">25A</td>
                                    <td className="border border-black py-2">32A</td>
                                    <td className="border border-black py-2">40A</td>
                                    <td className="border border-black py-2">50A</td>
                                    <td className="border border-black py-2">65A</td>
                                    {/* 2번다발 */}
                                    <td className="border border-black py-2 w-36" rowSpan="2">
                                        2번다발
                                    </td>
                                    {/* 2번다발 - 25A */}
                                    <td className="border border-black py-2">25A</td>
                                    <td className="border border-black py-2">32A</td>
                                    <td className="border border-black py-2">40A</td>
                                    <td className="border border-black py-2">50A</td>
                                    <td className="border border-black py-2">65A</td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold text-3xl py-2 h-20">{item.a25_01 === 0 ? "" : item.a25_01}</td>
                                    <td className="border border-black font-bold text-3xl py-2">{item.a32_01 === 0 ? "" : item.a32_01}</td>
                                    <td className="border border-black font-bold text-3xl py-2">{item.a40_01 === 0 ? "" : item.a40_01}</td>
                                    <td className="border border-black font-bold text-3xl py-2">{item.a50_01 === 0 ? "" : item.a50_01}</td>
                                    <td className="border border-black font-bold text-3xl py-2">{item.a65_01 === 0 ? "" : item.a65_01}</td>
                                    <td className="border border-black font-bold text-3xl py-2">{item.a25_02 === 0 ? "" : item.a25_02}</td>
                                    <td className="border border-black font-bold text-3xl py-2">{item.a32_02 === 0 ? "" : item.a32_02}</td>
                                    <td className="border border-black font-bold text-3xl py-2">{item.a40_02 === 0 ? "" : item.a40_02}</td>
                                    <td className="border border-black font-bold text-3xl py-2">{item.a50_02 === 0 ? "" : item.a50_02}</td>
                                    <td className="border border-black font-bold text-3xl py-2">{item.a65_02 === 0 ? "" : item.a65_02}</td>
                                </tr>
                                <tr>
                                    <td className="border border-black bg-orange-100 py-2" rowSpan="2">
                                        3번다발
                                    </td>
                                    <td className="border border-black bg-orange-100 py-2">25A</td>
                                    <td className="border border-black bg-orange-100 py-2">32A</td>
                                    <td className="border border-black bg-orange-100 py-2">40A</td>
                                    <td className="border border-black bg-orange-100 py-2">50A</td>
                                    <td className="border border-black bg-orange-100 py-2">65A</td>
                                    <td className="border border-black py-2 bg-orange-100" rowSpan="2">
                                        4번다발
                                    </td>
                                    <td className="border border-black py-2 bg-orange-100">25A</td>
                                    <td className="border border-black py-2 bg-orange-100">32A</td>
                                    <td className="border border-black py-2 bg-orange-100">40A</td>
                                    <td className="border border-black py-2 bg-orange-100">50A</td>
                                    <td className="border border-black py-2 bg-orange-100">65A</td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold text-3xl py-2 h-20">{item.a25_04 === 0 ? "" : item.a25_04}</td>
                                    <td className="border border-black font-bold text-3xl py-2">{item.a32_04 === 0 ? "" : item.a32_04}</td>
                                    <td className="border border-black font-bold text-3xl py-2">{item.a40_04 === 0 ? "" : item.a40_04}</td>
                                    <td className="border border-black font-bold text-3xl py-2">{item.a50_04 === 0 ? "" : item.a50_04}</td>
                                    <td className="border border-black font-bold text-3xl py-2">{item.a65_04 === 0 ? "" : item.a65_04}</td>
                                    <td className="border border-black font-bold text-3xl py-2">{item.a25_05 === 0 ? "" : item.a25_05}</td>
                                    <td className="border border-black font-bold text-3xl py-2">{item.a32_05 === 0 ? "" : item.a32_05}</td>
                                    <td className="border border-black font-bold text-3xl py-2">{item.a40_05 === 0 ? "" : item.a40_05}</td>
                                    <td className="border border-black font-bold text-3xl py-2">{item.a50_05 === 0 ? "" : item.a50_05}</td>
                                    <td className="border border-black font-bold text-3xl py-2">{item.a65_05 === 0 ? "" : item.a65_05}</td>
                                </tr>
                                <tr>
                                    <td className="border border-black py-2" rowSpan="2">
                                        5번다발
                                    </td>
                                    <td className="border border-black py-2">25A</td>
                                    <td className="border border-black py-2">32A</td>
                                    <td className="border border-black py-2">40A</td>
                                    <td className="border border-black py-2">50A</td>
                                    <td className="border border-black py-2">65A</td>
                                    <td className="border border-black py-2" rowSpan="2">
                                        6번다발
                                    </td>
                                    <td className="border border-black py-2">25A</td>
                                    <td className="border border-black py-2">32A</td>
                                    <td className="border border-black py-2">40A</td>
                                    <td className="border border-black py-2">50A</td>
                                    <td className="border border-black py-2">65A</td>
                                </tr>
                                <tr>
                                    <td className="border border-black font-bold text-3xl py-2 h-20">{item.a25_05 === 0 ? "" : item.a25_05}</td>
                                    <td className="border border-black font-bold text-3xl py-2">{item.a32_05 === 0 ? "" : item.a32_05}</td>
                                    <td className="border border-black font-bold text-3xl py-2">{item.a40_05 === 0 ? "" : item.a40_05}</td>
                                    <td className="border border-black font-bold text-3xl py-2">{item.a50_05 === 0 ? "" : item.a50_05}</td>
                                    <td className="border border-black font-bold text-3xl py-2">{item.a65_05 === 0 ? "" : item.a65_05}</td>
                                    <td className="border border-black font-bold text-3xl py-2">{item.a25_06 === 0 ? "" : item.a25_06}</td>
                                    <td className="border border-black font-bold text-3xl py-2">{item.a32_06 === 0 ? "" : item.a32_06}</td>
                                    <td className="border border-black font-bold text-3xl py-2">{item.a40_06 === 0 ? "" : item.a40_06}</td>
                                    <td className="border border-black font-bold text-3xl py-2">{item.a50_06 === 0 ? "" : item.a50_06}</td>
                                    <td className="border border-black font-bold text-3xl py-2">{item.a65_06 === 0 ? "" : item.a65_06}</td>
                                </tr>
                                </tbody>
                            </table>
                            <br/>
                            <table className="mx-auto text-center" style={{ width: "800px" }}>
                                <tbody>
                                <tr>
                                    <td className="border border-black font-bold text-2xl w-36 py-2 bg-yellow-300" rowSpan="2">
                                        총수량
                                    </td>
                                    <td className="border border-black font-bold py-2">25A</td>
                                    <td className="border border-black font-bold py-2">32A</td>
                                    <td className="border border-black font-bold py-2">40A</td>
                                    <td className="border border-black font-bold py-2">50A</td>
                                    <td className="border border-black font-bold py-2">65A</td>
                                </tr>
                                <tr>
                                    <td className="border border-black py-2 h-20 font-bold text-3xl">
                                        {item.total25 === 0 ? "" : item.total25}
                                    </td>
                                    <td className="border border-black py-2 font-bold text-3xl">
                                        {item.total32 === 0 ? "" : item.total32}
                                    </td>
                                    <td className="border border-black py-2 font-bold text-3xl">
                                        {item.total40 === 0 ? "" : item.total40}
                                    </td>
                                    <td className="border border-black py-2 font-bold text-3xl">
                                        {item.total50 === 0 ? "" : item.total50}
                                    </td>
                                    <td className="border border-black py-2 font-bold text-3xl">
                                        {item.total65 === 0 ? "" : item.total65}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <br/> <br/> <br/> <br/> <br/><br/><br/>
                        </>
                    )
                }
                })
            }
        </>
    )
}

TestListCountPrint.getInitialProps = ({ query }) => {
    return { date: query.date };
};

export default TestListCountPrint
