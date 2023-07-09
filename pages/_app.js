import '../styles/globals.css'
import {useEffect, useState} from "react";
import {supabase} from "../utils/supabaseClient";
import Auth from "../components/Auth";
import Navbar from "../components/Navbar";
import Head from "next/head";
import UpdateModal from "../components/UpdateModal";
import buildTime from "./api/buildTime";

export async function getServerSideProps() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/buildTime`);
  const data = await res.json();

  return {
    props: {
      buildTime: data.buildTime,
    },
  };
}

function MyApp({ Component, pageProps }) {

  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    const storedBuildTime = localStorage.getItem("buildTime");

    if (storedBuildTime && storedBuildTime !== buildTime) {
      setShowUpdateModal(true);
    } else {
      localStorage.setItem("buildTime", buildTime);
    }
  }, [buildTime]);

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
              <UpdateModal
                  show={showUpdateModal}
                  onClose={() => setShowUpdateModal(false)}
              />
              <Component {...pageProps} key={session.user.id} session={session} />
            </div>
        )}
      </>
  )
}

export default MyApp
