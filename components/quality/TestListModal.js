import React, { useState } from 'react';
import { utils, writeFile as writeXLSXFile } from "xlsx";
import {useRouter} from "next/router";

const TestListModal = ({ item, lotInfo }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const countCheck = async (id, a25, a32, a40, a50, a65) => {

        await router.push({
            pathname: '/quality/countCheck',
            query: { id, a25, a32, a40, a50, a65 },
        });
        setIsModalOpen(false)
    }

    const lotPrint = () => {
        const fixedValues = [
            { "제품형식": "25x(25)", "제품형식(레듀샤)": "", "배관재질": "KSD 3507", "스케쥴번호": "", "인증번호": "분기 11-49","로트번호":lotInfo.lot_num < 100 ? '202300'+lotInfo.lot_num : '20230'+lotInfo.lot_num, "제조일자": "2023", "구분": "비확관형" },
            { "제품형식": "32x(25)", "제품형식(레듀샤)": "32x(25)", "배관재질": "KSD 3507", "스케쥴번호": "", "인증번호": "분기 11-5-1","로트번호":lotInfo.lot_numH < 100 ? '202300'+lotInfo.lot_numH : '20230'+lotInfo.lot_numH, "제조일자": "2023", "구분": "확관형" },
            { "제품형식": "40x(32~25)", "제품형식(레듀샤)": "40x(32)", "배관재질": "KSD 3507", "스케쥴번호": "", "인증번호": "분기 11-5-1","로트번호":lotInfo.lot_numH < 100 ? '202300'+lotInfo.lot_numH : '20230'+lotInfo.lot_numH, "제조일자": "2023", "구분": "확관형" },
            { "제품형식": "50x(40~25)", "제품형식(레듀샤)": "50x(40)", "배관재질": "KSD 3507", "스케쥴번호": "", "인증번호": "분기 11-5-1","로트번호":lotInfo.lot_numH < 100 ? '202300'+lotInfo.lot_numH : '20230'+lotInfo.lot_numH, "제조일자": "2023", "구분": "확관형" },
            { "제품형식": "65x(50~25)", "제품형식(레듀샤)": "65x(50)", "배관재질": "KSD 3507", "스케쥴번호": "", "인증번호": "분기 11-5-1","로트번호":lotInfo.lot_numH < 100 ? '202300'+lotInfo.lot_numH : '20230'+lotInfo.lot_numH, "제조일자": "2023", "구분": "확관형" },
            { "제품형식": "65x(50~25)", "제품형식(레듀샤)": "", "배관재질": "KSD 3507", "스케쥴번호": "", "인증번호": "분기 11-5-1","로트번호":lotInfo.lot_numH < 100 ? '202300'+lotInfo.lot_numH : '20230'+lotInfo.lot_numH, "제조일자": "2023", "구분": "확관형" },
            { "제품형식": "80x(65~25)", "제품형식(레듀샤)": "", "배관재질": "KSD 3507", "스케쥴번호": "", "인증번호": "분기 11-5-1","로트번호":lotInfo.lot_numH < 100 ? '202300'+lotInfo.lot_numH : '20230'+lotInfo.lot_numH, "제조일자": "2023", "구분": "확관형" },
            { "제품형식": "100x(80~25)", "제품형식(레듀샤)": "", "배관재질": "KSD 3507", "스케쥴번호": "", "인증번호": "분기 11-5-1","로트번호":lotInfo.lot_numH < 100 ? '202300'+lotInfo.lot_numH : '20230'+lotInfo.lot_numH, "제조일자": "2023", "구분": "확관형" },
            { "제품형식": "125x(100~25)", "제품형식(레듀샤)": "", "배관재질": "KSD 3507", "스케쥴번호": "", "인증번호": "분기 11-5-1","로트번호":lotInfo.lot_numH < 100 ? '202300'+lotInfo.lot_numH : '20230'+lotInfo.lot_numH, "제조일자": "2023", "구분": "확관형" },
            { "제품형식": "150x(125~25)", "제품형식(레듀샤)": "", "배관재질": "KSD 3507", "스케쥴번호": "", "인증번호": "분기 11-5-1","로트번호":lotInfo.lot_numH < 100 ? '202300'+lotInfo.lot_numH : '20230'+lotInfo.lot_numH, "제조일자": "2023", "구분": "확관형" },
        ]
        const columns = ["a25", "a32", "a40", "a50", "a65", "m65", "m80", "m100", "m125", "m150"]

        const worksheetData = columns.map((column, index) => {
            const fixedValue = fixedValues[index % 10];
            return {
                "수량": item[column],
                "제품형식": fixedValue.제품형식,
                "제품형식_레듀샤": fixedValue.제품형식_레듀샤,
                "배관재질": fixedValue.배관재질,
                "스케쥴번호": fixedValue.스케쥴번호,
                "인증번호": fixedValue.인증번호,
                "로트번호": fixedValue.로트번호,
                "제조일자": fixedValue.제조일자,
                "제조번호": item.company+'/'+item.place,
                "구분": fixedValue.구분,
            };
        });

        const worksheet = utils.json_to_sheet(worksheetData);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // 엑셀 파일로 저장
        writeXLSXFile(workbook, item.company + ' ' + item.place + ' ' + item.area + ".xlsx", { type: "buffer" });
        console.log("Excel file created: output.xlsx");
    }

    return (
        <>
          <span onClick={() => setIsModalOpen(true)} className={`cursor-pointer font-bold text-orange-600`}>메뉴</span>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={() => setIsModalOpen(false)}
                    ></div>
                    <div className="relative p-8 bg-white rounded shadow-xl">
                        <h2 className="text-xl font-bold mb-4 text-black">{item.company} {item.place} {item.area}</h2>
                        <div className="mt-4 flex justify-end">
                            {item.countCheck === true ?
                                <button className={"btn btn-accent text-white"} onClick={() => countCheck(item.id, item.a25, item.a32, item.a40, item.a50, item.a65)}>수량 맞음</button> :
                                <button className={"btn btn-primary text-white"} onClick={() => countCheck(item.id, item.a25, item.a32, item.a40, item.a50, item.a65)}>수량</button>
                            }
                            <button onClick={() => lotPrint()} className="bg-orange-300 text-black px-4 py-2 ml-2 rounded">증지</button>
                            <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 text-black px-4 py-2 ml-2 rounded">닫기</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default TestListModal