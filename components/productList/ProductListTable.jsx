import styled from "styled-components";
import tw from "twin.macro";
import Modal from "../util/model";
import React, {useEffect, useState} from "react";
import {supabase} from "../../utils/supabaseClient";
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import { format } from 'date-fns';
import {useRouter} from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate } from '@fortawesome/free-solid-svg-icons';
import loadDataFromLocalStorage from "../../utils/localStorage";

const TableTH = styled.th`
  ${tw`border border-gray-400 p-1 text-center`}
  width: ${(props) => props.width};
`;

const ProductListTable = ({ type, data, test_date }) => {
    const totalHead = data.reduce((sum, item) => sum + item.head, 0);
    const totalHole = data.reduce((sum, item) => sum + item.hole, 0);
    const totalGroove = data.reduce((sum, item) => sum + item.groove, 0);

    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null); // 선택된 항목에 대한 상태를 추가합니다.
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const [showNewModal, setShowNewModal] = useState(false);
    const router = useRouter()

    const [content, setContent] = useState('');
    const [notes, setNotes] = useState('');
    const [area, setArea] = useState(false);
    const [status, setStatus] = useState('');

    const [date, setDate] = useState(new Date());

    async function saveShipment(){
        const { data: { user } } = await supabase.auth.getUser()
        const userData = loadDataFromLocalStorage('user')

        const dateFormatter = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
        const dateString = dateFormatter.format(date);

        const { error } = await supabase.from('shipment').insert({
            'shipment_content': content,
            'memo': notes,
            'drawing': area,
            'radio': status,
            'place': selectedItem.company + ' ' + selectedItem.place,
            'name': userData.name,
            'uid': user.id,
            'test_date': selectedItem.test_date,
            'initial': selectedItem.initial,
            'shipment_date' : dateString
        });
        if (error) {
            console.error('Error inserting data: ', error);
        } else {
            setShowNewModal(false);
        }
    }

    const handleShipmentButtonClick = () => {
        setShowModal(false);
        setShowNewModal(true);
    };

    const handleRowClick = (item) => {
        setSelectedItem(item); // 행이 클릭되면 선택된 항목을 설정합니다.
        setShowModal(true); // 모달을 표시합니다.
    };
    const getStatusClassName = (status) => {
        switch (status) {
            case '작업중':
                return 'bg-blue-500 text-white';
            case '작업완료':
                return 'bg-black text-white';
            case '출하완료':
                return 'bg-red-500 text-white';
            default:
                return 'bg-white';
        }
    };
    const WorkerCell = ({ item }) => {
        const className = `text-sm ${getStatusClassName(item.worker)}`;
        return <TableTH className={className}>{item.worker}</TableTH>;
    }
    const WorkerCellMain = ({ item }) => {
        const className = `text-sm ${getStatusClassName(item.worker_main)}`;
        return <TableTH className={className}>{item.worker_main}</TableTH>;
    }
    const drawingBtn = async (id, drawing) => {
        await supabase.from('product_list').update({
            'drawing' : !drawing
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
        const { data: { user } } = await supabase.auth.getUser()
        const userData = loadDataFromLocalStorage('user')

        try{
            if(worker === '작업전'){
                await supabase.from('product_list').update({
                    'worker':'작업중'
                }).eq('id', id)
                await supabase.from('product_history').insert({
                    'place': selectedItem.company + ' ' + selectedItem.place + ' ' + selectedItem.area,
                    'test_date': test_date,
                    'name': userData.name,
                    'uid': user.id,
                    'old_state': worker,
                    'new_state': '작업중'
                })
                setShowModal(false)
            }else if(worker === '작업중') {
                await supabase.from('product_list').update({
                    'worker': '작업완료'
                }).eq('id', id)
                await supabase.from('product_history').insert({
                    'place': selectedItem.company + ' ' + selectedItem.place + ' ' + selectedItem.area,
                    'test_date': test_date,
                    'name': userData.name,
                    'uid': user.id,
                    'old_state': worker,
                    'new_state': '작업완료'
                })
                setShowModal(false)
            }else if(worker === '작업완료') {
                await supabase.from('product_list').update({
                    'worker': '출하완료'
                }).eq('id', id)
                await supabase.from('product_history').insert({
                    'place': selectedItem.company + ' ' + selectedItem.place + ' ' + selectedItem.area,
                    'test_date': test_date,
                    'name': userData.name,
                    'uid': user.id,
                    'old_state': worker,
                    'new_state': '출하완료'
                })
                setShowModal(false)
            }
        }catch (e){
            console.error(e.message)
        }
    }
    const changeWorkerMain = async (worker_main, id) => {
        const { data: { user } } = await supabase.auth.getUser()
        const userData = loadDataFromLocalStorage('user')

        try{
            if(worker_main === '작업전'){
                await supabase.from('product_list').update({
                    'worker_main':'작업중'
                }).eq('id', id)
                await supabase.from('product_history').insert({
                    'place': selectedItem.company + ' ' + selectedItem.place + ' ' + selectedItem.area + '(메인관)',
                    'test_date': test_date,
                    'name': userData.name,
                    'uid': user.id,
                    'old_state': worker_main,
                    'new_state': '작업중'
                })
                setShowModal(false)
            }else if(worker_main === '작업중') {
                await supabase.from('product_list').update({
                    'worker_main': '작업완료'
                }).eq('id', id)
                await supabase.from('product_history').insert({
                    'place': selectedItem.company + ' ' + selectedItem.place + ' ' + selectedItem.area + '(메인관)',
                    'test_date': test_date,
                    'name': userData.name,
                    'uid': user.id,
                    'old_state': worker_main,
                    'new_state': '작업완료'
                })
                setShowModal(false)
            }else if(worker_main === '작업완료') {
                await supabase.from('product_list').update({
                    'worker_main': '출하완료'
                }).eq('id', id)
                await supabase.from('product_history').insert({
                    'place': selectedItem.company + ' ' + selectedItem.place + ' ' + selectedItem.area + '(메인관)',
                    'test_date': test_date,
                    'name': userData.name,
                    'uid': user.id,
                    'old_state': worker_main,
                    'new_state': '출하완료'
                })
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
        const confirmed = window.confirm('삭제 하시겠습니까?')

        if(confirmed){
            try{
                await supabase.from('product_list').delete().eq('id', id)
                setShowModal(false)
            }catch (e) {
                console.log(e.message)
            }
        }
    }

    const workerBack = async (worker, id) => {
        const { data: { user } } = await supabase.auth.getUser()
        const userData = loadDataFromLocalStorage('user')

        try{
            if(worker === '작업중') {
                await supabase.from('product_list').update({
                    'worker': '작업전'
                }).eq('id', id)
                await supabase.from('product_history').insert({
                    'place': selectedItem.company + ' ' + selectedItem.place + ' ' + selectedItem.area,
                    'test_date': test_date,
                    'name': userData.name,
                    'uid': user.id,
                    'old_state': worker,
                    'new_state': '작업전',
                })
                setShowModal(false)
            }else if(worker === '작업완료') {
                await supabase.from('product_list').update({
                    'worker': '작업중'
                }).eq('id', id)
                await supabase.from('product_history').insert({
                    'place': selectedItem.company + ' ' + selectedItem.place + ' ' + selectedItem.area,
                    'test_date': test_date,
                    'name': userData.name,
                    'uid': user.id,
                    'old_state': worker,
                    'new_state': '작업중',
                })
                setShowModal(false)
            }else if(worker === '출하완료') {
                await supabase.from('product_list').update({
                    'worker': '작업완료'
                }).eq('id', id)
                await supabase.from('product_history').insert({
                    'place': selectedItem.company + ' ' + selectedItem.place + ' ' + selectedItem.area,
                    'test_date': test_date,
                    'name': userData.name,
                    'uid': user.id,
                    'old_state': worker,
                    'new_state': '작업완료',
                })
                setShowModal(false)
            }
        }catch (e){
            console.error(e.message)
        }
    }
    const workerBackMain = async (worker_main, id) => {
        const { data: { user } } = await supabase.auth.getUser()
        const userData = loadDataFromLocalStorage('user')

        try{
            if(worker_main === '작업중') {
                await supabase.from('product_list').update({
                    'worker_main': '작업전'
                }).eq('id', id)
                await supabase.from('product_history').insert({
                    'place': selectedItem.company + ' ' + selectedItem.place + ' ' + selectedItem.area + '(메인관)',
                    'test_date': test_date,
                    'name': userData.name,
                    'uid': user.id,
                    'old_state': worker_main,
                    'new_state': '작업전',
                })
                setShowModal(false)
            }else if(worker_main === '작업완료') {
                await supabase.from('product_list').update({
                    'worker_main': '작업중'
                }).eq('id', id)
                await supabase.from('product_history').insert({
                    'place': selectedItem.company + ' ' + selectedItem.place + ' ' + selectedItem.area + '(메인관)',
                    'test_date': test_date,
                    'name': userData.name,
                    'uid': user.id,
                    'old_state': worker_main,
                    'new_state': '작업중',
                })
                setShowModal(false)
            }else if(worker_main === '출하완료') {
                await supabase.from('product_list').update({
                    'worker_main': '작업완료'
                }).eq('id', id)
                await supabase.from('product_history').insert({
                    'place': selectedItem.company + ' ' + selectedItem.place + ' ' + selectedItem.area + '(메인관)',
                    'test_date': test_date,
                    'name': userData.name,
                    'uid': user.id,
                    'old_state': worker_main,
                    'new_state': '작업완료',
                })
                setShowModal(false)
            }
        }catch (e){
            console.error(e.message)
        }
    }

    return (
        <div>

            <h1 className={`text-xl font-bold mb-2 ${type === '기타' && 'text-orange-500'}`}>{type}</h1>

            <table className="w-full border-collapse mx-auto">
                <thead>
                <tr>
                    {type === '용접/무용접' || type === '나사' ? (
                        <>
                            <TableTH width="4.5rem" className={`text-sm bg-blue-50`}>가지관</TableTH>
                            <TableTH width="4.5rem" className={'bg-blue-50 text-sm'}>메인관</TableTH>
                        </>
                    ) : (
                        <TableTH width="9rem" className={`text-sm ${type === '기타' ? 'bg-orange-100' : 'bg-blue-50'}`} style={{ textAlign: 'center' }}>작업현황</TableTH>
                    )}
                    <TableTH width="3.5rem" className={`text-sm ${type === '기타' ? 'bg-orange-100' : 'bg-blue-50'}`}>이니셜</TableTH>
                    <TableTH width="4rem" className={`text-sm ${type === '기타' ? 'bg-orange-100' : 'bg-blue-50'}`}>담당</TableTH>
                    <TableTH width="7rem" className={`text-sm ${type === '기타' ? 'bg-orange-100' : 'bg-blue-50'}`}>회사</TableTH>
                    <TableTH width="12rem" className={`text-sm ${type === '기타' ? 'bg-orange-100' : 'bg-blue-50'}`}>현장명</TableTH>
                    <TableTH width="18rem" className={`text-sm ${type === '기타' ? 'bg-orange-100' : 'bg-blue-50'}`}>구역명</TableTH>
                    <TableTH width="4rem" className={`text-sm ${type === '기타' ? 'bg-orange-100' : 'bg-blue-50'}`}>헤드</TableTH>
                    <TableTH width="4rem" className={`text-sm ${type === '기타' ? 'bg-orange-100' : 'bg-blue-50'}`}>홀</TableTH>
                    <TableTH width="4rem" className={`text-sm ${type === '기타' ? 'bg-orange-100' : 'bg-blue-50'}`}>그루브</TableTH>
                    <TableTH className={`text-sm ${type === '기타' ? 'bg-orange-100' : 'bg-blue-50'}`}>비고</TableTH>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={index} onClick={() => handleRowClick(item)} className="cursor-pointer">
                        {type === '용접/무용접' || type === '나사' ? (
                            <>
                                <WorkerCell item={item} />
                                <WorkerCellMain item={item}/>
                            </>
                        ) : (
                            <WorkerCell item={item}/>
                        )}

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
                    <td colSpan={(type === '용접/무용접' || type === '나사') ? '7' : '6'} className="text-sm border-none p-1 text-center font-semibold text-end">합계</td>
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
                        <button className="bg-secondary text-white px-4 py-2 rounded" onClick={() => goToUpdate(selectedItem.id)}>수정</button>
                        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => deleteProduct(selectedItem.id)}>삭제</button>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => drawingBtn(selectedItem.id, selectedItem.drawing)}>{selectedItem.drawing ? '배포취소':'도면배포'}</button>
                        <button className="bg-indigo-500 text-white px-4 py-2 rounded" onClick={handleShipmentButtonClick}>출하</button>
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
                    <div className="flex">
                        <div className="mt-2 mr-6">
                            <p className={"font-bold"}>가지관</p>
                            <button className="bg-info text-white px-4 py-2 mr-4 rounded" onClick={() => changeWorker(selectedItem.worker, selectedItem.id)}>
                                {
                                    selectedItem.worker === '작업전' ? '작업중 변경' :
                                        selectedItem.worker === '작업중' ? '작업완료 변경' :
                                            selectedItem.worker === '작업완료' ? '출하완료 변경' : '출하가 완료되었습니다.'
                                }
                            </button>
                            {selectedItem.worker !== '작업전' && <FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faRotate} size="2xl" onClick={() => workerBack(selectedItem.worker,selectedItem.id)} />}
                        </div>
                        {(type === '용접/무용접' || type === '나사') && <div className="mt-2">
                            <p className={"font-bold"}>메인관</p>
                            <button className="bg-info text-white px-4 py-2 mr-4 rounded" onClick={() => changeWorkerMain(selectedItem.worker_main, selectedItem.id)}>
                                {
                                    selectedItem.worker_main === '작업전' ? '작업중 변경' :
                                        selectedItem.worker_main === '작업중' ? '작업완료 변경' :
                                            selectedItem.worker_main === '작업완료' ? '출하완료 변경' : '출하가 완료되었습니다.'
                                }
                            </button>
                            {selectedItem.worker_main !== '작업전' && <FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faRotate} size="2xl" onClick={() => workerBackMain(selectedItem.worker_main,selectedItem.id)} />}
                        </div>}
                    </div>
                    <div className={"mt-2"}>
                        <button className={"btn btn-primary"}>작업취소</button>
                    </div>

                </Modal>
            )}
            {showNewModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="modal modal-open">
                        <div className="modal-box space-y-4">
                            <h2 className="text-xl font-bold">{selectedItem.company} {selectedItem.place} 출하목록 추가</h2>
                            <div>
                                <DatePicker
                                    selected={date}
                                    onChange={(date) => setDate(date)}
                                    dateFormat="yyyy년 M월 d일"
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">출하내용</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">특이사항(도착시간)</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label w-24">
                                    <span className="label-text font-bold ">도면배포</span>
                                    <input
                                        type="checkbox"
                                        className="checkbox ml-2"
                                        value={area}
                                        onChange={(e) => setArea(e.target.checked)}
                                    />
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold">출하 상태</span>
                                </label>
                                <div className="flex">
                                    <label className="cursor-pointer flex items-center mr-4">
                                        <input
                                            type="radio"
                                            name="status"
                                            className="radio mr-2"
                                            value="당착(오전)"
                                            onChange={() => setStatus("당착(오전)")}
                                        />
                                        당착(오전)
                                    </label>
                                    <label className="cursor-pointer flex items-center mr-4">
                                        <input
                                            type="radio"
                                            name="status"
                                            className="radio mr-2"
                                            value="당착(오후)"
                                            onChange={() => setStatus("당착(오후)")}
                                        />
                                        당착(오후)
                                    </label>
                                    <label className="cursor-pointer flex items-center mr-4">
                                        <input
                                            type="radio"
                                            name="status"
                                            className="radio mr-2"
                                            value="야상"
                                            onChange={() => setStatus("야상")}
                                        />
                                        야상
                                    </label>
                                    <label className="cursor-pointer flex items-center">
                                        <input
                                            type="radio"
                                            name="status"
                                            className="radio mr-2"
                                            value="택배"
                                            onChange={() => setStatus("택배")}
                                        />
                                        택배
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button className="btn" onClick={() => setShowNewModal(false)}>
                                    취소
                                </button>
                                <button className="btn btn-primary" onClick={saveShipment}>
                                    저장
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductListTable;
