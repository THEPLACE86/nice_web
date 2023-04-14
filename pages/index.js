import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Home() {

    const [shipments, setShipments] = useState([]);

    useEffect(() => {
        fetchShipments();
    }, []);

    async function fetchShipments() {
        const { data, error } = await supabase.from("product_list").select()
            .eq('worker', '출하완료').order('updated_at', {ascending: false}).limit(7);
        if (error) console.error("Error fetching shipments:", error);
        else setShipments(data);
    }

    // useEffect(() => {
    //     fetchAndUpdateData();
    // },[])
    // const fetchAndUpdateData = async () => {
    //     // 1. 기존 데이터 가져오기
    //     const { data, error } = await supabase
    //         .from("bunch")
    //         .select("id, test_date");
    //
    //     if (error) {
    //         console.error("Error fetching data: ", error);
    //         return;
    //     }
    //
    //     // 2. 가져온 데이터를 반복하고 각 행의 test_date 값을 수정합니다.
    //     const updatedData = data.map((item) => {
    //         const dateParts = item.test_date.match(/(\d+)/g);
    //         const [year, month, day] = dateParts;
    //
    //         const paddedMonth = String(month).padStart(2, "0");
    //         const paddedDay = String(day).padStart(2, "0");
    //
    //         const formattedDate = `${year}년 ${paddedMonth}월 ${paddedDay}일`;
    //
    //         // 3. 기존 데이터가 2023년 10월 20일 이런 식으로 앞에 0이 안 들어가도 되면 수정하지 않고 앞에 0이 들어가야 하는 경우에만 수정하도록
    //         if (formattedDate !== item.test_date) {
    //             return { id: item.id, test_date: formattedDate };
    //         }
    //
    //         return null;
    //     });
    //
    //     // 필터링하여 null 값을 제거합니다.
    //     const filteredData = updatedData.filter((item) => item !== null);
    //
    //     // 4. 수정된 데이터를 다시 데이터베이스에 업데이트합니다.
    //     const { error: updateError } = await supabase
    //         .from("bunch")
    //         .upsert(filteredData, { onConflict: "id" });
    //
    //     if (updateError) {
    //         console.error("Error updating data: ", updateError);
    //         return;
    //     }
    //
    //     console.log("Data updated successfully");
    // };

    return (
        <div className="px-4 py-8" style={{ maxWidth: "600px" }}>
            <h1 className="text-2xl font-bold mb-4">최근 출하된 목록1</h1>
            <ul>
                {shipments.map((shipment) => (
                    <li key={shipment.id} className="border-b border-gray-200 py-4 justify-between">
                        <span className={"text-xl font-bold"}>{shipment.company} {shipment.place} {shipment.area}</span>
                        <div>
                            <span className={"text-sm mr-4"}>{shipment.name}</span>
                            <span className={"text-sm"}>검수날짜 - {shipment.test_date}</span>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="mt-4">
                <button className="btn bg-blue-500 text-white px-4 py-2 rounded">더보기</button>
            </div>
        </div>
    );
}