import { useRouter } from 'next/router';
import {useEffect, useState} from "react";
import styles from './TestDateList.module.css'
import {supabase} from "../../../utils/supabaseClient";

function TestDateList(props) {
    const { date } = props;
    const router = useRouter();

    const [data, setData] = useState([])
    const [testDateInfo, setTestDateInfo] = useState({
        'lot_name':'','lot_num': 0,'lot_nameH':'','lot_numH': 0,
        'lot_name2':'','lot_num2': 0,'lot_nameH2':'','lot_numH2': 0,
        'lot_name3':'','lot_num3': 0,'lot_nameH3':'','lot_numH3': 0,
        'lot_name4':'','lot_num4': 0,'lot_nameH4':'','lot_numH4': 0,
        'memo':''
    })
    const [testRound, setTestRound] = useState('1차')
    const [totalH, setTotalH] = useState(0)
    const [totalB, setTotalB] = useState(0)

    let modalRef = null;

    const formattedDate = new Date(date).toLocaleDateString('ko-KR', {year: 'numeric',month: 'long',day: 'numeric',});

    useEffect(() => {
        const getDate = async () => {
            const {data, error} = await supabase.from('product').select().eq('test_date', formattedDate).eq('test_round', testRound).order('created_at', { ascending: true })
            if(data != null){
                setData(data)
            }
        }
        getDate().then(r => console.log(`111 ${r}`))
    },[testRound])

    useEffect(() => {
        const getTestDateListInfo = async () => {
            const {data, error} = await supabase.from('test_date').select().eq('test_date', formattedDate).single()
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

    useEffect(() => {
        supabase.channel('any').on("postgres_changes", {
                event: '*', schema: 'public', table: 'product',
            }, payload => {
                console.log(payload)
                const newData = payload.new
                setData((prevData) =>
                    prevData.map((item) => item.id === newData.id ? { ...item, ...newData } : item)
                );
            }).subscribe()
    }, []);

    useEffect(() => {
        supabase.channel('any_test_date').on("postgres_changes", {
            event: '*', schema: 'public', table: 'test_date',
        }, payload => {
            console.log(payload)
            const newData = payload.new
            setTestDateInfo(newData);
        }).subscribe()
    }, []);

    useEffect(() => {
        const totalH = data.reduce((acc, item) => acc + item.totalH, 0);
        const totalB = data.reduce((acc, item) => acc + item.a25, 0);
        setTotalH(totalH);
        setTotalB(totalB)
    }, [data]);


    const goToCreate = () => {
        router.push({
            pathname: '/quality/create',
            query: { testDate: formattedDate, testRound: testRound },
        });
    };

    const handleTabChange = (key) => {
        setTestRound(key)
    }

    const handleLotInfo = (e, name) => {
        setTestDateInfo(prevValues => ({
            ...prevValues,
            [name]: e.target.value,
        }));
    }

    const onSaveLotInfo = async (name) => {
        await supabase.from('test_date').update({
            [name]: testDateInfo[name]
        }).eq('test_date', formattedDate)

    }

    const onSaveB = async (e, id, a25, end) => {
        if(e.key === 'Enter'){
            console.log(end)
            if(end){
                await supabase.from('product').update({
                    'lot_number_end': e.target.value
                }).eq('id', id)
            }else {
                const numberEnd = parseInt(e.target.value) + parseInt(a25) -1

                await supabase.from('product').update({
                    'lot_number_start' : e.target.value,
                    'lot_number_end': numberEnd
                }).eq('id', id)
            }
        }
    }

    const onSaveH = async (e, id, totalH, end) => {
        if(e.key === 'Enter'){
            console.log(end)
            if(end){
                await supabase.from('product').update({
                    'lot_number_endH': e.target.value
                }).eq('id', id)
            }else {
                const numberEnd = parseInt(e.target.value) + parseInt(totalH) -1

                await supabase.from('product').update({
                    'lot_number_startH' : e.target.value,
                    'lot_number_endH': numberEnd
                }).eq('id', id)
            }
        }
    }

    const onSaveTestDateInfo = async (e) => {
        await supabase.from('test_date').update({
            'memo' : e.target.value,
        }).eq('test_date', formattedDate)
    }

    const countCheck = async (id, a25, a32, a40, a50, a65) => {

        await router.push({
            pathname: '/quality/testDateList/countCheck',
            query: { id, a25, a32, a40, a50, a65 },
        });
        modalRef.destroy()
    }

    const handleInputChange = async (e, id) => {
        console.log(e.target.value)
        const inputValue = e.target.value;
        if(inputValue === ""){
            await supabase.from('product').update({
                'cancel' : false,
                'memo' : e.target.value,
            }).eq('id', id)
        }else{
            await supabase.from('product').update({
                'cancel' : true,
                'memo' : e.target.value,
            }).eq('id', id)
        }
    }

    const info = (item) => {
        modalRef = Modal.success({
            title: '작업 선택',
            content: (
                <div>
                    <p>{item.company} {item.place} {item.area}</p>
                    <Row style={{ marginTop: "10px", marginBottom: "10px"}}>
                        <Button style={{ marginRight: "5px", backgroundColor: "#a0d911", color: "white", fontWeight: "bold"}} onClick={() => modalRef.destroy()}>수정</Button>
                        <Button style={{ marginRight: "5px", backgroundColor: "#f5222d", color: "white", fontWeight: "bold"}}>삭제</Button>
                        <Button style={{ marginRight: "5px", backgroundColor: "#ffa940", color: "white", fontWeight: "bold"}}>증지</Button>
                        <Button style={{ marginRight: "5px", backgroundColor: "#1677ff", color: "white", fontWeight: "bold"}}>통보서</Button>
                    </Row>
                    <br/>
                    <Row>
                        {item.countCheck === true ?
                            <Button onClick={() => countCheck(item.id, item.a25, item.a32, item.a40, item.a50, item.a65)}>수량 맞음</Button> :
                            <Button onClick={() => countCheck(item.id, item.a25, item.a32, item.a40, item.a50, item.a65)}>수량</Button>
                        }
                    </Row>
                    <br/>
                    <h5>취소내용</h5>
                    <Row>
                        <input style={{ width: "200px"}} defaultValue={item.memo} onBlur={(e) => handleInputChange(e, item.id)}/>
                    </Row>

                </div>
            ),
            okText: <span style={{ fontWeight: "bold"}}>닫기</span>
        })
    }

    return (
        <>
            <Row>
                <Col span={6}>
                    <Tabs
                        onChange={handleTabChange} defaultActiveKey="1" type="card" size="large"
                        items={[ {label: '1차신청',key: '1차'},{label: '2차신청',key: '2차'},{label: '3차신청',key: '3차'},{label: '4차신청',key: '4차'}, ]}
                    />
                </Col>
                <Col span={3}>
                    <Button onClick={goToCreate} size="large" type="primary" style={{ fontWeight: "bold" }}>검사품목 등록</Button>
                </Col>
                <Col span={2}>
                    <Button onClick={() => router.push({pathname: '/quality/testDateList/testListPrint', query: { formattedDate }})} size="large" type="primary" style={{ fontWeight: "bold", backgroundColor: "#13c2c2", color: "white" }}>리스트출력</Button>
                </Col>
                <Col span={2}>
                    <Button onClick={() => router.push({pathname: '/quality/testDateList/testListCountPrint', query: { formattedDate }})} size="large" type="primary" style={{ fontWeight: "bold", backgroundColor: "green", color: "white" }}>가지관출력</Button>
                </Col>
                <Col span={3}>
                    <Button onClick={() => router.push({pathname: '/quality/testDateList/testListCountPrintM', query: { formattedDate }})} size="large" type="primary" style={{ fontWeight: "bold", backgroundColor: "green", color: "white" }}>메인관출력</Button>
                </Col>
            </Row>
            <h2>{formattedDate} 검사</h2>

            <Row>
                {
                    testRound === '1차' && (
                        <Col span={8}>
                            <Row>
                                <Input onBlur={()=>onSaveLotInfo("lot_numH")} onChange={(e) => handleLotInfo(e, 'lot_numH')} value={testDateInfo.lot_numH} addonBefore="확관 로트번호" placeholder="로트번호" size="large" style={{ width: "220px"}} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <Input onBlur={()=>onSaveLotInfo("lot_nameH")} onChange={(e) => handleLotInfo(e, 'lot_nameH')} value={testDateInfo.lot_nameH} addonBefore="확관 로트네임" placeholder="로트네임" size="large" style={{ width: "220px"}} />
                            </Row><br/>
                            <Row>
                                <Input onBlur={()=>onSaveLotInfo("lot_num")} onChange={(e) => handleLotInfo(e, 'lot_num')} value={testDateInfo.lot_num} addonBefore="비확관 로트번호" placeholder="로트번호" size="large" style={{ width: "220px"}} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <Input onBlur={()=>onSaveLotInfo("lot_name")} onChange={(e) => handleLotInfo(e, 'lot_name')} value={testDateInfo.lot_name} addonBefore="비확관 로트네임" placeholder="로트네임" size="large" style={{ width: "220px"}} />
                            </Row>
                        </Col>
                    )

                }
                {
                    testRound === '2차' && (
                        <Col span={8}>
                            <Row>
                                <Input onBlur={()=>onSaveLotInfo("lot_numH2")} onChange={(e) => handleLotInfo(e, 'lot_numH2')} value={testDateInfo.lot_numH2} addonBefore="확관 로트번호" placeholder="로트번호" size="large" style={{ width: "220px"}} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <Input onBlur={()=>onSaveLotInfo("lot_nameH2")} onChange={(e) => handleLotInfo(e, 'lot_nameH2')} value={testDateInfo.lot_nameH2} addonBefore="확관 로트네임" placeholder="로트네임" size="large" style={{ width: "220px"}} />
                            </Row><br/>
                            <Row>
                                <Input onBlur={()=>onSaveLotInfo("lot_num2")} onChange={(e) => handleLotInfo(e, 'lot_num2')} value={testDateInfo.lot_num2} addonBefore="비확관 로트번호" placeholder="로트번호" size="large" style={{ width: "220px"}} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <Input onBlur={()=>onSaveLotInfo("lot_name2")} onChange={(e) => handleLotInfo(e, 'lot_name2')} value={testDateInfo.lot_name2} addonBefore="비확관 로트네임" placeholder="로트네임" size="large" style={{ width: "220px"}} />
                            </Row>
                        </Col>
                    )

                }
                {
                    testRound === '3차' && (
                        <Col span={8}>
                            <Row>
                                <Input onBlur={()=>onSaveLotInfo("lot_numH3")} onChange={(e) => handleLotInfo(e, 'lot_numH3')} value={testDateInfo.lot_numH3} addonBefore="확관 로트번호" placeholder="로트번호" size="large" style={{ width: "220px"}} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <Input onBlur={()=>onSaveLotInfo("lot_nameH3")} onChange={(e) => handleLotInfo(e, 'lot_nameH3')} value={testDateInfo.lot_nameH3} addonBefore="확관 로트네임" placeholder="로트네임" size="large" style={{ width: "220px"}} />
                            </Row><br/>
                            <Row>
                                <Input onBlur={()=>onSaveLotInfo("lot_num3")} onChange={(e) => handleLotInfo(e, 'lot_num3')} value={testDateInfo.lot_num3} addonBefore="비확관 로트번호" placeholder="로트번호" size="large" style={{ width: "220px"}} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <Input onBlur={()=>onSaveLotInfo("lot_name3")} onChange={(e) => handleLotInfo(e, 'lot_name3')} value={testDateInfo.lot_name3} addonBefore="비확관 로트네임" placeholder="로트네임" size="large" style={{ width: "220px"}} />
                            </Row>
                        </Col>
                    )

                }
                {
                    testRound === '4차' && (
                        <Col span={8}>
                            <Row>
                                <Input onBlur={()=>onSaveLotInfo("lot_numH4")} onChange={(e) => handleLotInfo(e, 'lot_numH4')} value={testDateInfo.lot_numH4} addonBefore="확관 로트번호" placeholder="로트번호" size="large" style={{ width: "220px"}} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <Input onBlur={()=>onSaveLotInfo("lot_nameH4")} onChange={(e) => handleLotInfo(e, 'lot_nameH4')} value={testDateInfo.lot_nameH4} addonBefore="확관 로트네임" placeholder="로트네임" size="large" style={{ width: "220px"}} />
                            </Row><br/>
                            <Row>
                                <Input onBlur={()=>onSaveLotInfo("lot_num4")} onChange={(e) => handleLotInfo(e, 'lot_num4')} value={testDateInfo.lot_num4} addonBefore="비확관 로트번호" placeholder="로트번호" size="large" style={{ width: "220px"}} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <Input onBlur={()=>onSaveLotInfo("lot_name4")} onChange={(e) => handleLotInfo(e, 'lot_name4')} value={testDateInfo.lot_name4} addonBefore="비확관 로트네임" placeholder="로트네임" size="large" style={{ width: "220px"}} />
                            </Row>
                        </Col>
                    )

                }

                <Col span={12}>
                    <h5>아래는 검사 변경사항 메모 검사 취소는 메뉴에 취소내용 입력해주세요.</h5>
                    <h6>입력박스 밖에 바탕화면 한번 눌러야 저장됩니다.</h6>
                    <textarea rows="4" style={{ width: "500px", resize:"none"}} onChange={(e) => handleLotInfo(e, 'memo')} value={testDateInfo.memo} onBlur={(e)=>onSaveTestDateInfo(e)} ></textarea>
                </Col>
            </Row>

            <Row>

            </Row>

            {data.length === 0 ? <h3>검사품목이 없습니다.</h3> :
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
                    <th className={`${styles.tg_7btt}`}></th>
                </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => {

                        return (
                            <tr key={item.id}>
                            <td style={{ textAlign: "center", backgroundColor: item.cancel ? "red" : "white"}}>{index+1}</td>
                            <td className={`${styles.tg_r1gl}`}><p>&nbsp;&nbsp;&nbsp;{item.company} {item.place} {item.area}</p></td>
                            <td className={`${styles.tg_coj7}`}>
                                {item.a25 !== 0 &&
                                    <Row>
                                        {testRound === '1차' && (
                                            <p>({testDateInfo.lot_num}) {testDateInfo.lot_name} &nbsp;</p>
                                        )}
                                        {testRound === '2차' && (
                                            <p>({testDateInfo.lot_num2}) {testDateInfo.lot_name2} &nbsp;</p>
                                        )}
                                        {testRound === '3차' && (
                                            <p>({testDateInfo.lot_num3}) {testDateInfo.lot_name3} &nbsp;</p>
                                        )}
                                        {testRound === '4차' && (
                                            <p>({testDateInfo.lot_numH4}) {testDateInfo.lot_nameH4} &nbsp;</p>
                                        )}
                                        <InputNumber style={{ width: "70px"}} controls={false} onKeyDown={(e)=>onSaveB(e, item.id, item.a25, false)} value={item.lot_number_start}/>
                                        <p>&nbsp;~&nbsp;</p>
                                        <InputNumber style={{ width: "70px"}} controls={false} onKeyDown={(e)=>onSaveB(e,item.id, item.a25, true)} value={item.lot_number_end}/>
                                    </Row>
                                }
                            </td>
                            <td className={`${styles.tg_coj7}`}>
                                {item.totalH === 0 ? <p></p> :
                                    <Row>
                                        {testRound === '1차' && (
                                            <p>({testDateInfo.lot_numH}) {testDateInfo.lot_nameH} &nbsp;</p>
                                        )}
                                        {testRound === '2차' && (
                                            <p>({testDateInfo.lot_numH2}) {testDateInfo.lot_nameH2} &nbsp;</p>
                                        )}
                                        {testRound === '3차' && (
                                            <p>({testDateInfo.lot_numH3}) {testDateInfo.lot_nameH3} &nbsp;</p>
                                        )}
                                        {testRound === '4차' && (
                                            <p>({testDateInfo.lot_numH4}) {testDateInfo.lot_nameH4} &nbsp;</p>
                                        )}
                                        <InputNumber style={{ width: "70px"}} controls={false} onKeyDown={(e)=>onSaveH(e, item.id, item.totalH, false)} value={item.lot_number_startH}/>
                                        <p>&nbsp;~&nbsp;</p>
                                        <InputNumber style={{ width: "70px"}} controls={false} onKeyDown={(e)=>onSaveH(e,item.id, item.totalH, true)} value={item.lot_number_endH}/>
                                    </Row>
                                }
                            </td>
                            <td className={`${styles.tg_ky08}`}>{item.a25 !== 0 && <p style={{ fontSize: "large", fontWeight: "bold"}}>{item.a25}</p>}</td>
                            <td className={`${styles.tg_7fs8}`}>{item.a32 !== 0 && <p style={{ fontSize: "large", fontWeight: "bold"}}>{item.a32}</p>}</td>
                            <td className={`${styles.tg_7fs8}`}>{item.a40 !== 0 && <p style={{ fontSize: "large", fontWeight: "bold"}}>{item.a40}</p>}</td>
                            <td className={`${styles.tg_7fs8}`}>{item.a50 !== 0 && <p style={{ fontSize: "large", fontWeight: "bold"}}>{item.a50}</p>}</td>
                            <td className={`${styles.tg_7fs8}`}>{item.a65 !== 0 && <p style={{ fontSize: "large", fontWeight: "bold"}}>{item.a65}</p>}</td>
                            <td className={`${styles.tg_hk2l}`}>{item.m65 !== 0 && <p style={{ fontSize: "large", fontWeight: "bold"}}>{item.m65}</p>}</td>
                            <td className={`${styles.tg_hk2l}`}>{item.m80 !== 0 && <p style={{ fontSize: "large", fontWeight: "bold"}}>{item.m80}</p>}</td>
                            <td className={`${styles.tg_hk2l}`}>{item.m100 !== 0 && <p style={{ fontSize: "large", fontWeight: "bold"}}>{item.m100}</p>}</td>
                            <td className={`${styles.tg_hk2l}`}>{item.m125 !== 0 && <p style={{ fontSize: "large", fontWeight: "bold"}}>{item.m125}</p>}</td>
                            <td className={`${styles.tg_hk2l}`}>{item.m150 !== 0 && <p style={{ fontSize: "large", fontWeight: "bold"}}>{item.m150}</p>}</td>
                            <td className={`${styles.tg_jfoo}`}>
                                <Row>
                                    확관 : {item.totalH}
                                </Row>
                                <Row>
                                    총합 : {item.totalH + item.a25}
                                </Row>
                            </td>
                            <td>
                                <Button onClick={() => info(item)} type="primary" style={{ fontWeight: "bold"}}>메뉴</Button>
                            </td>
                        </tr>
                        )
                    })}
                </tbody>
            </table>
                </Col>
            }
        </>
    )
}

TestDateList.getInitialProps = ({ query }) => {
    return { date: query.date };
};

export default TestDateList;
