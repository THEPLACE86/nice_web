import '../styles/globals.css'
import {useEffect, useState} from "react";
import {supabase} from "../utils/supabaseClient";
import Auth from "../components/Auth";
import Navbar from "../components/Navbar";

function MyApp({ Component, pageProps }) {

  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    let mounted = true

    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      // only update the react state if the component is still mounted
      if (mounted) {
        if (session) {
          setSession(session)
        }
        setIsLoading(false)
      }
    }

    getInitialSession()

    const { subscription } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session)
        }
    )

    return () => {
      mounted = false

      subscription?.unsubscribe()
    }
  }, [])

  if (isLoading) {
    return (
        <div></div> // 로딩 인디케이터를 여기에 추가하세요.
    )
  }

  return (
      <>
        {!session ? (
            <Auth />
        ) : (
            <div className="w-[1350px] mx-auto relative">
              <Navbar/>
              <Component {...pageProps} key={session.user.id} session={session} />
            </div>
        )}
      </>
  )
}

export default MyApp
