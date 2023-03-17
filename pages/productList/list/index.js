import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {supabase} from "../../../utils/supabaseClient";
import TableComponent from "../../../components/productList/ProductListTable";
import ProductListTable from "../../../components/productList/ProductListTable";

const List = (props) => {
    const { date } = props;
    const router = useRouter()
    const [data, setData] = useState([]);
    const workTypes = ["용접/무용접", "전실/입상", "나사"];

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase.from("product_list").select();
            if (error) {
                console.error("Error fetching data:", error);
            } else {
                setData(data);
            }
        };
        fetchData();


    }, []);

    return (
        <div>
            {workTypes.map((type) => (
                <ProductListTable
                    key={type}
                    type={type}
                    data={data.filter((item) => item.work_type === type)}
                />
            ))}
        </div>
    );
};


List.getInitialProps = ({ query }) => {
    return { date: query.date }
};

export default List