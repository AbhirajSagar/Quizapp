import { faBatteryEmpty, faCircleCheck, faClose, faForwardStep, faHome, faSpinner, faStairs, faStar, faTrophy, faWarning } from '@fortawesome/free-solid-svg-icons';
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStopwatch, faUpload } from '@fortawesome/free-solid-svg-icons';
import AnimatedButton from '../components/AnimatedButton';
import QuizBackground from '../assets/quizbg.png';
import '../index.css';
import { supabase } from '../supabaseClient';
import Loading from './Loading';
import { useAuth } from '../authContext';

import { useNavigate, useLocation } from "react-router-dom";

export default function Player() 
{
    const [questions, setQuestions] = useState([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [quizName, setQuizName] = useState('');
    const [quizData, setQuizData] = useState(null);
    const [quizTime, setQuizTime] = useState(-1);
    const [quizId, setQuizId] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    //Quiz Input 
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [marks, setMarks] = useState(0);

    //Uploading Quiz File
    const fileInputRef = useRef(null);
    const [isHoveringUpload, setIsHoveringUpload] = useState(false);

    const location = useLocation();

    useEffect(() => 
    {
        const query = new URLSearchParams(location.search);
        const file = query.get("file");
        const id = query.get("id");
        if(id) setQuizId(id);

        if (!file) {
            setIsLoading(false);
            return;
        }

        const fetchQuiz = async () => {
            const { data, error } = await supabase.storage.from('quiz').download(file);

            if (error) return console.error(error);
            const text = await data.text();
            const quiz = JSON.parse(text);

            setQuizData(quiz);
            setQuizName(quiz.name || 'Untitled Quiz');
            setQuestions(quiz.questions || []);
            setQuizTime(quiz.time || -1);
            setIsLoading(false);
        }

        fetchQuiz();
    }, [])

    async function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target.result;
            try {
                const data = JSON.parse(text);
                setQuizData(data);
                setQuizName(data.name || 'Untitled Quiz');
                setQuestions(data.questions || []);
                setQuizTime(data.time || -1);
            }
            catch (error) {
                console.error('Error parsing JSON:', error);
            }
        };
        reader.readAsText(file);
    }

    function handleDragFile(event) 
    {
        event.preventDefault();
        event.stopPropagation();
        if (event.type === 'dragenter')
            setIsHoveringUpload(true);
        else if (event.type === 'dragleave')
            setIsHoveringUpload(false);
        else if (event.type === 'drop') {
            setIsHoveringUpload(false);
            const file = event.dataTransfer.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const text = e.target.result;
                    try {
                        const data = JSON.parse(text);
                        setQuizData(data);
                        setQuizName(data.name || 'Untitled Quiz');
                        setQuestions(data.questions || []);
                    }
                    catch (error) {
                        console.error('Error parsing JSON:', error);
                    }
                };

                reader.readAsText(file);
            }
        }
    }

    function QuizTimer() 
    {
        const [timeLeft, setTimeLeft] = useState(quizTime);

        useEffect(() => {
            if (timeLeft <= 0) {
                OnQuizTimeUp();
                return;
            }

            const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
            return () => clearInterval(timer);

        }, [timeLeft]);

        const formatTime = (seconds) => {
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        };

        return <span>{formatTime(timeLeft)}</span>;
    }

    function OnQuizTimeUp() {
        if (questionIndex < questions.length) {
            setQuestionIndex(questionIndex + 1);
            setSelectedOption(null);

            if (questionIndex == questions.length - 1)
                setQuizTime(-1);
        }
    }

    function QuizStat({ children, icon }) {
        return <div className='flex w-30 justify-center items-center bg-accent-one dark:bg-dark-secondary p-2 rounded'>
            <FontAwesomeIcon icon={icon} className='text-2xl text-white' />
            <h1 className='text-2xl font-bold text-center text-white ml-2'>{children}</h1>
        </div>;
    }

    if (!quizData)
        return <UploadQuiz isLoading={isLoading} fileInputRef={fileInputRef} handleDragFile={handleDragFile} handleFileUpload={handleFileUpload} isHoveringUpload={isHoveringUpload} setIsHoveringUpload={setIsHoveringUpload} />

    return (
        <div className='bg-light-primary dark:bg-dark-primary w-full h-full min-h-[100vh] p-3 md:p-10 overflow-x-hidden relative'>
            <div className='w-full justify-between flex-col md:flex-row gap-1 items-center flex p-3'>
                <h2 className={`text-lg md:text-2xl text-accent-one dark:text-white font-extrabold ${quizTime == -1 ? 'flex-grow text-left' : ''}`}>{quizName}</h2>
                <div className={`w-fit flex gap-1 md:justify-end justify-center items-center`}>
                    <QuizStat icon={faStar}>{marks}</QuizStat>
                    {quizTime != -1 && <QuizStat icon={faStopwatch}><QuizTimer /></QuizStat>}
                </div>
            </div>
            <Question quizId={quizId} marks={marks} setMarks={setMarks} questionIndex={questionIndex} questions={questions} setQuizTime={setQuizTime} setQuestionIndex={setQuestionIndex} setSelectedOption={setSelectedOption} setIsCorrect={setIsCorrect} selectedOption={selectedOption} />
        </div> 
    );
}

