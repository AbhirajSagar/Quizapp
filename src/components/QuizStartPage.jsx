import MenuNavbar from "./MenuNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

export function QuizStartPage({quizName, quizTime, questions, filePath, setQuizStarted, img}) 
{
  const getTitleSplits = () => filePath.split(/[\/.-]/);

  function getUploadTimeLocale() 
  {
    const parts = getTitleSplits();
    const timestamp = parseInt(parts[2]);
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  function getQuizUploader() 
  {
    const parts = getTitleSplits();
    return parts[3];
  }

  return (
        <>
            <MenuNavbar showSearchBtn={false} showCreateQuiz={false} />
            <div className='bg-light-primary dark:bg-dark-primary w-full min-h-[100vh] overflow-x-hidden pt-16'>
                <motion.div 
                    className='max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 px-4'
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div 
                        className='w-full'
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <motion.div 
                            className='w-full aspect-video relative rounded-xl overflow-hidden'
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <img src={img} className="w-full h-full object-cover bg-dark-secondary" />
                            <button onClick={() => setQuizStarted(true)} className='absolute top-[50%] w-18 aspect-square left-[50%] translate-x-[-50%] translate-y-[-50%] z-10 bg-black/30 rounded-full flex justify-center items-center cursor-pointer hover:scale-110 duration-150'>
                                <FontAwesomeIcon icon={faPlay} className='text-white text-5xl' />
                            </button>
                        </motion.div>

                        <motion.div 
                            className='mt-4 bg-light-tertiary dark:bg-dark-secondary p-4 rounded-xl shadow'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <h1 className='text-2xl sm:text-3xl font-bold text-dark-primary dark:text-white'>{quizName}</h1>
                            <p className='text-sm text-dark-primary dark:text-white/80 mt-1'>By {getQuizUploader()}</p>
                            <div className='mt-3 flex flex-wrap gap-3 text-sm sm:text-base'>
                                <span className='bg-light-primary dark:bg-white/10 px-3 py-1 rounded-full text-dark-primary dark:text-white'>
                                    {questions.length} Questions
                                </span>
                                <span className='bg-light-primary dark:bg-white/10 px-3 py-1 rounded-full text-dark-primary dark:text-white'>
                                    {quizTime === -1 ? "No Time Limit" : `${quizTime} sec/question`}
                                </span>
                                <span className='bg-light-primary dark:bg-white/10 px-3 py-1 rounded-full text-dark-primary dark:text-white'>
                                    {getUploadTimeLocale()}
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <div className='bg-light-tertiary dark:bg-dark-secondary p-4 rounded-xl shadow h-full'>
                            <p className='text-dark-primary dark:text-white font-semibold'>Recommended</p>
                            {/* Map recommendations here */}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </>
    );
}
