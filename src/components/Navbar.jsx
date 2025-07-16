import { useNavigate } from "react-router-dom";
import AnimatedButton from "./AnimatedButton";
import { faPlusCircle, faHouseUser, faSearch } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";


function SearchBtn()
{
    return (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <AnimatedButton text='Search' icon={faSearch} layout='horizontal' />
        </motion.div>
    );
}

export function Navbar({ setAccountInfoVisible, showSearchBtn, showCreateQuiz })
{
  const navigate = useNavigate();
  const createQuiz = () => navigate('/editor');

  return (
    <div className='flex z-50 items-center px-2 md:px-10 py-1.5 justify-between fixed h-12 top-0 left-0 right-0 backdrop-blur-3xl dark:border-b-dark-tertiary border-b-accent-one border-b-2'>
      <h2 className='dark:text-white text-accent-one text-md md:text-2xl font-extrabold'>Quizin'</h2>
      <div className='h-full w-[50%] flex justify-end'>
        {showSearchBtn && <SearchBtn />}
        {showCreateQuiz && <AnimatedButton text='Create' icon={faPlusCircle} layout='horizontal' onClick={createQuiz} className='mx-1' />}
        <AnimatedButton icon={faHouseUser} layout='horizontal' onClick={() => setAccountInfoVisible(true)} />
      </div>
    </div>
  );
}