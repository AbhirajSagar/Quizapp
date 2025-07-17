import { useEffect, useState } from 'react';
import { faCheckCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import '../index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { supabase } from '../supabaseClient';
import { useAuth } from '../authContext';

import QuizSettingsWindow from '../components/QuizEditor/QuizSettingsWindow';
import { Question, Actions } from '../components/QuizEditor/Question';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Editor() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    //Quiz Data
    const [questions, setQuestions] = useState([]);
    const [quizName, setQuizName] = useState('');
    const [quizTime, setQuizTime] = useState(-1); //Quiz Time In Seconds
    const [thumbnail, setQuizThumbnail] = useState(null);

    //Miscellanous
    const [isQuizPrivate, setIsQuizPrivate] = useState(false);
    const [canBeMarked, setCanBeMarked] = useState(true);

    //UI State
    const [isQuizSettingsOpen, setIsQuizSettingsOpen] = useState(false);
    const [showPublishButton, setShowPublishButton] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setUploadError] = useState(null);

    useEffect(() => 
    {
        const quizData = location.state?.quiz;
        console.log(location.state);
        if (!quizData) return;

        console.log('Loading up the quiz to edit');

        setQuestions(quizData.questions || []);
        setQuizName(quizData.name || '');
        setQuizTime(quizData.quizTime || -1);
        setQuizThumbnail(quizData.thumbnail || null);
        setIsQuizPrivate(quizData.isQuizPrivate ?? false);
        setCanBeMarked(quizData.canBeMarked ?? true);
        
    }, [location]);



    async function publishQuiz() {
        setIsUploading(true);
        const thumbnailUrl = await getThumbnailUrl();
        const quiz = getQuizObj();
        const file = new Blob([JSON.stringify(quiz)], { type: 'application/json' });

        const userName = user?.user_metadata?.name?.trim() || 'unknown';
        const filePath = `quizzes/${quizName.trim() || 'untitled'}-${Date.now()}-${userName}.json`;

        const { data, error } = await supabase.storage.from('quiz').upload(filePath, file, { cacheControl: '3600', upsert: false });
        if (error) {
            setUploadError(error);
            return console.error('Upload error:', error);
        }

        const { data: quizData, error: quizError } = await supabase
            .from('quizzes')
            .insert([
                {
                    user_id: user.id,
                    title: quizName,
                    likes: 0,
                    private: isQuizPrivate,
                    filePath: filePath,
                    thumbnailPath: thumbnailUrl,
                    questions: quiz.questions.length
                }
            ]).select();

        if (quizError) {
            setUploadError(quizError)
            return console.error('DB insert error:', quizError);
        }

        setIsUploading(false);
        setIsQuizSettingsOpen(false);
        const key = quizData[0].id;
        sessionStorage.setItem(key, JSON.stringify(quizData));
        navigate(`/share?key=${key}`);
    }

    async function saveQuiz() {
        setShowPublishButton(true);
        setIsQuizSettingsOpen(true);
    }

    async function getThumbnailUrl() {
        if (!thumbnail) return console.log('No thumbnail uploaded');

        try {
            const userName = user?.user_metadata?.name?.trim() || 'unknown';
            const thumbnailPath = `quiz/${quizName.trim() || 'untitled'}-${Date.now()}-${userName}.jpg`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('thumbnails')
                .upload(thumbnailPath, thumbnail,
                    {
                        cacheControl: '3600',
                        upsert: false
                    });

            if (uploadError) {
                console.error('Thumbnail upload error:', uploadError);
                return null;
            }

            const { data: publicUrlData } = supabase.storage.from('thumbnails').getPublicUrl(thumbnailPath);

            if (publicUrlData)
                return publicUrlData.publicUrl;
        }
        catch (error) {
            console.error('Error handling thumbnail:', error);
        }
    }

    function addQuestion(question) {
        const questionToAdd =
        {
            id: Date.now() + Math.random().toString(36).slice(2, 9),
            question: question,
            options: [],
            answer: 0,
            marks: 1,
            type: 'mcq'
        };

        setQuestions(prev => [...prev, questionToAdd]);
    }

    function setQuestion(index, question) {
        setQuestions(prevQuestions => prevQuestions.map((q, i) => i === index ? question : q));
    }

    function deleteQuestion(index) {
        setQuestions(questions.filter((question, i) => i !== index));
    }

    function setQuestionMark(index, mark) {
        if (!canBeMarked) return;
        setQuestions(prevQuestions => prevQuestions.map((q, i) => i === index ? { ...q, marks: mark } : q));
    }

    function setQuestionType(index, type) {
        setQuestions(prevQuestions => prevQuestions.map((q, i) => i === index ? { ...q, type } : q));
    }

    function setQuestionOptions(index, options) {
        setQuestions(prevQuestions => prevQuestions.map((q, i) => i === index ? { ...q, options } : q));
    }

    function downloadQuiz() {
        const quizData = getQuizObj();
        const blob = new Blob([JSON.stringify(quizData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${quizName || 'quiz'}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function getQuizObj() {
        const quiz =
        {
            name: quizName,
            time: quizTime,
            questions: questions.map(q => ({
                id: q.id,
                question: q.question,
                options: q.options,
                answer: q.answer,
                marks: q.marks,
                type: q.type
            }))
        };

        return quiz;
    }

    return (
        <div className='bg-light-primary dark:bg-dark-primary w-full h-full min-h-[100vh] p-3 md:p-10 overflow-x-hidden relative'>
            <Header downloadQuiz={downloadQuiz} addQuestion={addQuestion} setIsQuizSettingsOpen={setIsQuizSettingsOpen} />
            <Name setQuizName={setQuizName} />
            <div className='mt-12'>
                {
                    questions.map((question, i) =>
                        <Question
                            questions={questions}
                            setQuestionType={setQuestionType}
                            setQuestionMark={setQuestionMark}
                            setQuestion={setQuestion}
                            setQuestionOptions={setQuestionOptions}

                            deleteQuestion={deleteQuestion}
                            index={i}
                            key={question.id}
                        />)
                }
            </div>
            <div className='my-15 p-2 flex justify-center'>
                {
                    questions.length > 0 &&
                    <button onClick={() => saveQuiz()} className='bg-accent-one m-1 p-2 rounded px-4 text-white hover:bg-accent-two cursor-pointer'>
                            <FontAwesomeIcon icon={faCheckCircle} className='mr-2' />
                        Save Quiz
                    </button>
                }
                <button onClick={() => addQuestion('')} className='bg-accent-one m-1 p-2 rounded px-4 text-white hover:bg-accent-two cursor-pointer'>
                    <FontAwesomeIcon icon={faPlusCircle} className='mr-2' />
                    Add Question
                </button>
            </div>
            <QuizSettingsWindow canBeMarked={canBeMarked} setCanBeMarked={setCanBeMarked} error={error} isUploading={isUploading} publishQuiz={publishQuiz} isQuizSettingsOpen={isQuizSettingsOpen} setQuizTime={setQuizTime} setQuizThumnail={setQuizThumbnail} setIsQuizPrivate={setIsQuizPrivate} setIsQuizSettingsOpen={setIsQuizSettingsOpen} showPublishButton={showPublishButton} />
        </div>
    );
}

function Name({ setQuizName }) {
    return (
        <input name='quizName' type='text' className='w-full h-20 px-4 text-3xl text-center sm:text-left font-extrabold text-accent-one dark:text-light-primary rounded mt-12 focus-visible:outline-none' placeholder='Untitled Quiz' onChange={(e) => setQuizName(e.target.value)} />
    );
}

function Header({ downloadQuiz, addQuestion, setIsQuizSettingsOpen }) {
    return (
        <div className='flex items-center px-2 md:px-10 py-2 justify-center fixed h-12 top-0 left-0 right-0 backdrop-blur-2xl dark:border-b-dark-tertiary border-b-accent-one border-b-2'>
            <h2 className='text-accent-one dark:text-light-primary text-sm md:text-lg ml-2 font-extrabold text-nowrap'>Create Your Quiz</h2>
            <Actions downloadQuiz={downloadQuiz} setIsQuizSettingsOpen={setIsQuizSettingsOpen} addQuestion={() => addQuestion('')} />
        </div>
    );
}
