import { useState } from 'react';
import {supabase} from "../../utils/supabaseClient";

export default function ProductModal({ isOpen, onClose }) {
    const [shipmentContent, setShipmentContent] = useState('');
    const [specialNote, setSpecialNote] = useState('');
    const [area1, setArea1] = useState(false);
    const [area2, setArea2] = useState(false);
    const [locationType, setLocationType] = useState('');

    const handleSave = async () => {
        const { data, error } = await supabase.from('product_list').insert([
            {
                shipment_content: shipmentContent,
                special_note: specialNote,
                area1: area1,
                area2: area2,
                location_type: locationType,
            },
        ]);

        if (error) {
            console.error('Error inserting data:', error);
        } else {
            console.log('Data inserted:', data);
            onClose();
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="relative w-full max-w-md p-4 bg-white rounded">
                <button className="absolute top-2 right-2" onClick={onClose}>
                    &times;
                </button>
                <div className="space-y-4">
                    <div>
                        <span className="font-bold text-2xl">출하목록 추가</span>
                    </div>
                    <div>
                        <label htmlFor="shipmentContent" className="block text-sm font-medium">
                            출하 내용
                        </label>
                        <input
                            id="shipmentContent"
                            type="text"
                            value={shipmentContent}
                            onChange={(e) => setShipmentContent(e.target.value)}
                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="specialNote" className="block text-sm font-medium">
                            특이 사항
                        </label>
                        <input
                            id="specialNote"
                            type="text"
                            value={specialNote}
                            onChange={(e) => setSpecialNote(e.target.value)}
                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <span className="block text-sm font-medium">전체 구역필드</span>
                        <div className="mt-1">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked={area1}
                                    onChange={(e) => setArea1(e.target.checked)}
                                    className="text-blue-600 rounded border-gray-300"
                                />
                                <span className="ml-2">구역 1</span>
                            </label>
                            <label className="inline-flex items-center ml-6">
                                <input
                                    type="checkbox"
                                    checked={area2}
                                    onChange={(e) => setArea2(e.target.checked)}
                                    className="text-blue-600 rounded border-gray-300"
                                />
                                <span className="ml-2">구역 2</span>
                            </label>
                            {/* Add more checkboxes for other areas if needed */}
                        </div>
                    </div>
                    <div>
                        <span className="block text-sm font-medium">당착, 내착, 야상</span>
                        <div className="mt-1">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="locationType"
                                    value="당착"
                                    checked={locationType === '당착'}
                                    onChange={(e) => setLocationType(e.target.value)}
                                    className="text-blue-600 rounded border-gray-300"
                                />
                                <span className="ml-2">당착</span>
                            </label>
                            <label className="inline-flex items-center ml-6">
                                <input
                                    type="radio"
                                    name="locationType"
                                    value="내착"
                                    checked={locationType === '내착'}
                                    onChange={(e) => setLocationType(e.target.value)}
                                    className="text-blue-600 rounded border-gray-300"
                                />
                                <span className="ml-2">내착</span>
                            </label>
                            <label className="inline-flex items-center ml-6">
                                <input
                                    type="radio"
                                    name="locationType"
                                    value="야상"
                                    checked={locationType === '야상'}
                                    onChange={(e) => setLocationType(e.target.value)}
                                    className="text-blue-600 rounded border-gray-300"
                                />
                                <span className="ml-2">야상</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="bg-blue-600 text-white font-bold py-2 px-4 rounded"
                            onClick={handleSave}
                        >
                            저장
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

