import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        // 사용자가 입력한 이메일 주소가 @niceentech.kr 도메인을 포함하지 않는 경우, @niceentech.kr을 추가
        const normalizedEmail = email.endsWith("@niceentech.kr") ? email : email + "@niceentech.kr";

        const { user, error } = await supabase.auth.signInWithPassword({email: normalizedEmail, password});

        if (error) {
            setMessage(error.message);
        } else {
            const { data, error } = await supabase
                .from("user")
                .select()
                .eq("email", normalizedEmail)
                .single();

            if (error) {
                setMessage(error.message);
            } else {
                const userInfo = {
                    name: data.name,
                    role: data.role
                }
                saveDataToLocalStorage('user', userInfo)
            }
        }

        setLoading(false);
    };

    // 데이터 저장하기
    const saveDataToLocalStorage = (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving data to localStorage.js:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-60 w-full max-w-md mx-auto space-y-4">
            <span className={"font-bold text-2xl"}>NICEENTECH</span>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    이메일
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={(e) => {
                        // 인풋 필드에서 포커스를 잃었을 때, 이메일 주소에 @niceentech.kr 추가
                        if (!email.endsWith("@niceentech.kr")) {
                            setEmail(email + "@niceentech.kr");
                        }
                    }}
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm p-2"
                    required
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    비밀번호
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm p-2"
                    required
                />
            </div>
            {message && <p className="text-red-500">{message}</p>}
            <button
                type="submit"
                className={`w-full btn btn-primary text-white ${loading ? "btn-disabled" : ""}`}
                disabled={loading}
            >
                로그인
            </button>
        </form>
    );
};

export default Auth;
