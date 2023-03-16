import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleLogin = async (email) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({email: email, password: '111111'})
      if (error) throw error
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="mx-auto">
          <label htmlFor="" className="text-xl">NICEENTECH</label>
          <div className="form-control mt-2">
            <label className="input-group">
              <span>Email</span>
              <input type="text" placeholder="이메일" className="input input-bordered" value={email}
                     onChange={(e) => setEmail(e.target.value)}/>
            </label>
          </div>
          <button className="btn btn-primary w-full mt-4 text-white" onClick={(e) => {
            e.preventDefault()
            handleLogin(email)
          }}>로그인</button>
        </div>
      </div>
  )
}