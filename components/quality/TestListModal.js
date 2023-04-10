import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import formatDate from "../../utils/formatDate";
import {supabase} from "../../utils/supabaseClient";
import {useRouter} from "next/router";

const TestListModal = ({ item }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const countCheck = async (id, a25, a32, a40, a50, a65) => {

        await router.push({
            pathname: '/quality/countCheck',
            query: { id, a25, a32, a40, a50, a65 },
        });
        setIsModalOpen(false)
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
                            <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 text-black px-4 py-2 ml-2 rounded">닫기</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default TestListModal