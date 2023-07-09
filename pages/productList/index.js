import "react-datepicker/dist/react-datepicker.css";
import {useRouter} from "next/router";
import Link from "next/link";
import formatDate from "../../utils/formatDate";

const ProductList = () => {

    const router = useRouter();

    function getThisWeeksTuesday() {
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 (일요일) ~ 6 (토요일)
        const daysToTuesday = (2 - dayOfWeek + 7) % 7; // 화요일까지 남은 날짜 계산
        now.setDate(now.getDate() + daysToTuesday);

        return formatDate(now)
    }

    const handleDateChange = (date) => {
        const thisWeeksTuesday = getThisWeeksTuesday();

        router.push({
            pathname: '/productList/list',
            query: { date: thisWeeksTuesday },
        });
    }

    return(
        <>
            <div className="min-h-screen flex justify-center mt-32">
                <div>
                    <button className="btn btn-active btn-warning w-full text-white h-16" onClick={() => handleDateChange()}> 생산계획표
                        {/*{startDate ? startDate.toLocaleDateString('ko-KR', {year: 'numeric',month: 'long',day: 'numeric'}) : '검사날짜 선택'}*/}
                    </button>

                </div>
                <Link href='/productList/statistics'>
                    <button className={"btn btn-active btn-primary w-full h-16 ml-4 text-white"}>생산통계</button>
                </Link>
            </div>
        </>
    )
}

export default ProductList