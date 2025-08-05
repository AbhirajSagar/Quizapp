import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Logo from "../components/Logo";
import AnimatedButton from "../components/AnimatedButton";
import { faPaperPlane, faUserAlt, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import {useState, useEffect} from 'react';

export default function LandingPage() {
    return (
        <div className="min-h-[100vh] dark:bg-dark-primary bg-light-primary">
            <LandingNav />
            <HeroSection />
            <Sections />
        </div>
    );
}

function HeroSection() {
    return (
        <div className="flex justify-center w-full h-[90vh] pt-5 items-center">
            <div className="w-full max-w-5xl h-full flex flex-col md:flex-row justify-center items-center">
                <div className="h-full w-full">
                    <DotLottieReact src="https://lottie.host/5e63770f-ee9d-4f6b-b809-aeb1f60ad901/MRHRvN6TVQ.lottie" loop autoplay />
                </div>
                <div className="h-full p-4 flex flex-col justify-start md:justify-center items-center">
                    <h1 className="md:text-7xl text-5xl font-extrabold mb-2 md:mb-5 text-accent-one dark:text-white">Quizin'</h1>
                    <h1 className="md:text-2xl text-md md:text-end text-center font-semibold text-dark-secondary dark:text-light-tertiary bg-gradient-to-r bg-graident-fro">The smarter, simpler, and more fun way to prep for exams!</h1>
                    <div className=" w-full h-max m-4 flex justify-center items-center flex-col">
                        <AnimatedButton text="Get Started" icon={faPaperPlane} hideTextOnSmallScreens={false} className="mt-4 w-3xs bg-green-500 shadow-green-700 hover:bg-green-600 rounded-4xl" />
                        <AnimatedButton text="Already an account" icon={faUserAlt} hideTextOnSmallScreens={false} className="mt-4 w-3xs rounded-4xl" />
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
                <AnimatedButton text="Dashboard" className="-translate-y-2 rounded-4xl" icon={faUserCircle} fullRounded={true} />
            </div>
        </div>
    )
}

function Sections() 
{
    return (
        <>
            <EffectiveLearningQuiz/>
            <LeaderboardAndProgress/>
            <GameifiedQuizzes/>
            <AIQuizGeneration/>
        </>
    );

}

function EffectiveLearningQuiz()
{
    return (
        <div className="flex justify-center w-full h-[90vh] items-center">
            <div className="w-full max-w-5xl h-full flex flex-col md:flex-row justify-center items-center">
                <div className="h-full p-4 flex flex-col justify-start md:justify-center items-center">
                    <h2 className="font-extrabold text-3xl mb-2 text-start w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 text-transparent bg-clip-text">Effective Learning</h2>
                    <p className="text-white text-lg font-normal">
                        Learning through quizzes isn’t just fun — it’s <span className="font-semibold text-orange-400">scientifically proven</span> to work. <br />
                        They use <span className="font-semibold text-orange-400">active recall</span> to boost memory, deepen understanding, and quickly spot weak areas. <br />
                        It’s a <span className="font-semibold text-orange-400">faster, smarter</span> way to learn — and it actually feels fun.
                    </p>
                </div>
                <div className="h-full w-full">
                    <DotLottieReact src="https://lottie.host/945a50fc-0e71-49ca-b467-6b965469de20/f6IPL8MBqq.lottie" loop autoplay />
                </div>
            </div>
        </div>
    );
}

function LeaderboardAndProgress()
{
    return (
        <div className="flex justify-center w-full h-[90vh] items-center">
            <div className="w-full max-w-5xl h-full flex flex-col md:flex-row justify-center items-center">
                <div className="h-full p-4 flex flex-col justify-start md:justify-center items-center">
                    <h2 className="font-extrabold text-3xl mb-2 text-start w-full bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text">Track & Compete</h2>
                    <p className="text-white text-lg font-normal">
                        Stay on top with a <span className="font-semibold text-cyan-400">live leaderboard</span> and see how you rank. <br />
                        Analyze your <span className="font-semibold text-cyan-400">past scores</span>, track progress, and identify where you’re improving or slipping.
                    </p>
                </div>
                <div className="h-full w-full">
                    <DotLottieReact src="https://lottie.host/012eea79-34fb-4ab5-ac9e-6148d99c10c0/D8CeBdvIQU.lottie" loop autoplay />
                </div>
            </div>
        </div>
    );
}

function AIQuizGeneration()
{
    return (
        <div className="flex justify-center w-full h-[90vh] items-center">
            <div className="w-full max-w-5xl h-full flex flex-col md:flex-row justify-center items-center">
                <div className="h-full p-4 flex flex-col justify-start md:justify-center items-center">
                    <h2 className="font-extrabold text-3xl mb-2 text-start w-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-transparent bg-clip-text">AI Quiz Generator</h2>
                    <p className="text-white text-lg font-normal">
                        Get custom quizzes in seconds using <span className="font-semibold text-pink-400">AI-powered generation</span>. <br />
                        Choose topics, difficulty, and let AI build <span className="font-semibold text-pink-400">smart, unique questions</span> for you.
                    </p>
                </div>
                <div className="h-full w-full">
                    <DotLottieReact src="https://lottie.host/e7a557c0-e3f5-43f6-9769-486858d420ef/dO1HdTKsO4.lottie" loop autoplay />
                </div>
            </div>
        </div>
    );
}

function GameifiedQuizzes()
{
    return (
        <div className="flex justify-center w-full h-[90vh] items-center">
            <div className="w-full max-w-5xl h-full flex flex-col md:flex-row justify-center items-center">
                <div className="h-full p-4 flex flex-col justify-start md:justify-center items-center">
                    <h2 className="font-extrabold text-3xl mb-2 text-start w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-transparent bg-clip-text">Play Your Quizzes</h2>
                    <p className="text-white text-lg font-normal">
                        Quizzes don’t have to be boring. Turn them into <span className="font-semibold text-orange-400">interactive games</span> that keep you hooked. <br />
                        Learn through fun — compete, win, and master topics <span className="font-semibold text-orange-400">while playing</span>.
                    </p>
                </div>
                <div className="h-full w-full">
                    <DotLottieReact src="https://lottie.host/198a3e6c-472f-4268-bf82-bb5d7e78cf08/wJ8WdlQnYm.lottie" loop autoplay />
                </div>
            </div>
        </div>
    );
}
