import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Logo from "../components/Logo";
import { faPaperPlane, faUserAlt, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LandingPage() 
{
    const navigate = useNavigate();
    const navigateToHome = () => navigate('/home');

    return (
        <div className="min-h-[100vh] dark:bg-dark-primary bg-light-primary">
            <HeroSection navigateToHome={navigateToHome}/>
        </div>
    );
}

function HeroSection({navigateToHome}) 
{
    return (
        <div className="flex justify-center w-full h-[100vh] items-center">
            <div className="w-full max-w-5xl h-full flex flex-col md:flex-row justify-center items-center">
                <div className="h-full w-full">
                    <DotLottieReact src="https://lottie.host/5e63770f-ee9d-4f6b-b809-aeb1f60ad901/MRHRvN6TVQ.lottie" loop autoplay />
                </div>
                <div className="h-full p-4 flex flex-col justify-start md:justify-center items-center">
                    <div className="w-xs">
                        <Logo/>
                    </div>
                    <h1 className="md:text-2xl text-md md:text-end text-center font-semibold text-dark-secondary dark:text-light-tertiary bg-gradient-to-r bg-graident-fro">The smarter, simpler, and more fun way to prep for exams!</h1>
                    <div className=" w-full h-max m-4 flex justify-center items-center flex-col">
                        <button onClick={navigateToHome} className="bg-accent-one shadow-blue-600 dark:shadow-dark-tertiary dark:bg-dark-secondary hover:bg-blue-900 transition-colors duration-150 hover:drop-shadow-md px-5 py-3 flex items-center text-white rounded-2xl text-sm font-semibold cursor-pointer shadow-[0px_5px_0px_0px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px] mt-4">
                            <FontAwesomeIcon icon={faPaperPlane} className='text-lg mr-2' />
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LandingNav()
{
    const [scrolled, setScrolled] = useState(false)

    useEffect(()=>
    {
        const onScroll = ()=>
        {
            setScrolled(window.scrollY > 0)
        }

        window.addEventListener("scroll", onScroll)
        return ()=> window.removeEventListener("scroll", onScroll)
    }, [])

    return (
        <div className={`w-full px-3 flex fixed justify-between h-16 py-2 items-center dark:bg-dark-primary bg-light-primary transition-all duration-200 border-b ${scrolled ? "dark:border-dark-secondary border-light-tertiary" : "border-transparent"}`}>
            <div className="h-full m-auto w-full max-w-5xl flex justify-between items-center">
                <Logo />
            </div>
        </div>
    )
}
