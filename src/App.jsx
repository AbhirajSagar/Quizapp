import { useState, useEffect } from 'react'
import { Routes, Route } from "react-router-dom"
import { supabase } from "./supabaseClient"
import { faMoon, faLightbulb } from "@fortawesome/free-solid-svg-icons"
import AnimatedButton from './components/AnimatedButton'

//Pages
import Home from "./pages/Home"
import About from "./pages/About"
import NotFound from "./pages/NotFound"
import Editor from "./pages/Editor"
import Player from "./pages/Player"
import Auth from "./pages/Auth"
import Loading from "./pages/Loading"
import Review from "./pages/Review"
import Share from "./pages/Share"
import AIQuiz  from './pages/AIQuiz'
import Search from './pages/Search'
import Liked from './pages/Liked'
import MyQuizzes from './pages/MyQuizzes'
import Landing from './pages/Landing'

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
                <Route path="/" element={<Landing />} />
                <Route path="/home" element={<Home />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/about" element={<About />} />
                <Route path="/player" element={<Player />} />
                <Route path="/review" element={<Review />} />
                <Route path="/share" element={<Share />} />
                <Route path="/search" element={<Search />} />
                <Route path="/ai-quiz" element={<AIQuiz />} />
                <Route path="/liked" element={<Liked />} />
                <Route path="/myquizzes" element={<MyQuizzes />} />

                <Route path="*" element={<NotFound />} />
            </Routes>
            <AnimatedButton onClick={() => toggleDarkMode(!darkMode)} icon={darkMode ? faLightbulb : faMoon} className='fixed bottom-0 rounded-full right-0 m-8'/>
        </div>
    )
}
