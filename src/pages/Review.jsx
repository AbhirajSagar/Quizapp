import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ScoreChart from "../components/ScoreChart";
import AnimatedButton from "../components/AnimatedButton";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";

export default function Review() 
{
    const [attempts, setAttempts] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    
    useEffect(() => 
    {
        async function getUserName(userId)
        {
            const { data, error } = await supabase
                .from('profiles')
                .select('name')
                .eq('id', userId);

            if (error) return 'Unknown';
            else return data[0].name;
        }

        async function getAllAttempts(quizId) 
        {
            const { data, error } = await supabase
                .from('attempts')
                .select('*')
                .eq('quiz_id', quizId)
                .order('score', { ascending: false });

            if (error) return console.error(error);
            else console.log(data);

            let bestAttempts = {};

            for (const d of data) 
            {
                const userName = await getUserName(d.user_id);

                if (!bestAttempts[userName] || bestAttempts[userName] < d.score)
                    bestAttempts[userName] = d.score;
            }

            setAttempts(bestAttempts);
            setLoading(false);
        }

        const query = new URLSearchParams(location.search);
        const id = query.get('id');
        if (!id) return;

        getAllAttempts(id);

    }, [location.search]);


    return (
        <div className='p-4 dark:bg-dark-primary h-[100vh] bg-light-primary'>
            <Header/>
            
            {/* {loading && <ScoreChart attempts={attempts} />} */}
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
