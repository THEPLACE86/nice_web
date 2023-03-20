import {useState} from "react";
import {supabase} from "../../utils/supabaseClient";
import loadDataFromLocalStorage from "../../utils/localStorage";

const Profile = () => {
    const [email, setEmail] = useState("");
    const userData = loadDataFromLocalStorage('user');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await supabase.auth.signUp({email: email, password: 'jjdwkd9502'});
    };

    return(
        <>
            {userData.role === '관리자' &&
                <div>
                    <form onSubmit={handleSubmit} className="mt-60 w-full max-w-md mx-auto space-y-4">
                        <span className={"font-bold text-2xl"}>NICEENTECH 가입</span>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                이메일
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm p-2"
                                required
                            />
                        </div>
                        <button type="submit" className={`w-full btn btn-primary text-white`}>로그인</button>
                    </form>
                </div>
            }
        </>
    )
}

export default Profile