import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {supabase} from "../../../utils/supabaseClient";

function CountCheck(props) {
    const { id, a25,a32,a40,a50,a65 } = props
    const router = useRouter()

    const [data, setData] = useState([])

    useEffect(() => {
        const getData = async () => {
            const {data, error} = await supabase.from('bunch').select().eq('test_list_id', id).single()
            if(data != null){
                console.log(data)
                setData(data)
            }
        }
        getData().then(r => console.log(r))
    },[])

    useEffect(() => {
        supabase.channel('bunch').on("postgres_changes", {
            event: '*', schema: 'public', table: 'bunch',
        }, payload => {
            console.log(payload)
            const newData = payload.new
            setData((prevData) => newData);
        }).subscribe()
    }, []);

    const handleInputChange = async (e,h) => {
        await supabase.from('bunch').update({
            [h] : e.target.value
        }).eq('test_list_id', id)
    }
    const onCheck = async () => {
        const totalA25 = data.a25_01 + data.a25_02 + data.a25_03 + data.a25_04 + data.a25_05 + data.a25_06
        const totalA32 = data.a32_01 + data.a32_02 + data.a32_03 + data.a32_04 + data.a32_05 + data.a32_06
        const totalA40 = data.a40_01 + data.a40_02 + data.a40_03 + data.a40_04 + data.a40_05 + data.a40_06
        const totalA50 = data.a50_01 + data.a50_02 + data.a50_03 + data.a50_04 + data.a50_05 + data.a50_06
        const totalA65 = data.a65_01 + data.a65_02 + data.a65_03 + data.a65_04 + data.a65_05 + data.a65_06

        if(totalA25 !== parseInt(a25)){
            alert("25A 합계가 다릅니다.")
        }else if(totalA32 !== parseInt(a32)){
            alert("32A 합계가 다릅니다.")
        }else if(totalA40 !== parseInt(a40)){
            alert("40A 합계가 다릅니다.")
        }else if(totalA50 !== parseInt(a50)){
            alert("50A 합계가 다릅니다.")
        }else if(totalA65 !== parseInt(a65)){
            alert("65A 합계가 다릅니다.")
        }else{
            await supabase.from('product').update({
                'countCheck': true
            }).eq('id', id)

            await supabase.from('bunch').update({
                'total25': parseInt(a25),
                'total32': parseInt(a32),
                'total40': parseInt(a40),
                'total50': parseInt(a50),
                'total65': parseInt(a65),
            }).eq('test_list_id', id)

            router.back()
        }
    }

    return(
        <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{data.place} 수량체크</h2>
            <div className="flex justify-center items-center font-bold text-2xl">
                <h3>A25<br/>{a25}</h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <h3>A32<br/>{a32}</h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <h3>A40<br/>{a40}</h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <h3>A50<br/>{a50}</h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <h3>A65<br/>{a65}</h3>
            </div>
            <br/>
            <span className={"font-bold text-orange-600"}>1번 다발</span>
            <div className="flex justify-center items-center">
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>25A</span>
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a25_01} onBlur={(e) => handleInputChange(e, "a25_01")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>32A</span>&nbsp;&nbsp;&nbsp;
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a32_01} onBlur={(e) => handleInputChange(e, "a32_01")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>40A</span>
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a40_01} onBlur={(e) => handleInputChange(e, "a40_01")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>50A</span>
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a50_01} onBlur={(e) => handleInputChange(e, "a50_01")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>65A</span>
                <input min="0" type="number" style={{ width: "70px",fontWeight: "bold" }} defaultValue={data.a65_01} onBlur={(e) => handleInputChange(e, "a65_01")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <br/>
            <span className={"font-bold text-orange-600"}>2번 다발</span>
            <div className="flex justify-center items-center">
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>25A</span>
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a25_02} onBlur={(e) => handleInputChange(e, "a25_02")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>32A</span>
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a32_02} onBlur={(e) => handleInputChange(e, "a32_02")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>40A</span>
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a40_02} onBlur={(e) => handleInputChange(e, "a40_02")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>50A</span>
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a50_02} onBlur={(e) => handleInputChange(e, "a50_02")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>65A</span>
                <input min="0" type="number" style={{ width: "70px",fontWeight: "bold" }} defaultValue={data.a65_02} onBlur={(e) => handleInputChange(e, "a65_02")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <br/>
            <span className={"font-bold text-orange-600"}>3번 다발</span>
            <div className="flex justify-center items-center">
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>25A</span>
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a25_03} onBlur={(e) => handleInputChange(e, "a25_03")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>32A</span>
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a32_03} onBlur={(e) => handleInputChange(e, "a32_03")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>40A</span>
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a40_03} onBlur={(e) => handleInputChange(e, "a40_03")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>50A</span>
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a50_03} onBlur={(e) => handleInputChange(e, "a50_03")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>65A</span>
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a65_03} onBlur={(e) => handleInputChange(e, "a65_03")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <br/>
            <span className={"font-bold text-orange-600"}>4번 다발</span>
            <div className="flex justify-center items-center">
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>25A</span>
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a25_04} onBlur={(e) => handleInputChange(e, "a25_04")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>32A</span>
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a32_04} onBlur={(e) => handleInputChange(e, "a32_04")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>40A</span>
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a40_04} onBlur={(e) => handleInputChange(e, "a40_04")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>50A</span>
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a50_04} onBlur={(e) => handleInputChange(e, "a50_04")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>65A</span>
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a65_04} onBlur={(e) => handleInputChange(e, "a65_04")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <br/>
            <span className={"font-bold text-orange-600"}>5번 다발</span>
            <div className="flex justify-center items-center">
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>25A</span>
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a25_05} onBlur={(e) => handleInputChange(e, "a25_05")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>32A</span>
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a32_05} onBlur={(e) => handleInputChange(e, "a32_05")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>40A</span>
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a40_05} onBlur={(e) => handleInputChange(e, "a40_05")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>50A</span>
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a50_05} onBlur={(e) => handleInputChange(e, "a50_05")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>65A</span>
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a65_05} onBlur={(e) => handleInputChange(e, "a65_05")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <br/>
            <span className={"font-bold text-orange-600"}>6번 다발</span>
            <div className="flex justify-center items-center">
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>25A</span>
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a25_06} onBlur={(e) => handleInputChange(e, "a25_06")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>32A</span>
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a32_06} onBlur={(e) => handleInputChange(e, "a32_06")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>40A</span>
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a40_06} onBlur={(e) => handleInputChange(e, "a40_06")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>50A</span>
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a50_06} onBlur={(e) => handleInputChange(e, "a50_06")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ height: "35px", fontSize: "25px", fontWeight: "bold" }}>65A</span>
                <input min="0" type="number" style={{ width: "70px", fontWeight: "bold" }} defaultValue={data.a65_06} onBlur={(e) => handleInputChange(e, "a65_06")} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <br/>
            <button
                className="bg-blue-600 text-white py-2 px-4 mr-2 rounded-lg font-bold"
                onClick={onCheck}
            >
                최종 확인
            </button>
            <button
                className="bg-red-600 text-white py-2 px-4 rounded-lg font-bold"
                onClick={() => router.back()}
            >
                뒤로가기
            </button>
        </div>
    )
}

CountCheck.getInitialProps = ({ query }) => {
    return { id: query.id, a25: query.a25, a32: query.a32, a40: query.a40, a50: query.a50, a65: query.a65 };
};
export default CountCheck
