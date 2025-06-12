import { useEffect, useState} from "react";
import { supabase } from "../supabaseClient";


export default function AIQuiz()
{
    const [topic,setTopic] = useState(null);
    const [questionsCount,setQuestionsCount] = useState(1);
    const [level,setLevel] = useState('beginner');

    const [data,setData] = useState(null);
    // useEffect(() => 
    // {
    //     async function generateQuiz()
    //     {
    //         const { data, error } = await supabase.functions.invoke('generate-quiz', {body: { topic: 'What is reflection in programming?', count: 2, level: 'beginner' },})
    //         if(error) return console.error(error);

    //         const parts = data.quiz?.split("```");
    //         if (parts.length >= 3)
    //         {
    //             const extracted = parts[1];
    //             setData(extracted);
    //         }
    //     }

    //     generateQuiz();
    // },[])

    
    return (
        <div>
            <h1>{data}</h1>
        </div>
    );
}