import {faSearch } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../authContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { QuizCard, QuizSkeleton } from '../components/QuizCard';
import { Navbar } from '../components/Navbar';
import { AccountInfoModal } from '../components/AccountInfoModal';
import MenuNavbar from '../components/MenuNavbar';

export default function Home() 
{
  const { user } = useAuth();
  const [showSearchBtn, setShowSearchBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [AccountInfoVisible, setAccountInfoVisible] = useState(false);

  useEffect(() => 
  {
    async function fetchLatestQuizzes() 
    {
      const { data, error } = await supabase.from('quizzes').select().order('created_at', { ascending: false }).limit(15);
      if (!error) 
      {
        setQuizzes(data)
        setIsLoading(false)
      }
    }

    const timeoutId = setTimeout(fetchLatestQuizzes, 1000)
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div className='dark:bg-dark-primary bg-light-primary min-h-[100vh]'>
      <MenuNavbar showSearchBtn={showSearchBtn} />
      <Section setShowSearchBtn={setShowSearchBtn} heading={user.user_metadata.name ? `Welcome back, ${user.user_metadata.name}` : `Welcome back`} subheading={'What do you wanna learn today?'} isLoading={isLoading} quizzes={quizzes} />
    </div>
  );
}

function Section({ heading, subheading, isLoading, quizzes, setShowSearchBtn }) 
{
  const { user } = useAuth();

  return (
    <div className='p-20 px-2 sm:px-15'>
      <SearchSection setShowSearchBtn={setShowSearchBtn} heading={heading} subheading={subheading} />
      <div className="w-full bg-primary-secondary grid grid-cols-1 min-[450px]:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1 pt-3 md:p-4">
        {
          isLoading ? [...Array(15)].map((_, index) => <QuizSkeleton key={index} url="fallback.png" setIsCardLoaded={() => { }} />)
            : quizzes.map((quiz, index) => <QuizCard key={index} quiz={quiz} user={user} />)
        }
      </div>
    </div>
  );
}

function SearchSection({ heading, subheading, setShowSearchBtn }) 
{
  const ref = useRef();
  const [hovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => 
  {
    const observer = new IntersectionObserver(([entry]) => setShowSearchBtn(!entry.isIntersecting));
    if (ref.current) observer.observe(ref.current);
    return () => ref.current && observer.unobserve(ref.current);
  }, [setShowSearchBtn]);

  return (
    <div ref={ref} className="w-full bg-primary-secondary p-1 pt-3 md:p-4">
      <div className='w-full md:h-50 h-max py-4 bg-gradient-to-r from-accent-one via-light-tertiary to-accent-one dark:from-dark-secondary dark:via-dark-tertiary dark:to-dark-secondary rounded-lg flex justify-center flex-col items-center'>
        {heading && <h2 className='text-center dark:text-white md:text-left font-bold md:text-2xl text-sm text-dark-secondary'>{heading}</h2>}
        {subheading && <h2 className='text-center dark:text-white md:text-left md:text-lg text-xs text-dark-primary mb-4'>{subheading}</h2>}
        <div onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)} className='md:m-2 p-[2px] md:w-[60%] w-[95%] rounded-2xl hover:bg-gradient-to-r dark:from-pink-500 dark:via-purple-500 dark:to-indigo-500 from-blue-600 via-sky-400 to-blue-950'>
          <div className='p-3 px-5 cursor-text rounded-2xl flex justify-between items-center bg-light-primary dark:bg-dark-primary h-9 md:h-18'>
            <FontAwesomeIcon bounce={hovering} icon={faSearch} className='md:text-2xl text-xl text-dark-secondary dark:text-white mr-2' />
            <input type='search' placeholder='Search Topics..' className='bg-transparent outline-none text-dark-secondary dark:text-white md:text-lg text-sm w-full pl-2' />
          </div>
        </div>
      </div>
    </div>
  );
}

