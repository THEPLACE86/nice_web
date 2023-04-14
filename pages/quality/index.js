import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import ko from "date-fns/locale/ko";
import { useRouter } from "next/router";
import {supabase} from "../../utils/supabaseClient";
import formatDate from "../../utils/formatDate";
import SalesDate from "../../components/shipment/SalesDate";
import TestListModal from "../../components/quality/TestListModal";

const Quality = (props) => {
    const router = useRouter();
    const { date } = props;
    const [data, setData] = useState([])
    const [testRound, setTestRound] = useState('1차')
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [testDateInfo, setTestDateInfo] = useState({
        'lot_name':'','lot_num': 0,'lot_nameH':'','lot_numH': 0,
        'lot_name2':'','lot_num2': 0,'lot_nameH2':'','lot_numH2': 0,
        'lot_name3':'','lot_num3': 0,'lot_nameH3':'','lot_numH3': 0,
        'lot_name4':'','lot_num4': 0,'lot_nameH4':'','lot_numH4': 0,
        'memo':''
    })
    const [totalH, setTotalH] = useState(0)
    const [totalB, setTotalB] = useState(0)

    const [lotNumberStart, setLotNumberStart] = useState({});
    const [lotNumberEnd, setLotNumberEnd] = useState({});
    const [lotNumberStartH, setLotNumberStartH] = useState({});
    const [lotNumberEndH, setLotNumberEndH] = useState({});

    useEffect(() => {
        const getDate = async () => {
            const {data, error} = await supabase.from('product').select().eq('test_date', date).eq('test_round', testRound).order('created_at', { ascending: true })
            if(data != null){
                setData(data)
            }
        }
        getDate().then(r => console.log(`111 ${r}`))
    },[testRound, date])

    useEffect(() => {
        const getTestDateListInfo = async () => {
            const { data, error } = await supabase
                .from("test_date")
                .select()
                .eq("test_date", date)
                .single();

            if (data != null) {
                setTestDateInfo({
                    lot_name: data.lot_name, lot_num: data.lot_num, lot_nameH: data.lot_nameH, lot_numH: data.lot_numH, lot_name2: data.lot_name2, lot_num2: data.lot_num2, lot_nameH2: data.lot_nameH2,
                    lot_numH2: data.lot_numH2, lot_name3: data.lot_name3, lot_num3: data.lot_num3, lot_nameH3: data.lot_nameH3, lot_numH3: data.lot_numH3, lot_name4: data.lot_name4, lot_num4: data.lot_num4, lot_nameH4: data.lot_nameH4, lot_numH4: data.lot_numH4, memo: data.memo,
                });
            } else {
                setTestDateInfo({
                    lot_name: "", lot_num: "", lot_nameH: "", lot_numH: "", lot_name2: "", lot_num2: "", lot_nameH2: "", lot_numH2: "", lot_name3: "", lot_num3: "", lot_nameH3: "", lot_numH3: "", lot_name4: "", lot_num4: "", lot_nameH4: "", lot_numH4: "", memo: "",
                });
            }
        }
        getTestDateListInfo().then(r => null)
    }, [date])

    useEffect(() => {
        const totalH = data.reduce((acc, item) => acc + item.totalH, 0);
        const totalB = data.reduce((acc, item) => acc + item.a25, 0);
        setTotalH(totalH);
        setTotalB(totalB)
    }, [data]);

    useEffect(() => {
        const ch = supabase.channel('quality_date_list').on("postgres_changes", {
            event: '*', schema: 'public', table: 'product',
        }, payload => {
            console.log(payload)
            const newData = payload.new
            setData((prevData) =>
                prevData.map((item) => item.id === newData.id ? { ...item, ...newData } : item)
            );
        }).subscribe()
        return () => {
            supabase.removeChannel(ch)
        };
    }, []);

    const handleDateChange = (date) => {
        setShowDatePicker(false);
        const formattedDate = formatDate(date)
        router.push({
            pathname: '/quality',
            query: { date: formattedDate },
        });
    }
    const moveDate = (next) => {
        if (next){
            const newDate = new Date(date.replace(/(\d{4})년 (\d{1,2})월 (\d{1,2})일/, '$1-$2-$3'));
            newDate.setDate(newDate.getDate() - 7);

            const dateString = formatDate(newDate);

            router.push({
                pathname: '/quality',
                query: { date: dateString },
            });
        }else{
            const newDate = new Date(date.replace(/(\d{4})년 (\d{1,2})월 (\d{1,2})일/, '$1-$2-$3'));
            newDate.setDate(newDate.getDate() + 7);

            const dateString = formatDate(newDate);

            router.push({
                pathname: '/quality',
                query: { date: dateString },
            });
        }
    }
    const onSaveLotInfo = async (name) => {
        await supabase.from('test_date').update({
            [name]: testDateInfo[name]
        }).eq('test_date', date)

    }
    const handleLotInfo = (e, name) => {
        setTestDateInfo(prevValues => ({
            ...prevValues,
            [name]: e.target.value,
        }));
    }
    const onSaveTestDateInfo = async (e) => {
        await supabase.from('test_date').update({
            'memo' : e.target.value,
        }).eq('test_date', date)
    }
    const onSaveB = async (e, id, a25, end, value) => {
        if(e.key === 'Enter'){
            console.log(end)
            if(end){
                await supabase.from('product').update({
                    'lot_number_end': value
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

    const onSaveH = async (e, id, totalH, end, value) => {
        if(e.key === 'Enter'){
            console.log(end)
            if(end){
                await supabase.from('product').update({
                    'lot_number_endH': value
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

    const goToCreate = () => {
        router.push({
            pathname: '/quality/create',
            query: { testDate: date, testRound: testRound },
        });
    };

    const renderInputFields = (round) => {
        return (
            <>
                <div className={"w-96"}>
                    <label htmlFor={`lot_num${round}`} className="block text-sm font-medium text-gray-700">
                        비확관 로트번호
                    </label>
                    <input
                        id={`lot_num${round}`}
                        onBlur={() => onSaveLotInfo(`lot_num${round}`)}
                        onChange={(e) => handleLotInfo(e, `lot_num${round}`)}
                        value={testDateInfo[`lot_num${round}`] || ""}
                        className="input input-bordered font-bold"
                    />
                </div>
                <div >
                    <label htmlFor={`lot_name${round}`} className="block text-sm font-medium text-gray-700">
                        비확관 로트네임
                    </label>
                    <input
                        id={`lot_name${round}`}
                        onBlur={() => onSaveLotInfo(`lot_name${round}`)}
                        onChange={(e) => handleLotInfo(e, `lot_name${round}`)}
                        value={testDateInfo[`lot_name${round}`] || ""}
                        className="input input-bordered font-bold"
                    />
                </div>
                <div >
                    <label htmlFor={`lot_numH${round}`} className="block text-sm font-medium text-gray-700">
                        확관 로트번호
                    </label>
                    <input
                        id={`lot_numH${round}`}
                        onBlur={() => onSaveLotInfo(`lot_numH${round}`)}
                        onChange={(e) => handleLotInfo(e, `lot_numH${round}`)}
                        value={testDateInfo[`lot_numH${round}`] || ""}
                        className="input input-bordered font-bold"
                    />
                </div>
                <div>
                    <label htmlFor={`lot_nameH${round}`} className="block text-sm font-medium text-gray-700">
                        확관 로트네임
                    </label>
                    <input
                        id={`lot_nameH${round}`}
                        onBlur={() => onSaveLotInfo(`lot_nameH${round}`)}
                        onChange={(e) => handleLotInfo(e, `lot_nameH${round}`)}
                        value={testDateInfo[`lot_nameH${round}`] || ""}
                        className="input input-bordered font-bold"
                    />
                </div>
            </>
        );
    }

    function filterLotInfo(testDateInfo, testRound) {
        const roundMapping = {
            "1차": { lot_num: testDateInfo.lot_num, lot_numH: testDateInfo.lot_numH },
            "2차": { lot_num: testDateInfo.lot_num2, lot_numH: testDateInfo.lot_numH2 },
            "3차": { lot_num: testDateInfo.lot_num3, lot_numH: testDateInfo.lot_numH3 },
            "4차": { lot_num: testDateInfo.lot_num4, lot_numH: testDateInfo.lot_numH4 },
            // 필요한 경우 여기에 추가 차수를 매핑하세요
        };

        return roundMapping[testRound] || {};
    }

    return (
        <div>
            <div className="flex mt-6 mb-10 items-center justify-between">
                <div className="flex-shrink-0 flex items-center">
                    <button className="print:hidden btn btn-primary rounded text-white w-32 mr-4" onClick={() => moveDate(true)}>지난주</button>
                    <button className="print:hidden btn btn-primary rounded text-white w-32 mr-4" onClick={() => moveDate(false)}>다음주</button>
                    <button className="print:hidden btn btn-active rounded text-white mr-4" onClick={() => setShowDatePicker(!showDatePicker)}>달력</button>
                    <div className="datePickerWrapper">
                        {showDatePicker && (
                            <div className="datePicker">
                                <DatePicker
                                    onChange={handleDateChange}
                                    locale={ko} dateFormat="yyyy년 M월 d일"
                                    inline
                                    filterDate={(date) => date.getDay() === 2}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-center">
                    <span className="font-bold text-3xl">
                      <span className="text-orange-600 font-bold text-3xl">{date}</span> 검수리스트
                    </span>
                </div>
                <div>
                    <button className="print:hidden btn btn-primary rounded text-white w-32 mr-4" onClick={() => router.push({pathname: '/quality/testListPrint', query: { date }})}>리스트출력</button>
                    <button className="print:hidden btn btn-primary rounded text-white w-32 mr-4" onClick={() => router.push({pathname: '/quality/testListCountPrint', query: { date }})}>가지관출력</button>
                    <button className="print:hidden btn btn-primary rounded text-white mr-4" onClick={() => setShowDatePicker(!showDatePicker)}>메인관출력</button>
                </div>
            </div>
            <div className={"flex"}>
                <div className="tabs">
                    <a className={`tab tab-bordered tab-lg${testRound === '1차' ? ' tab-active font-bold text-orange-600' : ''}`} onClick={()=> setTestRound('1차')}>
                        1차 신청
                    </a>
                    <a className={`tab tab-bordered tab-lg${testRound === '2차' ? ' tab-active font-bold text-orange-600' : ''}`} onClick={()=> setTestRound('2차')}>
                        2차 신청
                    </a>
                    <a className={`tab tab-bordered tab-lg${testRound === '3차' ? ' tab-active font-bold text-orange-600' : ''}`} onClick={()=> setTestRound('3차')}>
                        3차 신청
                    </a>
                    <a className={`tab tab-bordered tab-lg${testRound === '4차' ? ' tab-active font-bold text-orange-600' : ''}`} onClick={()=> setTestRound('4차')}>
                        4차 신청
                    </a>
                </div>
                <button className={"btn btn-outline pr-8 pl-8"} onClick={goToCreate}>등록</button>
            </div>
            <div className={"flex mt-6"}>
                <div className={"grid grid-cols-2 gap-4"} style={{ height: "130px" }}>
                    {testRound === '1차' && renderInputFields('')}
                    {testRound === '2차' && renderInputFields('2')}
                    {testRound === '3차' && renderInputFields('3')}
                    {testRound === '4차' && renderInputFields('4')}
                </div>

                <div className={"w-full"}>
                    <label htmlFor="memo" className="block font-bold text-gray-700">검사 변경사항 메모</label>
                    <textarea
                        id="memo"
                        rows="4"
                        style={{ height: "130px" }}
                        className="input input-bordered w-full resize-none"
                        onChange={(e) => handleLotInfo(e, 'memo')}
                        value={testDateInfo.memo || ""}
                        onBlur={(e) => onSaveTestDateInfo(e)}
                    ></textarea>
                </div>
            </div>

            {data.length === 0 ? (
                <h3>검사품목이 없습니다.</h3>
            ) : (
                <div className="flex flex-col">
                    <div className={`${data.length === 0 ? "hidden" : ""}`}>
                        <div className="flex justify-end mb-4">
                            <h4 className="text-2xl mr-4">비확관 합계: <span className={"text-orange-500 text-2xl font-bold"}>{totalB}</span></h4>
                            <h4 className="text-2xl">확관합계: <span className={"text-orange-500 text-2xl font-bold"}>{totalH}</span></h4>
                        </div>
                        <table className="table-fixed border-collapse border border-gray-300 w-full">
                            <thead>
                            <tr>
                                <th className="border border-gray-300 w-8">No</th>
                                <th className="border border-gray-300 w-[280px]">현 장 명</th>
                                <th className="border border-gray-300 w-64">비 확 관</th>
                                <th className="border border-gray-300 w-64">확 관</th>
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
                                <th className="border border-gray-300 bg-gray-200 w-10 text-center"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.map((item, index) => {
                                return (
                                    <tr key={item.id} className={item.cancel ? "bg-red-500" : ""}>
                                        <td className="border border-gray-300 text-center">{index + 1}</td>
                                        <td className="border border-gray-300 pl-4">
                                            {item.company} {item.place} {item.area} ({item.initial})
                                        </td>
                                        <td className="border border-gray-300 pt-2 pb-2">
                                            {item.a25 !== 0 && (
                                                <div className="flex items-center justify-center">
                                                    {testRound === "1차" && (
                                                        <p className="mr-2">
                                                            ({testDateInfo.lot_num}) {testDateInfo.lot_name}{" "}
                                                        </p>
                                                    )}
                                                    {testRound === "2차" && (
                                                        <p className="mr-2">
                                                            ({testDateInfo.lot_num2}) {testDateInfo.lot_name2}{" "}
                                                        </p>
                                                    )}
                                                    {testRound === "3차" && (
                                                        <p className="mr-2">
                                                            ({testDateInfo.lot_num3}) {testDateInfo.lot_name3}{" "}
                                                        </p>
                                                    )}
                                                    {testRound === "4차" && (
                                                        <p className="mr-2">
                                                            ({testDateInfo.lot_numH4}) {testDateInfo.lot_nameH4}{" "}
                                                        </p>
                                                    )}
                                                    <input
                                                        type="number"
                                                        className="input input-bordered w-[75px] p-1 mr-1"
                                                        value={lotNumberStart[item.id] || item.lot_number_start}
                                                        onChange={(e) => {
                                                            setLotNumberStart({ ...lotNumberStart, [item.id]: e.target.value });
                                                        }}
                                                        onKeyDown={(e) => onSaveB(e, item.id, item.a25, false, e.target.value)}
                                                    />
                                                    <p>~</p>
                                                    <input
                                                        type="number"
                                                        className="input input-bordered w-[75px] p-1 ml-1"
                                                        value={lotNumberEnd[item.id] || item.lot_number_end}
                                                        onChange={(e) => {
                                                            setLotNumberEnd({ ...lotNumberEnd, [item.id]: e.target.value });
                                                        }}
                                                        onKeyDown={(e) => onSaveB(e, item.id, item.a25, false, e.target.value)}
                                                    />
                                                </div>
                                            )}
                                        </td>
                                        <td className="border border-gray-300 pt-2 pb-2">
                                            {item.totalH === 0 ? (
                                                <p></p>
                                            ) : (
                                                <div className="flex items-center justify-center">
                                                    {testRound === "1차" && (
                                                        <p className="mr-2">
                                                            ({testDateInfo.lot_numH}) {testDateInfo.lot_nameH}{" "}
                                                        </p>
                                                    )}
                                                    {testRound === "2차" && (
                                                        <p className="mr-2">
                                                            ({testDateInfo.lot_numH2}) {testDateInfo.lot_nameH2}{" "}
                                                        </p>
                                                    )}
                                                    {testRound === "3차" && (
                                                        <p className="mr-2">
                                                            ({testDateInfo.lot_numH3}) {testDateInfo.lot_nameH3}{" "}
                                                        </p>
                                                    )}
                                                    {testRound === "4차" && (
                                                        <p className="mr-2">
                                                            ({testDateInfo.lot_numH4}) {testDateInfo.lot_nameH4}{" "}
                                                        </p>)}
                                                    <input
                                                        type="number"
                                                        className="input input-bordered w-[75px] p-1 mr-1"
                                                        value={lotNumberStartH[item.id] || item.lot_number_startH}
                                                        onChange={(e) => {
                                                            setLotNumberStartH({ ...lotNumberStartH, [item.id]: e.target.value });
                                                        }}
                                                        onKeyDown={(e) => onSaveH(e, item.id, item.totalH, false, e.target.value)}
                                                    />
                                                    <p>~</p>
                                                    <input
                                                        type="number"
                                                        className="input input-bordered w-[75px] p-1 ml-1"
                                                        value={lotNumberEndH[item.id] || item.lot_number_endH}
                                                        onChange={(e) => {
                                                            setLotNumberEndH({ ...lotNumberEndH, [item.id]: e.target.value });
                                                        }}
                                                        onKeyDown={(e) => onSaveH(e, item.id, item.totalH, false, e.target.value)}
                                                    />
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
                                        <td className="border border-gray-300 text-center">
                                            <TestListModal
                                                item={item}
                                                lotInfo={filterLotInfo(testDateInfo, testRound)}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
            </div>
            )}
        </div>
    )
}

Quality.getInitialProps = ({ query }) => {
    return { date: query.date };
};


export default Quality;

