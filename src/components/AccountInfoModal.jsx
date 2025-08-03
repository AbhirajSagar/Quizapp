import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedButton from '../components/AnimatedButton';
import { AnimatePresence, motion } from 'framer-motion';
import { faThumbsUp, faMobileScreen, faMicrochip, faClipboardQuestion, faRightFromBracket, faClose, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../supabaseClient';

export function AccountInfoModal({ user, setAccountInfoVisible })
{
  const [quizAttemptsCount, setQuizAttemptsCount] = useState('loading..');
  const navigate = useNavigate();
  const navigateToPlayer = () => navigate('/player?file=');
  const navigateToAiQuiz = () => navigate('/ai-quiz');
  const navigateToLikedQuiz = () => navigate('/liked');
  const navigateToMyQuizzes = () => navigate('/myquizzes');

  useEffect(() => 
  {
    async function getAttemptedQuizCount() 
    {
      const { count, error } = await supabase.from('attempts').select('*', { count: 'exact', head: true }).eq('user_id', user?.id);
      if (!error) setQuizAttemptsCount(count);
      else setQuizAttemptsCount(null);
    }

    getAttemptedQuizCount();
  }, [user])

  async function signOut() 
  {
    const { error } = await supabase.auth.signOut();
    if (error) 
    {
      console.error('Error while signing out', error);
      alert('Something went wrong while trying to sign out, please check console for more details');
    }
  }

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0, scale: 1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1 }} transition={{ duration: 0.2 }} className='fixed md:w-fit md:outline-1 outline-accent-one inset-0 z-50 flex items-center md:justify-start justify-center  dark:bg-dark-primary/40 bg-light-secondary/10 backdrop-blur-2xl' onClick={() => setIsQuizSettingsOpen(false)}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className='h-full w-full flex md:w-120  flex-col px-4 p-2' onClick={(e) => e.stopPropagation()}>
          <AccountInfoSection user={user} quizAttemptsCount={quizAttemptsCount}/>
          <Options setAccountInfoVisible={setAccountInfoVisible} navigateToPlayer={navigateToPlayer} navigateToAiQuiz={navigateToAiQuiz} navigateToLikedQuiz={navigateToLikedQuiz} navigateToMyQuizzes={navigateToMyQuizzes} signOut={signOut} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function AccountInfoSection({user,quizAttemptsCount}) 
{
    return (
        <div className='mt-4 flex justify-between items-center md:pr-5 dark:bg-dark-primary bg-light-secondary outline-accent-one outline-1 p-4 rounded-xl'>
        <div className='w-15 h-15 bg-accent-one flex justify-center text-3xl rounded-2xl text-white font-extrabold items-center text-center'>{user?.user_metadata.name[0] || 'U'}</div>
        <div>
            <h2 className='text-2xl text-right font-extrabold text-accent-one'>{user?.user_metadata.name || 'Anonymous'}</h2>
            <p className='text-md font-normal text-accent-one'>{quizAttemptsCount ? `${quizAttemptsCount} Quiz Attempted` : 'Error loading data'}</p>
        </div>
        </div>
    );
}

function Options({setAccountInfoVisible, navigateToPlayer, navigateToAiQuiz, navigateToLikedQuiz,navigateToMyQuizzes, signOut}) 
{
    return (
        <div className='w-full mt-4 flex-col'>
            <AnimatedButton className='w-full my-0.5 disabled:opacity-60' justify='justify-start' icon={faMobileScreen} text='Play Local Quiz' onClick={navigateToPlayer} hideTextOnSmallScreens={false} />
            <AnimatedButton className='w-full my-0.5 disabled:opacity-60' justify='justify-start' icon={faMicrochip} text='AI Quiz Generator' onClick={navigateToAiQuiz} hideTextOnSmallScreens={false} />
            <AnimatedButton className='w-full my-0.5 disabled:opacity-60' justify='justify-start' icon={faThumbsUp} text='Liked Quizzes' onClick={navigateToLikedQuiz} hideTextOnSmallScreens={false} />
            <AnimatedButton className='w-full my-0.5 disabled:opacity-60' justify='justify-start' icon={faClipboardQuestion} text='My Quizzes' onClick={navigateToMyQuizzes} hideTextOnSmallScreens={false} />
            <AnimatedButton className='w-full my-0.5 disabled:opacity-60' justify='justify-start' icon={faGamepad} text='Games by Quiz' onClick={signOut} hideTextOnSmallScreens={false} />
            <AnimatedButton className='w-full my-0.5 disabled:opacity-60' justify='justify-start' icon={faRightFromBracket} text='Sign Out' onClick={signOut} hideTextOnSmallScreens={false} />
            <AnimatedButton className='w-full my-0.5 disabled:opacity-60' justify='justify-start' icon={faClose} text='Close' onClick={() => setAccountInfoVisible(false)} hideTextOnSmallScreens={false} />
        </div>
    )
}