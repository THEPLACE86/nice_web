import {useRouter} from "next/router";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {useEffect, useState} from "react";
import styles from "@/pages/quality/testDateList/testListCountPrint/TestDateCountPrint.module.css";

function TestListCountPrint(props) {
    const {date} = props
    const router = useRouter();
    const supabaseClient = useSupabaseClient();

    const [data, setData] = useState([])


    useEffect(() => {
        const getData = async () => {
            const {data, error} = await supabaseClient.from('bunch').select().eq('test_date', date).order('created_at', { ascending: true })
            setData(data)
        }
        getData().then(() => console.log())
    }, [])

    return(
        <>
            {data.map((item, index) => {
                return(
                    <>
                        <table className={`${styles.tg}`}>
                            <colgroup>
                                <col className={`${styles.col_width1}`}/>
                                <col className={`${styles.col_width1}`}/>
                                <col className={`${styles.col_width1}`}/>
                                <col className={`${styles.col_width1}`}/>
                                <col className={`${styles.col_width1}`}/>
                                <col className={`${styles.col_width1}`}/>
                                <col className={`${styles.col_width1}`}/>
                                <col className={`${styles.col_width1}`}/>
                                <col className={`${styles.col_width1}`}/>
                                <col className={`${styles.col_width1}`}/>
                                <col className={`${styles.col_width1}`}/>
                                <col className={`${styles.col_width1}`}/>
                            </colgroup>
                            <thead>
                            <tr>
                                <th className={`${styles.tg_v4ld}`} colSpan="12">
                                    <span style={{ fontWeight: "bold", color: "#CB0000"}}>{index+1}번 {item.place}</span>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td className={`${styles.tg_uzvj}`} rowSpan="2">1번다발</td>
                                <td className={`${styles.tg_uzvj}`}>25A</td>
                                <td className={`${styles.tg_uzvj}`}>32A</td>
                                <td className={`${styles.tg_uzvj}`}>40A</td>
                                <td className={`${styles.tg_uzvj}`}>50A</td>
                                <td className={`${styles.tg_uzvj}`}>65A</td>
                                <td className={`${styles.tg_uzvj}`} rowSpan="2">2번다발</td>
                                <td className={`${styles.tg_uzvj}`}>25A</td>
                                <td className={`${styles.tg_uzvj}`}>32A</td>
                                <td className={`${styles.tg_uzvj}`}>40A</td>
                                <td className={`${styles.tg_uzvj}`}>50A</td>
                                <td className={`${styles.tg_uzvj}`}>65A</td>
                            </tr>
                            <tr>
                                <td className={`${styles.tg_9wq8}`}>{item.a25_01 === 0 ? "" : item.a25_01}</td>
                                <td className={`${styles.tg_9wq8}`}>{item.a32_01 === 0 ? "" : item.a32_01}</td>
                                <td className={`${styles.tg_9wq8}`}>{item.a40_01 === 0 ? "" : item.a40_01}</td>
                                <td className={`${styles.tg_9wq8}`}>{item.a50_01 === 0 ? "" : item.a50_01}</td>
                                <td className={`${styles.tg_9wq8}`}>{item.a65_01 === 0 ? "" : item.a65_01}</td>
                                <td className={`${styles.tg_9wq8}`}>{item.a25_02 === 0 ? "" : item.a25_02}</td>
                                <td className={`${styles.tg_9wq8}`}>{item.a32_02 === 0 ? "" : item.a32_02}</td>
                                <td className={`${styles.tg_9wq8}`}>{item.a40_02 === 0 ? "" : item.a40_02}</td>
                                <td className={`${styles.tg_9wq8}`}>{item.a50_02 === 0 ? "" : item.a50_02}</td>
                                <td className={`${styles.tg_9wq8}`}>{item.a65_02 === 0 ? "" : item.a65_02}</td>
                            </tr>
                            <tr>
                                <td className={`${styles.tg_dium}`} rowSpan="2">3번다발</td>
                                <td className={`${styles.tg_dium}`}>25A</td>
                                <td className={`${styles.tg_dium}`}>32A</td>
                                <td className={`${styles.tg_dium}`}>40A</td>
                                <td className={`${styles.tg_dium}`}>50A</td>
                                <td className={`${styles.tg_dium}`}>65A</td>
                                <td className={`${styles.tg_dium}`} rowSpan="2">4번다발</td>
                                <td className={`${styles.tg_dium}`}>25A</td>
                                <td className={`${styles.tg_dium}`}>32A</td>
                                <td className={`${styles.tg_dium}`}>40A</td>
                                <td className={`${styles.tg_dium}`}>50A</td>
                                <td className={`${styles.tg_dium}`}>65A</td>
                            </tr>
                            <tr>
                                <td className={`${styles.tg_jq7l}`}>{item.a25_03 === 0 ? "" : item.a25_03}</td>
                                <td className={`${styles.tg_jq7l}`}>{item.a32_03 === 0 ? "" : item.a32_03}</td>
                                <td className={`${styles.tg_jq7l}`}>{item.a40_03 === 0 ? "" : item.a40_03}</td>
                                <td className={`${styles.tg_jq7l}`}>{item.a50_03 === 0 ? "" : item.a50_03}</td>
                                <td className={`${styles.tg_jq7l}`}>{item.a65_03 === 0 ? "" : item.a65_03}</td>
                                <td className={`${styles.tg_jq7l}`}>{item.a25_04 === 0 ? "" : item.a25_04}</td>
                                <td className={`${styles.tg_jq7l}`}>{item.a32_04 === 0 ? "" : item.a32_04}</td>
                                <td className={`${styles.tg_jq7l}`}>{item.a40_04 === 0 ? "" : item.a40_04}</td>
                                <td className={`${styles.tg_jq7l}`}>{item.a50_04 === 0 ? "" : item.a50_04}</td>
                                <td className={`${styles.tg_jq7l}`}>{item.a65_04 === 0 ? "" : item.a65_04}</td>
                            </tr>
                            <tr>
                                <td className={`${styles.tg_uzvj}`} rowSpan="2">5번다발</td>
                                <td className={`${styles.tg_uzvj}`}>25A</td>
                                <td className={`${styles.tg_uzvj}`}>32A</td>
                                <td className={`${styles.tg_uzvj}`}>40A</td>
                                <td className={`${styles.tg_uzvj}`}>50A</td>
                                <td className={`${styles.tg_uzvj}`}>65A</td>
                                <td className={`${styles.tg_uzvj}`} rowSpan="2">6번다발</td>
                                <td className={`${styles.tg_uzvj}`}>25A</td>
                                <td className={`${styles.tg_uzvj}`}>32A</td>
                                <td className={`${styles.tg_uzvj}`}>40A</td>
                                <td className={`${styles.tg_uzvj}`}>50A</td>
                                <td className={`${styles.tg_uzvj}`}>65A</td>
                            </tr>
                            <tr>
                                <td className={`${styles.tg_9wq8}`}>{item.a25_05 === 0 ? "" : item.a25_05}</td>
                                <td className={`${styles.tg_9wq8}`}>{item.a32_05 === 0 ? "" : item.a32_05}</td>
                                <td className={`${styles.tg_9wq8}`}>{item.a40_05 === 0 ? "" : item.a40_05}</td>
                                <td className={`${styles.tg_9wq8}`}>{item.a50_05 === 0 ? "" : item.a50_05}</td>
                                <td className={`${styles.tg_9wq8}`}>{item.a65_05 === 0 ? "" : item.a65_05}</td>
                                <td className={`${styles.tg_9wq8}`}>{item.a25_06 === 0 ? "" : item.a25_06}</td>
                                <td className={`${styles.tg_9wq8}`}>{item.a32_06 === 0 ? "" : item.a32_06}</td>
                                <td className={`${styles.tg_9wq8}`}>{item.a40_06 === 0 ? "" : item.a40_06}</td>
                                <td className={`${styles.tg_9wq8}`}>{item.a50_06 === 0 ? "" : item.a50_06}</td>
                                <td className={`${styles.tg_9wq8}`}>{item.a65_06 === 0 ? "" : item.a65_06}</td>
                            </tr>
                            <tr>
                                <td className={`${styles.tg_9wq8}`} colSpan="12"></td>
                            </tr>
                            <tr>
                                <td className={`${styles.tg_9wq8}`} colSpan="3" rowSpan="2"></td>
                                <td className={`${styles.tg_9wq8}`} style={{ fontSize: "1.5rem", backgroundColor: "#ffd591"}} rowSpan="2">총수량</td>
                                <td className={`${styles.tg_9wq8_sub}`}>25A</td>
                                <td className={`${styles.tg_9wq8_sub}`}>32A</td>
                                <td className={`${styles.tg_9wq8_sub}`}>40A</td>
                                <td className={`${styles.tg_9wq8_sub}`}>50A</td>
                                <td className={`${styles.tg_9wq8_sub}`}>65A</td>
                                <td className={`${styles.tg_9wq8}`} colSpan="3" rowSpan="2"></td>
                            </tr>
                            <tr>
                                <td className={`${styles.tg_9wq8}`}>{item.total25 === 0 ? "" : item.total25}</td>
                                <td className={`${styles.tg_9wq8}`}>{item.total32 === 0 ? "" : item.total32}</td>
                                <td className={`${styles.tg_9wq8}`}>{item.total40 === 0 ? "" : item.total40}</td>
                                <td className={`${styles.tg_9wq8}`}>{item.total50 === 0 ? "" : item.total50}</td>
                                <td className={`${styles.tg_9wq8}`}>{item.total65 === 0 ? "" : item.total65}</td>
                            </tr>
                            </tbody>
                        </table>
                        <br/> <br/> <br/> <br/> <br/><br/><br/>
                    </>
                )})
            }
        </>
    )
}

TestListCountPrint.getInitialProps = ({ query }) => {
    return { date: query.formattedDate };
};

export default TestListCountPrint