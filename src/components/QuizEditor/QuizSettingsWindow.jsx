import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faCircleXmark, faUpload} from '@fortawesome/free-solid-svg-icons';
import Loading from '../../pages/Loading';

export default function QuizSettingsWindow({canBeMarked, setCanBeMarked, error, isQuizSettingsOpen, isUploading, setQuizThumnail, setIsQuizSettingsOpen, setQuizTime,setIsQuizPrivate,showPublishButton, publishQuiz }) 
{
    function TimeOption()
    {
        return (
            <div className='w-full mb-0.5 bg-light-tertiary dark:bg-dark-primary p-2 px-4 flex-row rounded flex justify-between items-center'>
                <h2 className='dark:text-white text-xs md:text-lg'>Time Per Question</h2>
                <select name='timeLimit' onChange={(e) => setQuizTime(e.target.value)} className='bg-light-primary w-28 md:w-fit  text-xs md:text-lg dark:text-white dark:bg-dark-secondary p-1 rounded'>
                    <option value={-1} className='dark:text-white'>No Time Limit</option>
                    <option value={30} className='dark:text-white'>30 Seconds</option>
                    <option value={60} className='dark:text-white'>1 Minute</option>
                    <option value={90} className='dark:text-white'>1 Minute 30 Seconds</option>
                    <option value={120} className='dark:text-white'>2 Minutes</option>
                    <option value={180} className='dark:text-white'>2 Minutes 30 Seconds</option>
                </select>
            </div>
        );
    }

    function Heading()
    {
        return (
            <h2 className='text-xl font-bold mb-4 text-dark-primary dark:text-light-primary'>
                <div className='flex items-center gap-1 justify-center'>
                    <FontAwesomeIcon icon={faGear}/>
                    <p>Settings</p>
                </div>
            </h2>
        );
    }

    function VisibilityOption()
    {
        return (
            <div className='w-full mb-0.5 bg-light-tertiary dark:bg-dark-primary p-2 px-4 flex-row rounded flex justify-between items-center'>
                <h2 className='dark:text-white text-xs md:text-lg'>Visibility</h2>
                <select name='timeLimit' onChange={(e) => setIsQuizPrivate(e.target.value)} className='bg-light-primary text-xs md:w-fit md:text-lg dark:text-white dark:bg-dark-secondary p-1 rounded'>
                    <option value={true} className='dark:text-white'>Public</option>
                    <option value={false} className='dark:text-white'>Private</option>
                </select>
            </div>
        );
    }

    function ThumbnailOption()
    {
        return (
            <div className='w-full mb-0.5 bg-light-tertiary dark:bg-dark-primary p-2 px-4 flex-row rounded flex justify-between items-center'>
                <h2 className='dark:text-white text-xs md:text-lg'>Quiz Thumbnail</h2>
                <input type='file' accept='image/*' onChange={(e) => setQuizThumnail(e.target.files[0])} className='bg-light-primary w-26 md:w-28 text-xs md:text-lg dark:text-white dark:bg-dark-secondary p-1 rounded' />
            </div>
        );
    }

    function MarkingOption()
    {
        return (
            <div className='w-full mb-0.5 bg-light-tertiary dark:bg-dark-primary p-2 px-4 flex-row rounded flex justify-between items-center'>
                <h2 className='dark:text-white text-xs md:text-lg'>Enable Grading</h2>
                <input type='checkbox' onChange={() => setCanBeMarked(!canBeMarked)} className='w-5 h-5 accent-accent-one cursor-pointer' checked={canBeMarked}/>
            </div>
        );
    }

    function Actions()
    {
        return (
            <div className='flex gap-1'>
                <button className='mt-2 w-full bg-accent-one text-white py-2 rounded hover:bg-accent-two cursor-pointer' onClick={() => setIsQuizSettingsOpen(false)}>
                    <FontAwesomeIcon icon={faCircleXmark} className='mr-2'/>
                    Close
                </button>
                {
                    showPublishButton &&
                    <button onClick={publishQuiz} className='mt-2 w-full bg-accent-one text-white py-2 rounded hover:bg-accent-two cursor-pointer'>
                        <FontAwesomeIcon icon={faUpload} className='mr-2'/>
                        Publish
                    </button>
                }
            </div>
        );
    }

    function SettingsUI()
    {
        return (
            <>
                <Heading/>
                <TimeOption/>
                <VisibilityOption/>
                <ThumbnailOption/>
                <MarkingOption/>
                <Actions/>
            </>
        )
    }

    function UploadingStatusUI()
    {
        return (
            <>
                <Heading/>
                <Loading showError={error}/>
                <h2 className='m-auto block text-center'>{error || 'Hold On, Just a Sec'}</h2>
            </>
        );
    }

    return (
        <AnimatePresence>
            {
                isQuizSettingsOpen &&
                <motion.div initial={{ opacity: 0, scale: 1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1 }} transition={{ duration: 0.2 }} className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs' onClick={() => setIsQuizSettingsOpen(false)}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className='bg-white w-full max-w-[60vw] sm:m-10 dark:bg-dark-secondary p-3 md:p-6 rounded-lg shadow-xl min-w-[300px]' onClick={(e) => e.stopPropagation()}>
                        {isUploading ? <UploadingStatusUI/> : <SettingsUI/>}        
                    </motion.div>
                </motion.div>
            }
        </AnimatePresence>
    );
}
