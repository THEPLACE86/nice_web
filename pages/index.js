import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Home() {

    const [shipments, setShipments] = useState([]);

    useEffect(() => {
        fetchShipments();
    }, []);

    async function fetchShipments() {
        const { data, error } = await supabase.from("product_list").select()
            .eq('worker', '출하완료').order('updated_at', {ascending: true}).limit(7);
        if (error) console.error("Error fetching shipments:", error);
        else setShipments(data);
    }

    return (
        <div className="px-4 py-8" style={{ maxWidth: "600px" }}>
            <h1 className="text-2xl font-bold mb-4">최근 출하된 목록</h1>
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