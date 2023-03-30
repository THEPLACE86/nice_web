import React, { useState } from 'react';
import {supabase} from "../../utils/supabaseClient";

function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const [resultsA, setResultsA] = useState([]);
    const [resultsB, setResultsB] = useState([]);
    const [page, setPage] = useState(1);

    const handleLoadMore = async () => {
        const nextPage = page + 1;
        const searchResultsA = await search(searchTerm, 'product_list', nextPage);
        const searchResultsB = await search(searchTerm, 'product', nextPage);
        setResultsA((prevResultsA) => [...prevResultsA, ...searchResultsA]);
        setResultsB((prevResultsB) => [...prevResultsB, ...searchResultsB]);
        setPage(nextPage);
    };
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = async () => {
        const searchResultsA = await search(searchTerm, 'product_list', 1);
        const searchResultsB = await search(searchTerm, 'product', 1);
        setResultsA(searchResultsA);
        setResultsB(searchResultsB);
        setPage(1);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    }
    async function search(query, tableName, pageNumber) {
        const result = await supabase
            .from(tableName)
            .select()
            .or(
                `company.ilike.%${query}%,place.ilike.%${query}%,area.ilike.%${query}%`
            )
            .range((pageNumber - 1) * 5, pageNumber * 5 - 1).order('created_at', {ascending: true})

        return result.data;
    }

    return (
        <div className="flex flex-col items-center">
            <input
                className="w-850px border-2 border-gray-300 p-2 rounded"
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyPress}
            />
            <div className="mt-8">
                {searchTerm === '' ? (
                    <h1 className="text-2xl font-semibold">회사명, 현장명, 구역명 검색</h1>
                ) : (
                    <div className="mt-8">
                        <h2 className="text-xl font-bold mb-4">생산계획표</h2>
                        {resultsA.map((result, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 border-2 border-gray-200 rounded-lg mb-4"
                            >
                                <p className={"text-xl"}>{result.company} {result.place} {result.area} {result.initial !== " " && `(${result.initial})`}</p>
                                <p className={"mt-1"}>검수날짜 : {result.test_date}</p>
                                <p>
                                    {
                                        (result.work_type === '용접/무용접' || result.worker_type === '나사') ? (
                                            <>가지관 (<span className={"text-orange-600"}>{result.worker}</span>) 메인관 (<span className={"text-orange-600"}>{result.worker_main}</span>)</>
                                        ) : (
                                            <>가지관 (<span className={"text-orange-600"}>{result.worker}</span>)</>
                                        )
                                    }
                                </p>
                                <p className={"mt-2"}>{result.name}</p>
                            </div>
                        ))}

                        <h2 className="text-xl font-bold mt-8 mb-4">검수리스트</h2>
                        {resultsB.map((result, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 border-2 border-gray-200 rounded-lg mb-4"
                            >
                                <p className={"text-xl"}>{result.company} {result.place} {result.area} {result.initial !== " " && `(${result.initial})`}</p>
                                <p className={"mt-1"}>검수날짜 : {result.test_date}</p>
                                <p>
                                    비확관 총수량 : {result.a25} EA
                                </p>
                                <p>
                                    확관 총수량 : {result.totalH} EA
                                </p>
                            </div>
                        ))}
                    </div>

                )}
                {searchTerm !== '' && (
                    <button
                        className="mt-4 text-blue-600 font-semibold"
                        onClick={handleLoadMore}
                    >
                        더 보기...
                    </button>
                )}
            </div>

        </div>
    );
}

export default Search;