function Question({ marks, quizId, setMarks, questionIndex, questions, setQuestionIndex, setQuizTime, setSelectedOption, setIsCorrect, selectedOption }) {
    const navigate = useNavigate();
    const goToHome = () => navigate("/");
    const goToReview = () => navigate(`/review?id=${quizId}`);

    function handleOptionSelection(optionIndex) 
    {
        setSelectedOption(optionIndex);

        const correctIndex = questions[questionIndex]?.answer;
        
        setIsCorrect(optionIndex === correctIndex);
    
        if (optionIndex === correctIndex)
            setMarks(marks => parseInt(marks) + parseInt(questions[questionIndex].marks))
    }

    if (questions.length === 0)
        return (
            <div className='mt-12 flex flex-col items-center justify-center'>
                <FontAwesomeIcon icon={faBatteryEmpty} className='text-6xl dark:text-light-primary text-cyan-500 mb-4' />
                <h1 className='text-center text-lg font-bold dark:text-light-primary text-cyan-500'>Quiz Completed</h1>
                <p className='text-center dark:text-light-primary text-sm text-cyan-500'>You have completed the quiz</p>
            </div>
        );

    if (questionIndex >= questions.length) {
        return (
            <EndPage goToHome={goToHome} goToReview={goToReview} marks={marks} quizId={quizId}/>
        );
    }

    return (
        <div className='mt-12'>
            <div className='space-y-2'>
                <div className='p-4 bg-light-secondary dark:bg-dark-secondary rounded-lg shadow-md'>
                    <h3 className='text-lg font-semibold text-gray-500 dark:text-light-primary mb-2'>{questions[questionIndex]?.question}</h3>
                    <div className='flex flex-col gap-1'>
                        {questions[questionIndex]?.options?.map((option, index) => {
                            const correctIndex = questions[questionIndex]?.answer;
                            let bgClass = 'bg-light-tertiary dark:bg-dark-tertiary';

                            if (selectedOption !== null) {
                                if (index === correctIndex)
                                    bgClass = 'bg-green-300 dark:bg-green-600';
                                else if (index === selectedOption)
                                    bgClass = 'bg-red-300 dark:bg-red-600';
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleOptionSelection(index)}
                                    disabled={selectedOption !== null}
                                    className={`cursor-pointer transition-colors duration-150 text-left p-2 px-4 text-gray-700 dark:text-white rounded-md ${bgClass}`}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className='flex justify-center mt-4 gap-1'>
                <AnimatedButton text='Exit' icon={faClose} onClick={() => goToHome()} hideTextOnSmallScreens={false} />
                <AnimatedButton
                    text='Next'
                    icon={faForwardStep}
                    onClick={() => {
                        if (questionIndex == questions.length - 1)
                            setQuizTime(-1);

                        setQuestionIndex(questionIndex + 1);
                        setSelectedOption(null);
                        setIsCorrect(null);
                    }}
                    hideTextOnSmallScreens={false}
                />
            </div>
        </div>
    );
}

function EndPage({ goToHome, goToReview, marks, quizId }) 
{
    const [isUpdatingScore, setIsUpdatingScore] = useState(true);
    const [error, setError] = useState(null)
    const { user } = useAuth();

    useEffect(() => 
    {
        async function updateQuizAttempt() 
        {

            const data = 
            {
                user_id: user?.id,
                quiz_id: quizId,
                score: marks,
                time_taken_sec: -1
            }

            const { error } = await supabase.from('attempts').insert([data]);

            if (error) 
            {
                console.error(error);
                setError(error.message);
                return;
            }

            setIsUpdatingScore(false);
        }

        updateQuizAttempt();
    }, []);


    return (
        <div className='mt-[10%] flex flex-col items-center justify-center'>
            {isUpdatingScore ?
                <Loading />
                :
                (
                    error 
                    ?
                    <FontAwesomeIcon icon={faWarning} className='text-6xl dark:text-light-primary text-cyan-500 mb-4' />
                    :
                    <FontAwesomeIcon icon={faCircleCheck} className='text-6xl dark:text-light-primary text-cyan-500 mb-4' />
                )
            }
            <h1 className='text-center text-lg font-bold dark:text-light-primary text-cyan-500'>Quiz Completed</h1>
            {
                isUpdatingScore ?
                (
                    error ?
                    <p className='text-center dark:text-light-primary text-sm text-cyan-500 mb-6'>{error.message}</p>
                    :
                    <p className='text-center dark:text-light-primary text-sm text-cyan-500 mb-6'>Preparing score review...</p>
                )    
                    :
                    <p className='text-center dark:text-light-primary text-sm text-cyan-500 mb-6'>You have completed the quiz</p>
            }
            <AnimatedButton text='Back to Home' width='w-42' hideTextOnSmallScreens={false} icon={faHome} onClick={() => goToHome()} />
            <AnimatedButton text='Review Score' width='w-42' hideTextOnSmallScreens={false} icon={isUpdatingScore ? faSpinner : faTrophy} onClick={() => goToReview()} spinIcon={isUpdatingScore} disabled={isUpdatingScore} />
        </div>
    );
}

function UploadQuiz({ isLoading, fileInputRef, handleDragFile, handleFileUpload, isHoveringUpload, setIsHoveringUpload }) {
    return (
        <div className='bg-light-primary dark:bg-dark-primary w-full h-full min-h-[100vh] p-3 md:p-10 overflow-x-hidden relative flex flex-col justify-center items-center'>
            <div className='absolute top-0 left-0 w-full h-full bg-light-primary dark:bg-dark-primary opacity-50 z-10 flex justify-center items-center'>
                <img src={QuizBackground} alt="Quiz Background" className=' w-full h-full object-cover opacity-50' />
            </div>
            {
                isLoading
                    ?
                    <div className='z-10 flex flex-col items-center hover:bg-light-tertiary dark:bg-dark-secondary bg-white dark:hover:bg-dark-tertiary justify-center w-140 h-80 mt-6 rounded-lg max-w-[98%] p-2 cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out'>
                        <Loading />
                        <p className='text-center dark:text-light-primary text-sm text-accent-one mb-4'>Just a sec..</p>
                    </div>
                    :
                    <div
                        onDragEnter={handleDragFile}
                        onDragOver={(e) => e.preventDefault()}
                        onDragLeave={handleDragFile}
                        onDrop={handleDragFile}
                        onMouseEnter={() => setIsHoveringUpload(true)}
                        onMouseLeave={() => setIsHoveringUpload(false)}
                        onClick={() => fileInputRef && fileInputRef.current.click()}
                        className='z-10 flex flex-col items-center hover:bg-light-tertiary dark:bg-dark-secondary bg-white dark:hover:bg-dark-tertiary justify-center w-140 h-80 mt-6 rounded-lg max-w-[98%] p-2 cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out'
                    >
                        <FontAwesomeIcon icon={faUpload} className='text-6xl dark:text-light-primary text-cyan-500' bounce={isHoveringUpload} />
                        <h1 className='text-center text-lg font-bold dark:text-light-primary mt-6 text-cyan-500'>Upload Quiz</h1>
                        <p className='text-center dark:text-light-primary text-sm text-cyan-500'>Drop your quiz file here, or tap to browse</p>
                        <input ref={fileInputRef} onChange={handleFileUpload} type="file" accept=".json" className='hidden' />
                    </div>
            }
        </div>
    );
}
