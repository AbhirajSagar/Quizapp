import { faBars, faClipboardQuestion, faClose, faHeart, faHouseUser, faMicrochip, faMobileScreen, faPlusCircle, faRightFromBracket, faSearch, faShare } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../authContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import AnimatedButton from '../components/AnimatedButton';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [AccountInfoVisible, setAccountInfoVisible] = useState(false);

  useEffect(() => 
  {
    async function fetchLatestQuizzes() 
    {
      const { data, error } = await supabase
      .from('quizzes')
      .select()
      .order('created_at', { ascending: false })
      .limit(15);

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
      <Navbar user={user} setAccountInfoVisible={setAccountInfoVisible} />
      {AccountInfoVisible && <AccountInfoModal user={user} setAccountInfoVisible={setAccountInfoVisible} />}
      <Section heading={user.user_metadata.name ? `Welcome back, ${user.user_metadata.name}` : `Welcome back`} subheading={'We have new quizzes'} isLoading={isLoading} quizzes={quizzes} />
    </div>
  );
}

function Section({ heading, subheading, isLoading, quizzes }) {

  return (
    <div className='p-20 px-5 sm:px-15'>
      {heading && <h2 className='text-center dark:text-white md:text-left font-bold md:text-2xl text-md text-dark-secondary'>{heading}</h2>}
      {subheading && <h2 className='text-center dark:text-white md:text-left md:text-lg text-xs text-dark-primary'>{subheading}</h2>}
        <AIQuizGeneration/>
        <div className="w-full bg-primary-secondary columns-1 sm:columns-2 md:columns-4 gap-4 p-1 pt-3 md:p-4">
        {
          isLoading
            ? [...Array(15)].map((_, index) => <div key={index} className="mb-4 break-inside-avoid"><QuizSkeleton /></div>)
            : quizzes.map((quiz, index) => (
              <div key={index} className="mb-4 break-inside-avoid">
                <QuizCard quiz={quiz} />
              </div>
            ))
        }
        </div>
    </div>
  );
}

function AIQuizGeneration()
{
  return (
    <div className='w-full h-50 bg-black rounded-lg mb-4'>

    </div>
  );
}

function QuizSkeleton({url,setIsCardLoaded}) 
{
  useEffect(() => console.log('url',url),[]);

  return (
    <div className='w-full h-60 my-1 z-1 bg-light-secondary dark:bg-dark-secondary relative rounded-lg overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform duration-75 animate-pulse'>
      <div className='w-full absolute bottom-0 h-12 bg-accent-one dark:bg-dark-tertiary flex justify-between items-center px-4'>
        <p className='text-light-primary sm:font-semibold md:text-xl text-center'></p>
        <FontAwesomeIcon icon={faShare} className='text-light-primary text-xl' />
        <img src={url} onLoad={()=>setIsCardLoaded(true)} className='hidden'/>
      </div>
    </div>
  );
}

function QuizCard({ quiz }) 
{
  const [loaded,setIsCardLoaded] = useState(false);
  const [isThumbnailEmpty,setIsThumbnailEmpty] = useState(false);
  const navigate = useNavigate();
  const goToPlayer = (query) => navigate('/player' + query);

  useEffect(() => 
  {
    if (!quiz.thumbnailPath) 
      setIsThumbnailEmpty(true);
  }, [quiz.thumbnailPath]);

  function share(event) 
  {
    event.stopPropagation();
    if (navigator.share) 
    {
      navigator.share({
        title: 'Quizin',
        text: 'Check this awesome quiz on Quizin!!',
        url: window.location.href
      })
        .then(() => console.log('Shared!'))
        .catch((err) => console.error('Share failed:', err))
    }
    else 
    {
      alert('Sharing not supported on this browser.')
    }
  }

  function getTrimmedTitle() 
  {
    if (!quiz) return null;
    if (quiz.title.length > 20) return quiz.title.substring(0, 20) + '...';
    return quiz.title;
  }

  if(!loaded && !isThumbnailEmpty) return <QuizSkeleton url={quiz.thumbnailPath} setIsCardLoaded={setIsCardLoaded}/>

  return (
    <div
      onClick={(e) => goToPlayer(`?file=${quiz.filePath}&id=${quiz.id}`)}
      className='w-full bg-light-secondary dark:bg-dark-secondary relative rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-75 break-inside-avoid'
    >
      <img 
        src={quiz.thumbnailPath}
        alt={quiz.title}
        className={`w-full object-cover ${isThumbnailEmpty && 'h-59'}`}
      />

      <div className='w-full h-12 bg-accent-one dark:bg-dark-tertiary flex justify-between items-center px-4'>
        <p className='text-light-primary md:text-md text-center'>
          {getTrimmedTitle() || 'Untitled'}
        </p>
        <div className='flex items-center justify-center gap-3'>
          {/* <FontAwesomeIcon icon={faHeart} onClick={(e) => e.stopPropagation()} className='text-light-primary text-xl hover:text-accent-two' /> */}
          <FontAwesomeIcon onClick={share} icon={faShare} className='text-light-primary text-xl hover:text-accent-two' />
        </div>
      </div>
    </div>
  );
}

function Navbar({ setAccountInfoVisible }) 
{
  const navigate = useNavigate();
  const createQuiz = () => navigate('/editor');

  return (
    <div className='flex z-50 items-center px-2 md:px-10 py-1.5 justify-between fixed h-12 top-0 left-0 right-0 backdrop-blur-3xl dark:border-b-dark-tertiary border-b-accent-one border-b-2'>
      <h2 className='dark:text-white text-accent-one text-md md:text-2xl font-extrabold'>Quizin'</h2>
      <div className='h-full w-[50%] flex justify-end'>
        <SearchBtn />
        <AnimatedButton text='Create' icon={faPlusCircle} layout='horizontal' onClick={createQuiz} className='mx-1'/>
        <AnimatedButton icon={faHouseUser} layout='horizontal' onClick={() => setAccountInfoVisible(true)} />
      </div>
    </div>
  );
}

function SearchBtn() 
{
  return (
    <AnimatedButton text='Search' icon={faSearch} layout='horizontal'/>
  );
}

function AccountInfoModal({ user, setAccountInfoVisible }) 
{
  const [quizAttemptsCount,setQuizAttemptsCount] = useState('loading..');

  useEffect(() => 
  {
    async function getAttemptedQuizCount() 
    {
      const { count, error } = await supabase.from('attempts').select('*', { count: 'exact', head: true }).eq('user_id', user?.id);
      
      if (!error) setQuizAttemptsCount(count);
      else  setQuizAttemptsCount(null);
    }

    getAttemptedQuizCount();
  },[user])

  const navigate = useNavigate();
  const navigateToPlayer = () => navigate('/player');
  const navigateToAiQuiz = () => navigate('/ai-quiz');

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error while signing out', error);
      alert('Something went wrong while trying to sign out, please check console for more details');
    }
  }

  function AccountInfoSection() {
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

  function Options() {
    return (
      <div className='w-full mt-4 flex-col'>
        <AnimatedButton className='w-full my-0.5 disabled:opacity-60' justify='justify-start' icon={faMobileScreen} text='Play Local Quiz' onClick={navigateToPlayer} hideTextOnSmallScreens={false} />
        <AnimatedButton className='w-full my-0.5 disabled:opacity-60' justify='justify-start' icon={faMobileScreen} text='AI Quiz Generator' onClick={navigateToAiQuiz} hideTextOnSmallScreens={false} />
        <AnimatedButton className='w-full my-0.5 disabled:opacity-60' justify='justify-start' icon={faHeart} text='Favourites' hideTextOnSmallScreens={false} disabled />
        <AnimatedButton className='w-full my-0.5 disabled:opacity-60' justify='justify-start' icon={faClipboardQuestion} text='My Quizzes' hideTextOnSmallScreens={false} disabled />
        <AnimatedButton className='w-full my-0.5 disabled:opacity-60' justify='justify-start' icon={faRightFromBracket} text='Sign Out' onClick={signOut} hideTextOnSmallScreens={false} />
        <AnimatedButton className='w-full my-0.5 disabled:opacity-60' justify='justify-start' icon={faClose} text='Close' onClick={() => setAccountInfoVisible(false)} hideTextOnSmallScreens={false} />
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0, scale: 1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1 }} transition={{ duration: 0.2 }} className='fixed md:w-fit md:outline-1 outline-accent-one inset-0 z-50 flex items-center md:justify-start justify-center  dark:bg-dark-primary/40 bg-light-secondary/10 backdrop-blur-2xl' onClick={() => setIsQuizSettingsOpen(false)}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className='h-full w-full flex md:w-120  flex-col px-4 p-2' onClick={(e) => e.stopPropagation()}>
          <AccountInfoSection />
          <Options />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}