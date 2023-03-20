import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {Button, Col, Form, Input, InputNumber, Row, Tabs} from "antd";
import styles from "@/pages/quality/testDateList/testListPrint/TestListPrint.module.css";

function TestListPrint(props) {
    const {date} = props
    const router = useRouter();
    const supabaseClient = useSupabaseClient();

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
            const {data, error} = await supabaseClient.from('product').select().eq('test_date', date)
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
            const {data, error} = await supabaseClient.from('test_date').select().eq('test_date', date).single()
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
                <Col>
                    <Row justify="end">
                        <h4>비확관 합계 : {totalB}</h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<h4>확관합계 : {totalH}</h4>
                    </Row>
                    <table className={`${styles.tg}`}>
                        <colgroup>
                            <col className={`${styles.col_width1}`}/>
                            <col className={`${styles.col_width2}`}/>
                            <col className={`${styles.col_width3}`}/>
                            <col className={`${styles.col_width3}`}/>
                            <col className={`${styles.col_width4}`}/>
                            <col className={`${styles.col_width4}`}/>
                            <col className={`${styles.col_width4}`}/>
                            <col className={`${styles.col_width4}`}/>
                            <col className={`${styles.col_width4}`}/>
                            <col className={`${styles.col_width4}`}/>
                            <col className={`${styles.col_width4}`}/>
                            <col className={`${styles.col_width4}`}/>
                            <col className={`${styles.col_width4}`}/>
                            <col className={`${styles.col_width4}`}/>
                            <col className={`${styles.col_width5}`}/>
                        </colgroup>
                        <thead>
                        <tr>
                            <th className={`${styles.tg_x51a}`}>No.</th>
                            <th className={`${styles.tg_x51a}`}>현 장 명</th>
                            <th className={`${styles.tg_x51a}`}>비 확 관</th>
                            <th className={`${styles.tg_x51a}`}>확 관</th>
                            <th className={`${styles.tg_n5hu}`}>25A</th>
                            <th className={`${styles.tg_y4ne}`}>32A</th>
                            <th className={`${styles.tg_y4ne}`}>40A</th>
                            <th className={`${styles.tg_y4ne}`}>50A</th>
                            <th className={`${styles.tg_y4ne}`}>65A</th>
                            <th className={`${styles.tg_f79y}`}>65A</th>
                            <th className={`${styles.tg_f79y}`}>80A</th>
                            <th className={`${styles.tg_f79y}`}>100A</th>
                            <th className={`${styles.tg_f79y}`}>125A</th>
                            <th className={`${styles.tg_f79y}`}>150A</th>
                            <th className={`${styles.tg_7btt}`}>합계</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((item, index) => {

                            return (
                                <tr key={item.id}>
                                    <td className={`${styles.tg_coj7}`}>{index+1}</td>
                                    <td className={`${styles.tg_r1gl}`}><p>&nbsp;&nbsp;&nbsp;{item.company} {item.place} {item.area}</p></td>
                                    <td className={`${styles.tg_coj7}`}>
                                        {item.a25 !== 0 &&
                                            <Row align="center">
                                                {item.test_round === '1차' && (
                                                    <p style={{ fontSize: "large"}}>({testDateInfo.lot_num}) {testDateInfo.lot_name}</p>
                                                )}
                                                {item.test_round === '2차' && (
                                                    <p style={{ fontSize: "large"}}>({testDateInfo.lot_num2}) {testDateInfo.lot_name2}</p>
                                                )}
                                                {item.test_round === '3차' && (
                                                    <p style={{ fontSize: "large"}}>({testDateInfo.lot_num3}) {testDateInfo.lot_name3}</p>
                                                )}
                                                {item.test_round === '4차' && (
                                                    <p style={{ fontSize: "large"}}>({testDateInfo.lot_num4}) {testDateInfo.lot_name4}</p>
                                                )}
                                                <p style={{ fontSize: "large"}}>&nbsp;{item.lot_number_start}&nbsp;~&nbsp;{item.lot_number_end} </p>
                                            </Row>
                                        }
                                    </td>
                                    <td>
                                        {item.totalH !== 0 &&
                                            <Row align="center">
                                                {item.test_round === '1차' && (
                                                    <p style={{ fontSize: "large"}}>({testDateInfo.lot_numH}) {testDateInfo.lot_nameH}</p>
                                                )}
                                                {item.test_round === '2차' && (
                                                    <p style={{ fontSize: "large"}}>({testDateInfo.lot_numH2}) {testDateInfo.lot_nameH2}</p>
                                                )}
                                                {item.test_round === '3차' && (
                                                    <p style={{ fontSize: "large"}}>({testDateInfo.lot_numH3}) {testDateInfo.lot_nameH3}</p>
                                                )}
                                                {item.test_round === '4차' && (
                                                    <p style={{ fontSize: "large"}}>({testDateInfo.lot_numH4}) {testDateInfo.lot_nameH4}</p>
                                                )}
                                                <p style={{ fontSize: "large"}}>&nbsp;{item.lot_number_startH}&nbsp;~&nbsp;{item.lot_number_endH} </p>
                                            </Row>
                                        }
                                    </td>
                                    <td className={`${styles.tg_ky08}`}>{item.a25 !== 0 ? <p style={{ fontSize: "large", fontWeight: "bold"}}>{item.a25}</p> : <p></p>}</td>
                                    <td className={`${styles.tg_7fs8}`}>{item.a32 !== 0 ? <p style={{ fontSize: "large", fontWeight: "bold"}}>{item.a32}</p> : <p></p>}</td>
                                    <td className={`${styles.tg_7fs8}`}>{item.a40 !== 0 ? <p style={{ fontSize: "large", fontWeight: "bold"}}>{item.a40}</p> : <p></p>}</td>
                                    <td className={`${styles.tg_7fs8}`}>{item.a50 !== 0 ? <p style={{ fontSize: "large", fontWeight: "bold"}}>{item.a50}</p> : <p></p>}</td>
                                    <td className={`${styles.tg_7fs8}`}>{item.a65 !== 0 ? <p style={{ fontSize: "large", fontWeight: "bold"}}>{item.a65}</p> : <p></p>}</td>
                                    <td className={`${styles.tg_hk2l}`}>{item.m65 !== 0 ? <p style={{ fontSize: "large", fontWeight: "bold"}}>{item.m65}</p> : <p></p>}</td>
                                    <td className={`${styles.tg_hk2l}`}>{item.m80 !== 0 ? <p style={{ fontSize: "large", fontWeight: "bold"}}>{item.m80}</p> : <p></p>}</td>
                                    <td className={`${styles.tg_hk2l}`}>{item.m100 !== 0 ? <p style={{ fontSize: "large", fontWeight: "bold"}}>{item.m100}</p> : <p></p>}</td>
                                    <td className={`${styles.tg_hk2l}`}>{item.m125 !== 0 ? <p style={{ fontSize: "large", fontWeight: "bold"}}>{item.m125}</p> : <p></p>}</td>
                                    <td className={`${styles.tg_hk2l}`}>{item.m150 !== 0 ? <p style={{ fontSize: "large", fontWeight: "bold"}}>{item.m150}</p> : <p></p>}</td>
                                    <td className={`${styles.tg_jfoo}`}>
                                        <Row>
                                            확관 : {item.totalH}
                                        </Row>
                                        <Row>
                                            총합 : {item.totalH + item.a25}
                                        </Row>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </Col>
        </>
    );
}

TestListPrint.getInitialProps = ({ query }) => {
    return { date: query.formattedDate };
};
export default TestListPrint