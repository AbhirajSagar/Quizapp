import MenuNavbar from "../components/MenuNavbar";
import { useAuth } from "../authContext";
import { useEffect, useState } from "react";
import { QuizCard, QuizSkeleton } from "../components/QuizCard";
import { supabase } from "../supabaseClient";

export default function MyQuizzes()
{
    const { user } = useAuth();
    const [quizzes, setQuizzes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() =>
    {
        if (!user) return;

        const fetchLikedQuizzes = async () =>
        {
            const { data , error } = await supabase.from("quizzes").select().eq("user_id", user.id);
            if(error)
            {
                console.log(error);
                return;
            }
            
            setQuizzes(data);
            setIsLoading(false);
        };

        fetchLikedQuizzes();
    }, [user]);

    return (
        <div className='dark:bg-dark-primary bg-light-primary min-h-[100vh]'>
            <MenuNavbar />
            <div className='p-20 px-2 sm:px-[60px]'>
                <h2 className="px-2 sm:px-4  font-extrabold text-xl text-dark-primary dark:text-light-secondary">My Quizzes</h2>
                <p className="px-2 sm:px-4   text-sm text-dark-primary dark:text-light-secondary">All the quizzes, you've created</p>
                <div className="w-full bg-primary-secondary grid grid-cols-1 min-[450px]:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1 pt-3 md:p-4">
                    {
                        isLoading
                            ? [...Array(15)].map((_, index) => (
                                <QuizSkeleton key={index} url="fallback.png" setIsCardLoaded={() => { }} />
                            ))
                            : quizzes.map((quiz, index) => (
                                <QuizCard key={index} quiz={quiz} user={user} canBeEdit={true}/>
                            ))
                    }
                </div>
            </div>
        </div>
    );
}
