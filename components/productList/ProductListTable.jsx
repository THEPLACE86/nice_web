const ProductListTable = ({ type, data }) => {
    const totalHead = data.reduce((sum, item) => sum + item.head, 0);
    const totalHole = data.reduce((sum, item) => sum + item.hole, 0);
    const totalGroove = data.reduce((sum, item) => sum + item.groove, 0);

    return (
        <div className="mb-8">
            <h1 className="text-xl font-semibold mb-2">{type}</h1>
            <table className="w-full border-collapse mx-auto">
                <thead>
                <tr>
                    <th className="border border-gray-600 p-2">Company</th>
                    <th className="border border-gray-600 p-2">Place</th>
                    <th className="border border-gray-600 p-2">Area</th>
                    <th className="border border-gray-600 p-2">Work Type</th>
                    <th className="border border-gray-600 p-2">Head</th>
                    <th className="border border-gray-600 p-2">Hole</th>
                    <th className="border border-gray-600 p-2">Groove</th>
                    <th className="border border-gray-600 p-2">Memo</th>
                    <th className="border border-gray-600 p-2">Initial</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item) => (
                    <tr key={item.id}>
                        <td className="border border-gray-600 p-2">{item.company}</td>
                        <td className="border border-gray-600 p-2">{item.place}</td>
                        <td className="border border-gray-600 p-2">{item.area}</td>
                        <td className="border border-gray-600 p-2">{item.work_type}</td>
                        <td className="border border-gray-600 p-2">{item.head}</td>
                        <td className="border border-gray-600 p-2">{item.hole}</td>
                        <td className="border border-gray-600 p-2">{item.groove}</td>
                        <td className="border border-gray-600 p-2">{item.memo}</td>
                        <td className="border border-gray-600 p-2">{item.initial}</td>
                    </tr>
                ))}
                <tr>
                    <td colSpan="4" className="border border-gray-600 p-2 font-semibold">합계</td>
                    <td className="border border-gray-600 p-2">{totalHead}</td>
                    <td className="border border-gray-600 p-2">{totalHole}</td>
                    <td className="border border-gray-600 p-2">{totalGroove}</td>
                    <td colSpan="2" className="border border-gray-600 p-2"></td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}

export default ProductListTable;
