import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

export default function AIQuiz() 
{
    const [isGenerating, setIsGenerating] = useState(false);
    const navigate = useNavigate();

    const [topic, setTopic] = useState(null);
    const [questionsCount, setQuestionsCount] = useState('1');
    const [level, setLevel] = useState('beginner');
    const [data, setData] = useState(null);
    const placeholders = [
        "Enter a topic...",
        "e.g. World War 2",
        "Try 'Fundamentals of C'",
        "e.g. Photosynthesis process",
        "Topic you're struggling with?",
        "Need help with DBMS?",
        "AI will generate quiz on any topic",
        "What's your exam about?",
        "Revise 'Operating Systems'",
        "e.g. Chemical Bonding",
        "Try 'Basic Algebra'",
        "e.g. Cybersecurity Basics",
        "Need quiz on 'Linux Commands'?",
        "Try something like 'Ancient India'",
        "Feeling unprepared? Type your topic!",
        "e.g. English Tenses",
        "Need practice for GATE/NET?",
        "Test your knowledge on Java!",
        "Try 'SQL Joins'",
        "e.g. Structure of Atom"
    ];

    const placeholderInterval = useRef(null);
    const [placeholderIdx, setPlaceholderIdx] = useState(0);

    useEffect(() => 
    {
        placeholderInterval.current = setInterval(() => setPlaceholderIdx((prev) => (prev + 1) % placeholders.length), 3000);
        return () => clearInterval(placeholderInterval.current);
    }, [placeholders.length]);

    async function generateQuiz() 
    {
        setIsGenerating(true);
        const { data, error } = await supabase.functions.invoke('generate-quiz', { body: { topic: topic, count: questionsCount, level: level }, })
        if (error) return console.error(error);
        setData(data);
        console.log(data);
        const jsonMatch = data.quiz?.match(/{[\s\S]*}/);
        if (jsonMatch)
        {
            const extracted = JSON.parse(jsonMatch[0]);
            setData(extracted);
            setIsGenerating(false);
            console.log(extracted);
            navigate('/editor', { state: { quiz: extracted } });
        }
        else
        {
            console.log('quiz can’t be extracted');
            console.log(data);
        }
    }

    return (
        <div className='dark:bg-dark-primary bg-light-tertiary min-h-[100vh] flex justify-center items-center flex-col'>
            {   
                isGenerating ? 
                <GeneratingQuiz/> :
                <GenerateQuiz setTopic={setTopic}  placeholders={placeholders} placeholderIdx={placeholderIdx} generateQuiz={generateQuiz}  faPaperPlane={faPaperPlane} setLevel={setLevel} level={level} setQuestionsCount={setQuestionsCount} questionsCount={questionsCount}/>
            }
        </div>
    );
}

function GeneratingQuiz()
{
    return (
        <div>
            <h2 className="text-white font-semibold text-2xl">Generating Your Quiz</h2>
            <p className="text-white text-center">Please stand by</p>
        </div>
    );
}

function GenerateQuiz({setTopic, placeholders, placeholderIdx, generateQuiz, faPaperPlane, setLevel, level, setQuestionsCount, questionsCount}) 
{
    const [reviewBeforePublish, setReviewBeforePublish] = useState(true);

    return (
    <>
        <DotLottieReact src='https://lottie.host/aba7fcb0-aea6-4e42-a29c-0b010ad38042/VSoLmVXFtU.lottie' autoplay loop className="max-w-3xl"/>
        <h2 className="font-extrabold text-3xl text-center mb-1 text-dark-secondary dark:text-white">Quizy</h2>
        <p className="text-md text-center mb-6 text-dark-secondary dark:text-white">Generate custom quizzes instantly using AI</p>

        <div className="w-full flex justify-center px-4 mb-16">
            <div className="w-full max-w-3xl flex flex-col gap-4">
                <div className="flex flex-col items-stretch gap-1">
                    <input type="text" placeholder={placeholders[placeholderIdx]} onChange={e => setTopic(e.target.value)} className="p-4 rounded-t-2xl text-sm outline-none dark:bg-dark-secondary bg-light-primary dark:text-white"/>
                    <button onClick={generateQuiz} className="h-12 px-5 flex items-center justify-center gap-2 font-bold rounded-b-2xl bg-accent-one text-white text-dark-primary hover:bg-accent-one hover:text-white transition">
                        <FontAwesomeIcon icon={faPaperPlane} className="text-lg" />Generate
                        <p className="bg-white/25 px-3 py-1 text-xs rounded-3xl">Daily Left 5/5</p>
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <select value={level} onChange={e => setLevel(e.target.value)} className="w-full px-4 py-1 rounded-2xl outline-none bg-light-primary dark:bg-dark-secondary dark:text-white">
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>

                    <select value={questionsCount} onChange={e => setQuestionsCount(e.target.value)} className="w-full px-4 py-1 rounded-2xl outline-none bg-light-primary dark:bg-dark-secondary dark:text-white">
                        {[1,2,3,4,5,10,20].map(num => (
                            <option key={num} value={num}>{num} Question{num > 1 && 's'}</option>
                        ))}
                    </select>

                    <div className="col-span-full flex items-center justify-between px-4 py-1 rounded-2xl bg-light-primary dark:bg-dark-secondary dark:text-white">
                        <span>Review First</span>
                        <div 
                            onClick={() => setReviewBeforePublish(v => !v)}
                            className={`w-20 h-8 rounded-lg flex items-center justify-center font-semibold cursor-pointer transition ${
                                reviewBeforePublish 
                                    ? 'bg-accent-two text-dark-primary shadow-lg'
                                    : 'bg-dark-primary text-light-primary'
                            }`}
                        >
                            {reviewBeforePublish ? 'Yes' : 'No'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}
