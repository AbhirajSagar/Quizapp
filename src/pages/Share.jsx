import { useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AnimatedButton from "../components/AnimatedButton";
import { faCat, faCopy, faHouse, faShare, faShareAlt, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { supabase } from "../supabaseClient";

export default function Share()
{
    const location = useLocation();
    const [urlNotWorking, setUrlNotWorking] = useState(false);
    const [quizData,setQuizData] = useState({});

    useEffect(() => 
    {

        async function getAttemptsCount()
        {
            const { data, count, error } = await supabase
            .from('attempts')
            .select('*', { count: 'exact' })
            .eq('quiz_id', quizData[0]?.id)
            
            if(error) return console.error(error);
            if(count === 0) return;
            quizData[0].attempts = count;
        }

        const query = new URLSearchParams(location.search);
        const key = query.get('key');
        const quizData = sessionStorage.getItem(key,null);
        if(!quizData) return setUrlNotWorking(true);

        setQuizData(JSON.parse(quizData));
        getAttemptsCount();

        console.table(quizData);
    },[location.search]);

    if(urlNotWorking)
        return <NotWorking/>

    return (
        <div className="w-full min-h-[100vh] flex justify-center items-center h-max bg-light-primary dark:bg-dark-primary">
            <Navbar/>
            <ShareCard quizData={quizData}/>
        </div>
    );
}

function NotWorking()
{
    return (
        <div className="w-full min-h-[100vh] flex dark:bg-dark-primary bg-light-primary h-max flex-col justify-center items-center">
            <FontAwesomeIcon icon={faWarning} className="text-8xl text-accent-one mb-4"/>
            <h2 className="text-2xl font-bold text-white">Couldn't find the quiz file</h2>
            <p className="text-lg text-dark-tertiary">Please upload it again</p>
        </div>
    );
}

function ShareCard({quizData})
{
    const [isThumbnailLoaded,setThumbnailLoaded] = useState(false);
    const navigate = useNavigate();
    const inputRef = useRef(null);

    const goToHome = () =>
    {
        navigate('/');
    }

    function share()
    {
        const value = inputRef.current.value;
        if(navigator.share)
        {
            navigator.share({
                title: 'Quizin',
                text: 'Check this awesome quiz on Quizin!!',
                url: value
            })
            .then(() => console.log('Shared!'))
            .catch((err) => console.error('Share failed:', err))
        }
    }

    function copyLink()
    {
        const value = inputRef.current.value;
        navigator.clipboard.writeText(value);
    }

    return (
        <div className="flex flex-col w-full m-2 justify-center items-center mt-20 gap-1 h-max md:w-[60%]">
            <img src={quizData[0]?.thumbnailPath} onLoad={() => setThumbnailLoaded(true)} className={`w-full rounded-[10px_10px_0px_0px] max-h-[50vh] min-h-[50vh] h-fit object-cover ${!isThumbnailLoaded && 'animate-pulse'}`}/>
            <div className="w-full dark:bg-dark-secondary flex flex-row justify-between items-center bg-light-tertiary p-4">
                <div>
                    <h2 className="text-md md:text-xl font-extrabold text-accent-one dark:text-white">{quizData[0]?.title.length > 0 ? quizData[0]?.title : 'Untitled'}</h2>
                    <h2 className="text-xs font-semibold text-accent-one dark:text-white">{'By ' + quizData[0]?.filePath.split('-').pop().replace('.json','')}</h2>
                </div>
                <div className="flex gap-1">
                    <div className="dark:bg-dark-primary bg-accent-one p-2 justify-center items-center rounded flex w-max">
                        <h2 className="md:text-xl text-xs font-extrabold text-white">{(quizData[0]?.attempts ? quizData[0].attempts : '0') + ' Attempts'}</h2>
                    </div>
                    <div className="dark:bg-dark-primary bg-accent-one p-2 rounded flex w-max">
                        <h2 className="md:text-xl text-xs font-extrabold text-white">{'Q' + quizData[0]?.questions}</h2>
                    </div>
                </div>
                
            </div>
            <div className="w-full dark:bg-dark-secondary bg-light-tertiary rounded-[0px_0px_10px_10px] p-4">
                <input ref={inputRef} value={getShareUrl(window.location.origin,quizData)} className="text-sm dark:bg-dark-primary bg-light-primary w-full p-2 rounded text-center overflow-hidden text-gray-700 dark:text-white" readOnly={true}/>
            </div>
            <div className="w-full flex justify-center items-center gap-1">
                <AnimatedButton onClick={goToHome}  hideTextOnSmallScreens={false}  text="Back to Home" icon={faHouse} className="-translate-y-1.5"/>
                <AnimatedButton onClick={copyLink} hideTextOnSmallScreens={false}  text="Copy Link" icon={faCopy} className="-translate-y-1.5"/>
                <AnimatedButton onClick={share}  hideTextOnSmallScreens={false} text="Share" icon={faShareAlt} className="-translate-y-1.5"/>
            </div>
        </div>
    );
}

function getShareUrl(origin,quizData)
{
    const quizId = quizData[0]?.id;
    const quizFilePath = quizData[0]?.filePath;
    const quizUrl = `${origin}/player?file=${quizFilePath}&id=${quizId}`;

    return quizUrl;
}

function Navbar() 
{
  return (
    <div className='flex z-50 items-center px-2 md:px-10 py-1.5 justify-between fixed h-12 top-0 left-0 right-0 backdrop-blur-3xl dark:border-b-dark-tertiary border-b-accent-one border-b-2'>
      <h2 className='dark:text-white text-accent-one text-md md:text-1xl font-extrabold'>Share your quiz</h2>
      <div className='h-full w-[50%] flex justify-end'>
        <AnimatedButton icon={faCat} text='Github' layout='horizontal' onClick={() => window.location.href = 'https://github.com/AbhirajSagar/Quizapp'} />
      </div>
    </div>
  );
}