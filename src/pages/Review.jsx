import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ScoreChart from "../components/ScoreChart";
import AnimatedButton from "../components/AnimatedButton";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import Loading from "../pages/Loading";
import { useAuth } from "../authContext";
export default function Review() 
{
    const [top10Attempts, setTop10Attempts] = useState(null);
    const [userAttempts, setUserAttempts] = useState(null);
    const [loadingTop10, setLoadingTop10] = useState(true);
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
            setUserAttempts(currentUserAttempts);
            console.table(currentUserAttempts);
            
            const userBestAttempt = currentUserAttempts.reduce((prev, current) => (prev.score > current.score) ? prev : current);
            console.table(userBestAttempt);

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
            setLoadingTop10(false);
        }

        const query = new URLSearchParams(location.search);
        const id = query.get('id');
        if (!id) return;

        fetchAttemptsData(id);

    }, [location.search]);

    return (
        <div className='md:px-8 py-18 px-3.5 dark:bg-dark-primary h-[100vh] bg-light-primary'>
            <Header />
            <Top10Graph loading={loadingTop10} user={user} attempts={top10Attempts} />
            <Top10Graph loading={loadingTop10} user={user} attempts={userAttempts} />
        </div>
    );
}

function Header()
{
    return (
        <div className='flex items-center px-2 md:px-10 py-2 justify-between fixed h-12 top-0 left-0 right-0 backdrop-blur-2xl dark:border-b-dark-tertiary border-b-accent-one border-b-2'>
            <h2 className='text-accent-one dark:text-light-primary text-sm md:text-lg ml-2 font-extrabold text-nowrap'>Detailed Score Review</h2>
            <AnimatedButton text="Share" height="h-full" hideTextOnSmallScreens={true} icon={faShareAlt} onClick={() => {}}/>
        </div>
    );
}

function Top10Graph({loading,attempts,user})
{
    return(
        <div className="p-[3%] md:p-[1%] dark:bg-dark-secondary bg-light-secondary rounded">
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