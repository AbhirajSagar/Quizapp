import { useState, useEffect } from 'react'
import { Routes, Route } from "react-router-dom"
import { supabase } from "./supabaseClient"
import Home from "./pages/Home"
import About from "./pages/About"
import NotFound from "./pages/NotFound"
import Editor from "./pages/Editor"
import Player from "./pages/Player"
import Auth from "./pages/Auth"
import Loading from "./pages/Loading"
import Review from "./pages/Review"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMoon, faLightbulb } from "@fortawesome/free-solid-svg-icons"

export default function App()
{
    const [isLoading, setIsLoading] = useState(true)
    const [darkMode, setDarkMode] = useState(() =>
    {   
        const saved = localStorage.getItem('mode')
        if (saved !== null) return saved === 'true'
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    })

    const [session, setSession] = useState(null)

    useEffect(()=>
    {
        supabase.auth.getSession().then(({ data: { session } })=>
        {
            setSession(session)
            setIsLoading(false)
        })

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session)=>
        {
            setSession(session)
            setIsLoading(false)
        })

        return () =>
        {
            if (listener?.subscription) 
                listener.subscription.unsubscribe()
        }
    }, [])

    useEffect(()=>
    {
        if (darkMode)
            document.documentElement.classList.add('dark')
        else
            document.documentElement.classList.remove('dark')
    }, [darkMode])

    function toggleDarkMode(mode)
    {
        setDarkMode(mode)
        localStorage.setItem('mode', mode)
    }

    if (isLoading)
    {
        return <Loading />
    }

    if (!session)
    {
        return <Auth />
    }

    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/about" element={<About />} />
                <Route path="/player" element={<Player />} />
                <Route path="/review" element={<Review />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <div
                onClick={() => toggleDarkMode(!darkMode)}
                className="z-[100] w-10 h-10 bg-accent-one dark:bg-dark-secondary flex justify-center items-center fixed bottom-0 right-0 m-8 rounded-full p-2 dark:hover:bg-dark-tertiary hover:bg-accent-two hover:scale-125 transition-transform duration-100"
            >
                <FontAwesomeIcon
                    icon={darkMode ? faLightbulb : faMoon}
                    className="text-2xl text-white cursor-pointer"
                />
            </div>
        </div>
    )
}
