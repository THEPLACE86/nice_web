import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useEffect, useState } from "react";
import styles from "@/pages/quality/testDateList/testListCountPrintM/TestDateCountPrintM.module.css";
import { Col, Row } from "antd";

function TestListCountPrintM(props) {
    const { date } = props;
    const router = useRouter();
    const supabaseClient = useSupabaseClient();

    const [groupedData, setGroupedData] = useState([]);
    const [mergedNums, setMergedNums] = useState({});

    useEffect(() => {
        const getData = async () => {
            const { data, error } = await supabaseClient
                .from("product")
                .select()
                .eq("test_date", date)
                .order("created_at", { ascending: true });

            const groups = {};
            data.forEach((item, index) => {
                const key = `${item.company}_${item.place}`;
                if (!groups[key]) {
                    groups[key] = {
                        company: item.company,
                        place: item.place,
                        initial: item.initial,
                        num: index + 1,
                        m65: 0,
                        m80: 0,
                        m100: 0,
                        m125: 0,
                        m150: 0,
                    };
                }
                groups[key].m65 += item.m65;
                groups[key].m80 += item.m80;
                groups[key].m100 += item.m100;
                groups[key].m125 += item.m125;
                groups[key].m150 += item.m150;
            });

            const mergedNums = Object.values(groups).reduce((acc, cur) => {
                const key = `${cur.company}_${cur.place}`;
                if (acc[key]) {
                    acc[key].push(cur.num);
                } else {
                    acc[key] = [cur.num];
                }
                return acc;
            }, {});
            setMergedNums(mergedNums);

            const groupedData = Object.values(groups);
            setGroupedData(groupedData);
        };
        getData().then(() => console.log());
    }, []);


    return (
        <>
            <Row gutter={[16, 16]}>
                {groupedData.map((item, index) => {
                    const mergedNum = mergedNums[`${item.company}_${item.place}`]?.join(","); // mergedNums에서 해당 item의 번호를 가져옴
                    return (
                        <Col span={12} key={index}>
                            <table className={`${styles.tg}`}>
                                <colgroup>
                                    <col style={{ width: "133px" }} />
                                    <col style={{ width: "88px" }} />
                                    <col style={{ width: "22px" }} />
                                    <col style={{ width: "166px" }} />
                                </colgroup>
                                <thead>
                                <tr>
                                    <th className={`${styles.tg_xfv3}`}>

                                    </th>
                                    <th className={`${styles.tg_xfv3}`}>{item.initial}</th>
                                    <th className={`${styles.tg_xfv3}`} colSpan="2">
                                        {date}
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className={`${styles.tg_2bvl}`}>업체</td>
                                    <td className={`${styles.tg_dsq6}`} colSpan="3">
                                        {item.company}
                                    </td>
                                </tr>
                                <tr>
                                    <td className={`${styles.tg_2bvl}`}>현장</td>
                                    <td className={`${styles.tg_dsq6}`} colSpan="3">
                                        {item.place}
                                    </td>
                                </tr>
                                <tr>
                                    <td className={`${styles.tg_1i3f}`} colSpan="3">
                                        관경
                                    </td>
                                    <td className={`${styles.tg_1i3f}`}>총수량</td>
                                </tr>
                                <tr>
                                    <td className={`${styles.tg_2bvl}`} colSpan="3">
                                        65A
                                    </td>
                                    <td className={`${styles.tg_dsq6}`}>
                                        {item.m65 !== 0 && item.m65}
                                    </td>
                                </tr>
                                <tr>
                                    <td className={`${styles.tg_2bvl}`} colSpan="3">
                                        80A
                                    </td>
                                    <td className={`${styles.tg_dsq6}`}>
                                        {item.m80 !== 0 && item.m80}
                                    </td>
                                </tr>
                                <tr>
                                    <td className={`${styles.tg_2bvl}`} colSpan="3">
                                        100A
                                    </td>
                                    <td className={`${styles.tg_dsq6}`}>
                                        {item.m100 !== 0 && item.m100}
                                    </td>
                                </tr>
                                <tr>
                                    <td className={`${styles.tg_2bvl}`} colSpan="3">
                                        125A
                                    </td>
                                    <td className={`${styles.tg_dsq6}`}>
                                        {item.m125 !== 0 && item.m125}
                                    </td>
                                </tr>
                                <tr>
                                    <td className={`${styles.tg_2bvl}`} colSpan="3">
                                        150A
                                    </td>
                                    <td className={`${styles.tg_dsq6}`}>
                                        {item.m150 !== 0 && item.m150}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <br />
                            <br />
                            <br />
                            <br />
                        </Col>
                    );
                })}
            </Row>
        </>
    );
}
TestListCountPrintM.getInitialProps = ({ query }) => {
    return { date: query.formattedDate };
};

export default TestListCountPrintM;