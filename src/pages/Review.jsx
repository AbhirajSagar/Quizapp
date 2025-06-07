import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ScoreChart from "../components/ScoreChart";
import LineChart from "../components/LineChart"
import AnimatedButton from "../components/AnimatedButton";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import Loading from "../pages/Loading";
import { useAuth } from "../authContext";
export default function Review() 
{
    const [top10Attempts, setTop10Attempts] = useState(null);
    const [userAttempts, setUserAttempts] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const location = useLocation();
    const { user } = useAuth();

    useEffect(() => 
    {
        async function getUserName(userId) 
        {
            const { data, error } = await supabase.from('profiles').select('name').eq('id', userId);
            if (error || !data || data.length === 0) return 'Unknown';
            
            return data[0].name;
        }

        async function fetchAttemptsData(quizId)
        {
            const { data, error } = await supabase.from('attempts').select('*').eq('quiz_id', quizId).order('score', { ascending: false });
            if (error || !data) return console.error(error);

            const currentUserName = user?.user_metadata?.name;
            const currentUserAttempts = data.filter((attempt) => attempt.user_id == user?.id);

            const currentUserAttemptsDict = {};
            for(const d of currentUserAttempts)
            {
                if (!currentUserAttemptsDict[d.created_at])
                    currentUserAttemptsDict[d.created_at] = d.score;
            }
            
            const userBestAttempt = currentUserAttempts.reduce((prev, current) => (prev.score > current.score) ? prev : current);

            const topTenAttempts = {}
            for(const d of data)
            {
                const userName = await getUserName(d.user_id);
            
                if (!topTenAttempts[userName] || topTenAttempts[userName] < d.score)
                topTenAttempts[userName] = d.score;

                if (Object.keys(topTenAttempts).length >= 10) break;
            }

            const userIsInTopTen = Object.keys(topTenAttempts).some((userName) => userName === currentUserName);
            if(!userIsInTopTen && userBestAttempt) topTenAttempts[currentUserName] = userBestAttempt.score;

            setTop10Attempts(topTenAttempts);
            setUserAttempts(currentUserAttemptsDict);
            setLoadingData(false);
        }

        const query = new URLSearchParams(location.search);
        const id = decodeURIComponent(query.get('id'));
        if (!id) return;

        fetchAttemptsData(id);
    }, [location.search]);

    return (
        <div className='md:px-8 py-18 px-3.5 grid grid-cols-1 md:grid-cols-2 dark:bg-dark-primary min-h-[100vh] h-max bg-light-primary'>
            <Header />
            <Top10Graph loading={loadingData} user={user} attempts={top10Attempts} />
            <PreviousScoreGraph loadingData={loadingData} user={user} currentUserAttempts={userAttempts} />
        </div>
    );
}

function Header()
{
    return (
        <div className='flex items-center px-2 md:px-10 py-2 justify-between fixed h-12 top-0 left-0 right-0 backdrop-blur-2xl dark:border-b-dark-tertiary border-b-accent-one border-b-2 z-50'>
            <h2 className='text-accent-one dark:text-light-primary text-sm md:text-lg ml-2 font-extrabold text-nowrap'>Detailed Score Review</h2>
            <AnimatedButton text="Share" layout='horizontal' icon={faShareAlt} onClick={() => {}}/>
        </div>
    );
}

function Top10Graph({loading,attempts,user})
{
    return(
        <div className="p-[3%] m-2 md:p-[1%] h-fit dark:bg-dark-secondary bg-light-secondary rounded">
            {
                loading 
                ?
                <Loading/>
                :
                <ScoreChart user={user} title='Top Ten' subtitle="Your score amongst top ten best scores" attempts={attempts} />
            }
        </div>
    );
}

function PreviousScoreGraph({loadingData,currentUserAttempts,user})
{
    return (
        <div className="p-[3%] m-2 md:p-[1%] h-fit dark:bg-dark-secondary bg-light-secondary rounded">
            {
                loadingData 
                ?
                <Loading/>
                :
                <LineChart user={user} title='Progress' subtitle="Your progress on the quiz" attempts={currentUserAttempts} />
            }
        </div>
    );
}