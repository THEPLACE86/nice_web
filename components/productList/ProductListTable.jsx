import styled from "styled-components";
import tw from "twin.macro";
import Modal from "../util/model";
import {useEffect, useState} from "react";
import {supabase} from "../../utils/supabaseClient";
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import { format } from 'date-fns';
import {useRouter} from "next/navigation";

const TableTH = styled.th`
  ${tw`border border-gray-400 p-1 text-center`}
  width: ${(props) => props.width};
`;

const ProductListTable = ({ type, data }) => {
    const totalHead = data.reduce((sum, item) => sum + item.head, 0);
    const totalHole = data.reduce((sum, item) => sum + item.hole, 0);
    const totalGroove = data.reduce((sum, item) => sum + item.groove, 0);

    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null); // 선택된 항목에 대한 상태를 추가합니다.
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const router = useRouter()

    const handleRowClick = (item) => {
        setSelectedItem(item); // 행이 클릭되면 선택된 항목을 설정합니다.
        setShowModal(true); // 모달을 표시합니다.
    };
    const getStatusClassName = (status) => {
        switch (status) {
            case '작업중':
                return 'bg-blue-500 text-white';
            case '작업완료':
                return 'bg-red-500 text-white';
            case '출하완료':
                return 'bg-orange-500 text-white';
            default:
                return 'bg-white';
        }
    };
    const WorkerCell = ({ item }) => {
        const className = `text-sm ${getStatusClassName(item.worker)}`;
        return <TableTH className={className}>{item.worker}</TableTH>;
    }
    const drawingBtn = async (id) => {
        await supabase.from('product_list').update({
            'drawing' : true
        }).eq('id', id)
        setShowModal(false)
    }
    const paperBtn = async (id) => {
        await supabase.from('product_list').update({
            'paper' : true
        }).eq('id', id)
        setShowModal(false)
    }
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleDateSave = () => {
        if (selectedDate) {
            updateTestDate();
        }
        setShowModal(false);
    };
    const updateTestDate = async () => {
        if (selectedDate) {
            const formattedDate = format(selectedDate, 'yyyy년 M월 d일'); // 날짜를 원하는 포맷으로 변환
            try {
                const { error } = await supabase.from('product_list')
                    .update({ test_date: formattedDate })
                    .eq('id', selectedItem.id);
                if (error) {
                    throw error;
                }
                setShowDatePicker(false);
            } catch (error) {
                console.error('Failed to update test_date:', error.message);
            }
        }
    };
    const changeWorker = async (worker, id) => {
        console.log(data.worker)
        try{
            if(worker === '작업전'){
                await supabase.from('product_list').update({
                    'worker':'작업중'
                }).eq('id', id)
                setShowModal(false)
            }else if(worker === '작업중') {
                await supabase.from('product_list').update({
                    'worker': '작업완료'
                }).eq('id', id)
                setShowModal(false)
            }else if(worker === '작업완료') {
                await supabase.from('product_list').update({
                    'worker': '출하완료'
                }).eq('id', id)
                setShowModal(false)
            }
        }catch (e){
            console.error(e.message)
        }
    }

    const goToUpdate = (id) => {
        router.push({
            pathname: '/productList/update',
            query: { id: id },
        });
    }

    const deleteProduct = async (id) => {
        await supabase.from('product_list').delete({'id': id})
    }

    return (
        <div>
            <h1 className={`text-xl font-bold mb-2 ${type === '기타' && 'text-orange-500'}`}>{type}</h1>
            <table className="w-full border-collapse mx-auto">
                <thead>
                <tr>
                    <TableTH width="5rem" className={`text-sm ${type === '기타' ? 'bg-orange-100' : 'bg-blue-50'}`}>작업현황</TableTH>
                    <TableTH width="4rem" className={`text-sm ${type === '기타' ? 'bg-orange-100' : 'bg-blue-50'}`}>이니셜</TableTH>
                    <TableTH width="4rem" className={`text-sm ${type === '기타' ? 'bg-orange-100' : 'bg-blue-50'}`}>담당</TableTH>
                    <TableTH width="7rem" className={`text-sm ${type === '기타' ? 'bg-orange-100' : 'bg-blue-50'}`}>회사</TableTH>
                    <TableTH width="11rem" className={`text-sm ${type === '기타' ? 'bg-orange-100' : 'bg-blue-50'}`}>현장명</TableTH>
                    <TableTH width="14rem" className={`text-sm ${type === '기타' ? 'bg-orange-100' : 'bg-blue-50'}`}>구역명</TableTH>
                    <TableTH width="5rem" className={`text-sm ${type === '기타' ? 'bg-orange-100' : 'bg-blue-50'}`}>헤드</TableTH>
                    <TableTH width="5rem" className={`text-sm ${type === '기타' ? 'bg-orange-100' : 'bg-blue-50'}`}>홀</TableTH>
                    <TableTH width="5rem" className={`text-sm ${type === '기타' ? 'bg-orange-100' : 'bg-blue-50'}`}>그루브</TableTH>
                    <TableTH className={`text-sm ${type === '기타' ? 'bg-orange-100' : 'bg-blue-50'}`}>비고</TableTH>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={index} onClick={() => handleRowClick(item)} className="cursor-pointer">
                        <WorkerCell item={item} />
                        <TableTH className={`text-sm font-normal ${item.paper && 'bg-accent'} ${item.worker === '출하완료' && 'line-through'}`}>{item.initial}</TableTH>
                        <TableTH className={`text-sm font-normal ${item.worker === '출하완료' && 'line-through'}`}>{item.name}</TableTH>
                        <TableTH className={`text-sm font-normal ${item.drawing && 'bg-orange-200'} ${item.worker === '출하완료' && 'line-through'}`}>{item.company}</TableTH>
                        <TableTH className={`text-sm font-normal ${item.worker === '출하완료' && 'line-through'}`}>{item.place}</TableTH>
                        <TableTH className={`text-sm font-normal ${item.worker === '출하완료' && 'line-through'}`}>{item.area}</TableTH>
                        <TableTH className={`text-sm font-normal ${item.worker === '출하완료' && 'line-through'}`}>{item.head !== 0 && item.head}</TableTH>
                        <TableTH className={`text-sm font-normal ${item.worker === '출하완료' && 'line-through'}`}>{item.hole !== 0 && item.hole}</TableTH>
                        <TableTH className={`text-sm font-normal ${item.worker === '출하완료' && 'line-through'}`}>{item.groove !== 0 && item.groove}</TableTH>
                        <TableTH className={`text-sm font-normal ${item.worker === '출하완료' && 'line-through'}`}>{item.memo}</TableTH>
                    </tr>
                ))}
                <tr>
                    <td colSpan="6" className="text-sm border-none p-1 text-center font-semibold text-end">합계</td>
                    <TableTH className="text-sm bg-yellow-100">{ totalHead !== 0 && totalHead }</TableTH>
                    <TableTH className="text-sm bg-yellow-100">{ totalHole !== 0 && totalHole }</TableTH>
                    <TableTH className="text-sm bg-yellow-100">{ totalGroove !== 0 && totalGroove }</TableTH>
                    <td colSpan="3" className="text-sm border-none p-2 text-center"></td>
                </tr>
                </tbody>
            </table>
            {showModal && selectedItem && (
                <Modal onClose={() => setShowModal(false)}>
                    <span className="font-bold text-2xl">{selectedItem.company} {selectedItem.place} {selectedItem.area}</span>
                    <p className="text-xl font-bold mt-6">설계부</p>
                    <div className="flex space-x-4 mt-4 mb-4">
                        <button className="bg-indigo-500 text-white px-4 py-2 rounded" onClick={() => goToUpdate(selectedItem.id)}>수정</button>
                        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => deleteProduct(selectedItem.id)}>삭제</button>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => drawingBtn(selectedItem.id)}>도면배포</button>
                    </div>
                    <div className="mt-2 mb-8">
                        <button className="bg-warning text-white px-4 py-2 rounded" onClick={() => setShowDatePicker(!showDatePicker)}>검수날짜 변경</button>
                        {showDatePicker && (
                            <div className="absolute z-10">
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={handleDateChange}
                                    inline
                                    filterDate={(date) => date.getDay() === 2}
                                    onClickOutside={handleDateSave}
                                    locale={ko}
                                />
                            </div>
                        )}
                    </div>
                    <span className="text-xl font-bold">품질부</span>
                    <div className="flex space-x-4 mt-4 mb-6">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => paperBtn(selectedItem.id)}>증지</button>
                    </div>
                    <span className="text-xl font-bold">작업변경</span>
                    <div className="mt-2">
                        <button className="bg-info text-white px-4 py-2 rounded" onClick={() => changeWorker(selectedItem.worker, selectedItem.id)}>
                            {
                                selectedItem.worker === '작업전' ? '작업중 변경' :
                                    selectedItem.worker === '작업중' ? '작업완료 변경' :
                                        selectedItem.worker === '작업완료' ? '출하완료 변경' : '출하가 완료되었습니다.'
                            }
                        </button>
                        <button></button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default ProductListTable;
