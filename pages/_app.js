import '../styles/globals.css'
import {useEffect, useState} from "react";
import {supabase} from "../utils/supabaseClient";
import Auth from "../components/Auth";
import Navbar from "../components/Navbar";
import Head from "next/head";

function MyApp({ Component, pageProps }) {

  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    let mounted = true

    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (mounted) {
        if (session) {
          setSession(session)
        }
        setIsLoading(false)
      }
    }

    getInitialSession().then()

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
            <div className="w-[1600px] pr-6 pl-6 pb-6 mx-auto">
              <Head>
                <script>
                  <script src="https://kit.fontawesome.com/85da0a7805.js" crossOrigin="anonymous"></script>
                </script>
              </Head>
              <Navbar/>
              <Component {...pageProps} key={session.user.id} session={session} />
            </div>
        )}
      </>
  )
}

export default MyApp
