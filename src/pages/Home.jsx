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
  const [isLoading, setIsLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);

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
      <MenuNavbar showSearchBtn={true} />
      <Section heading={user.user_metadata.name ? `Hiya, ${user.user_metadata.name.split(' ')[0]}` : `Welcome back`} subheading={'What to learn today?'} isLoading={isLoading} quizzes={quizzes} />
    </div>
  );
}

function Section({ heading, subheading, isLoading, quizzes})
{
  const { user } = useAuth();

  const LoadingSkeletons = () => [...Array(15)].map((_, index) => <QuizSkeleton key={index} url="fallback.png" setIsCardLoaded={() => { }} />)
  const Quizzes = (array) => array.map((quiz, index) => <QuizCard key={index} quiz={quiz} user={user} />);

  function Results()
  { 
    return isLoading ? <LoadingSkeletons/> : Quizzes(quizzes);
  }

  return (
    <div className='p-20 px-2 sm:px-15'>
      {heading.length > 0 && <h2 className='px-2 md:px-4 md:text-2xl dark:text-light-primary font-extrabold text-xl'>{heading}</h2>}
      {subheading.length > 0 && <p className='px-2 md:px-4 md:text-lg dark:text-light-primary text-sm'>{subheading}</p>}
      {/* <SearchSection search={search} setSearch={setSearch} setIsSearching={setIsSearching} setSearchItems={setSearchItems} setShowSearchBtn={setShowSearchBtn} heading={heading} subheading={subheading}/> */}
      <div className="w-full bg-primary-secondary grid grid-cols-1 min-[450px]:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1 pt-3 md:p-4">
        <Results/>
      </div>
    </div>
  );
}

