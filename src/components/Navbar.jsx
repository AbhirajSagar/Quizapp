import { useNavigate } from "react-router-dom";
import AnimatedButton from "./AnimatedButton";
import { faPlusCircle, faSearch, faBars } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import Logo from './Logo';
import { useAuth } from "../authContext";
// import Logo from '../assets/quizin.svg';

export function Navbar({ setAccountInfoVisible, showSearchBtn, showCreateQuiz })
{
  const navigate = useNavigate();
  const createQuiz = () => navigate('/editor');
  const navigateToAuth = () => navigate('/auth');
  const {user} = useAuth();

  function showUserInfo()
  {
    if(!user)
    return navigateToAuth();

    setAccountInfoVisible(true);
  }

  return (
    <div className='flex z-50 items-center px-2 md:px-10 py-1.5 justify-between fixed h-12 top-0 left-0 right-0 backdrop-blur-3xl dark:border-b-dark-tertiary border-b-accent-one border-b-2'>
      <Logo onClick={() => navigate('/')}/>
      <div className='h-full w-[50%] flex justify-end'>
        {/* {showSearchBtn && <SearchBtn />} */}
        {showCreateQuiz && <AnimatedButton text='Create' icon={faPlusCircle} layout='horizontal' onClick={createQuiz} className='mx-1' />}
        <AnimatedButton icon={faBars} layout='horizontal' onClick={showUserInfo} />
      </div>
    </div>
  );
}

function SearchBtn()
{
    const navigate = useNavigate();
    const navigateToSearch = () => navigate('/search');

    return (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <AnimatedButton text='Search' icon={faSearch} layout='horizontal' onClick={navigateToSearch}/>
        </motion.div>
    );
}

function LogoBtn()
{
  const navigate = useNavigate();
  const navigateToHome = () => navigate('/');

  return (
    <h2 onClick={navigateToHome} className="cursor-pointer text-xl md:text-3xl font-extrabold text-transparent bg-clip-text tracking-tight drop-shadow-sm select-none transition-transform duration-300 ease-in-out
      bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 
      dark:from-yellow-400 dark:via-orange-500 dark:to-red-500
      hover:scale-105 hover:rotate-1 hover:drop-shadow-lg
      animate-gradient-hover hover:animate-gradient-hover">
      Quizin’
    </h2>
  );
}



