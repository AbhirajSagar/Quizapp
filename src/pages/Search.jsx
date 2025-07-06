import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

export default function Search() 
{
    return (
        <div className='p-20 px-5 sm:px-15 bg-dark-primary min-h-[100vh]'>
            <div className="w-full bg-primary-secondary p-1 pt-3 md:p-4">
                <motion.div className='w-full md:h-50 h-max py-4 bg-light-tertiary dark:bg-dark-secondary rounded-lg flex justify-start flex-col items-center'>
                    <h2 className='text-center dark:text-white md:text-left font-bold md:text-2xl text-sm text-dark-secondary'>Welcome back, Abhiraj Sagar</h2>
                    <h2 className='text-center dark:text-white md:text-left md:text-lg text-xs text-dark-primary mb-4'>What do you wanna learn today?</h2>
                    <div className='md:m-2 p-[2px] md:w-[60%] w-[95%] rounded-2xl hover:bg-gradient-to-r dark:from-pink-500 dark:via-purple-500 dark:to-indigo-500 from-blue-600 via-sky-400 to-blue-950'>
                        <motion.div initial={{borderRadius: '1rem'}} animate={{borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px'}} className='p-3 px-5 cursor-text rounded-2xl flex justify-between items-center bg-light-primary dark:bg-dark-primary h-9 md:h-18'>
                            <FontAwesomeIcon icon={faSearch} className='md:text-2xl text-xl text-dark-secondary dark:text-white mr-2' />
                            <h2 className='dark:text-white text-dark-secondary md:text-lg text-sm'>Search Topics..</h2>
                            <FontAwesomeIcon icon={faPaperPlane} className='dark:text-white text-dark-secondary text-xl md:text-2xl' />
                        </motion.div>
                        <motion.div initial={{height: '0rem'}} animate={{height: '3.5rem'}} className="w-full h-12 bg-dark-tertiary rounded-b-2xl">

                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>

    );
}