import {supabase} from "../utils/supabaseClient";
import Link from "next/link";
import {useRouter} from "next/router";

const Navbar = () => {

    const router = useRouter()

    return(
        <div className={`print:hidden navbar bg-neutral text-neutral-content rounded-xl`}>
            <div className="flex-1">
                <Link href="/">
                    <span
                        className="p-4 text-xl">NICEENTECH</span >
                </Link>
            </div>
            <div className="flex-none mr-6">
                <Link href="/productList">
                    <span
                        className={`${router.pathname.includes ("/productList") ? 'btn btn-warning p-4 rounded text-white' : 'p-4'}`}>생산계획표</span >
                </Link>
            </div>
            <div className="flex-none mr-6">
                <Link href="/shipment">
                    <span
                        className={`${router.pathname.includes ("/shipment") ? 'btn btn-warning p-4 rounded text-white' : 'p-4'}`}>출하일정</span >
                </Link>
            </div>
            <div className="flex-none mr-20">
                <Link href="/quality">
                    <span
                        className={`${router.pathname.includes ("/quality") ? 'btn btn-warning p-4 rounded text-white' : 'p-4'}`}>품질관리부</span>
                </Link>
            </div>
            <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/user.jpeg"  alt="profile"/>
                    </div>
                </label>
                <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                    <li><a className="justify-between" onClick={() => router.push('/profile')}><span className="text-black">내정보</span></a></li>
                    <li><span className="text-black">setting</span></li>
                    <li><span className="text-red-500" onClick={()=> supabase.auth.signOut()}>Logout</span></li>
                </ul>
            </div>
        </div>
    )
}

export default Navbar