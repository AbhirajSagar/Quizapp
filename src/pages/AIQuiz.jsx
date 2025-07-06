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
            <DotLottieReact src="https://lottie.host/61f558cc-bdf4-438d-845e-bb5adb75083a/KxuVBBxzf7.lottie" className="w-2xl h-2xl" loop autoplay />
            {   
                isGenerating ? 
                <GeneratingQuiz/> :
                <GenerateQuiz 
                    setTopic={setTopic} 
                    placeholders={placeholders}
                    placeholderIdx={placeholderIdx}
                    generateQuiz={generateQuiz} 
                    faPaperPlane={faPaperPlane} 
                    setLevel={setLevel} 
                    level={level} 
                    setQuestionsCount={setQuestionsCount} 
                    questionsCount={questionsCount}/>
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

function GenerateQuiz({ setTopic, placeholders,placeholderIdx,generateQuiz, faPaperPlane, setLevel, level, setQuestionsCount, questionsCount }) 
{
    const [reviewBeforePublish,setReviewBeforePublish] = useState(true);

    return (
    <>
        <h2 className="text-2xl font-extrabold dark:text-white text-dark-secondary">AI Quiz Generation</h2>
        <p className="dark:text-white text-dark-secondary">Create tailored quizzes instantly with the power of AI</p>
        <div className="min-h-60 w-full p-4  flex justify-start items-center flex-col">
            <div className="w-[60%] flex justify-center items-stretch flex-col">
                <div className="flex-grow flex h-16 dark:bg-dark-secondary bg-light-primary dark:text-white rounded-2xl outline-0">
                    <input type="text" placeholder={placeholders[placeholderIdx]} className="px-4 w-full h-full outline-0" onChange={e => setTopic(e.target.value)} />
                    <button onClick={generateQuiz} className="dark:bg-dark-primary text-dark-primary bg-light-tertiary hover:text-white font-extrabold m-1 cursor-pointer hover:bg-accent-one dark:text-white rounded-2xl px-4 flex justify-center items-center">
                        <FontAwesomeIcon icon={faPaperPlane} className="text-lg mr-2" />
                        Generate
                    </button>
                </div>
                <div className="flex  justify-center items-center">
                    <select onChange={e => setLevel(e.target.value)} className="cursor-pointer w-60 p-2 bg-light-primary dark:bg-dark-secondary dark:text-white rounded-2xl outline-0 m-2 mr-0" value={level}>
                        <option value="beginner" className="cursor-pointer dark:bg-dark-secondary dark:text-white">Beginner</option>
                        <option value="intermediate" className="cursor-pointer dark:bg-dark-secondary dark:text-white">Intermediate</option>
                        <option value="advanced" className="cursor-pointer dark:bg-dark-secondary dark:text-white">Advanced</option>
                    </select>
                    <select onChange={e => setQuestionsCount(e.target.value)} className="cursor-pointer w-60 p-2 bg-light-primary dark:bg-dark-secondary dark:text-white rounded-2xl outline-0 m-2 mr-0" value={questionsCount}>
                        <option value="1" className="cursor-pointer dark:bg-dark-secondary dark:text-white">1 Question</option>
                        <option value="2" className="cursor-pointer dark:bg-dark-secondary dark:text-white">2 Questions</option>
                        <option value="3" className="cursor-pointer dark:bg-dark-secondary dark:text-white">3 Questions</option>
                        <option value="4" className="cursor-pointer dark:bg-dark-secondary dark:text-white">4 Questions</option>
                        <option value="5" className="cursor-pointer dark:bg-dark-secondary dark:text-white">5 Questions</option>
                        <option value="10" className="cursor-pointer dark:bg-dark-secondary dark:text-white">10 Questions</option>
                        <option value="20" className="cursor-pointer dark:bg-dark-secondary dark:text-white">20 Questions</option>
                    </select>
                    <div className="cursor-pointer w-60 p-2 bg-light-primary dark:bg-dark-secondary dark:text-white rounded-2xl outline-0 m-2 mr-0 flex justify-between items-center">
                        <p>Review First</p>
                        <div onClick={() => setReviewBeforePublish((v) => !v)} className={`h-7 w-15 rounded-lg flex justify-center items-center ${(reviewBeforePublish ? 'bg-accent-two drop-shadow-accent-two shadow-2xl' : 'bg-dark-primary')}`}>
                            <p className={`text-center font-semibold ${reviewBeforePublish ? 'text-dark-primary' : 'text-light-primary'}`}>{reviewBeforePublish ? 'Yes' : 'No'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
}
