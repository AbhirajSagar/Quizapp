import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faCircleXmark, faUpload } from '@fortawesome/free-solid-svg-icons';
import Loading from '../../pages/Loading';
import { useState, useRef } from 'react';

export default function QuizSettingsWindow({ tags, setTags, canBeMarked, setCanBeMarked, error, isQuizSettingsOpen, isUploading, setQuizThumnail, setIsQuizSettingsOpen, setQuizTime, setIsQuizPrivate, showPublishButton, publishQuiz }) 
{
    function SettingsUI() 
    {
        return (
            <>
                <Heading />
                <ThumbnailOption setQuizThumbnail={setQuizThumnail} />
                <TimeOption setQuizTime={setQuizTime} />
                <VisibilityOption setIsQuizPrivate={setIsQuizPrivate} />
                <MarkingOption canBeMarked={canBeMarked} setCanBeMarked={setCanBeMarked}/>
                <Tags tags={tags} setTags={setTags}/>

                <Actions setIsQuizSettingsOpen={setIsQuizSettingsOpen} showPublishButton={showPublishButton} publishQuiz={publishQuiz}/>
            </>
        )
    }

    function UploadingStatusUI() 
    {
        return (
            <>
                <Heading />
                <Loading showError={error} />
                <h2 className='m-auto block text-center'>{error || 'Hold On, Just a Sec'}</h2>
            </>
        );
    }

    return (
        <AnimatePresence>
            {
                isQuizSettingsOpen &&
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs' onClick={() => setIsQuizSettingsOpen(false)}>
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} transition={{ duration: 0.2 }} className='bg-white w-full max-w-2xl sm:m-10 dark:bg-dark-secondary m-1 p-3 md:p-6 rounded-lg shadow-xl min-w-[300px]' onClick={(e) => e.stopPropagation()}>
                        {isUploading ? <UploadingStatusUI /> : <SettingsUI />}
                    </motion.div>
                </motion.div>
            }
        </AnimatePresence>
    );
}

function Heading() 
{
    return (
        <h2 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className='text-xl font-bold mb-4 text-dark-primary dark:text-light-primary'>
            <div className='flex items-center gap-2 justify-center'>
                <FontAwesomeIcon icon={faGear} />
                <p>Quiz Settings</p>
            </div>
        </h2>
    );
}

function ThumbnailOption({ setQuizThumbnail }) 
{
    const fileInputRef = useRef();
    const [preview, setPreview] = useState(null);

    const handleFile = (file) => {
        setQuizThumbnail(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files[0])
            handleFile(e.dataTransfer.files[0]);
    };

    const handleChange = (e) => {
        if (e.target.files[0])
            handleFile(e.target.files[0]);
    };

    return (
        <div onClick={() => fileInputRef.current.click()} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className='w-full h-48 mb-2 bg-light-tertiary dark:bg-dark-primary rounded flex justify-center items-center cursor-pointer relative overflow-hidden'>
            <input type='file' accept='image/*' onChange={handleChange} ref={fileInputRef} className='hidden' />
            {preview ? (
                <img src={preview} alt='Preview' className='w-full h-full object-cover pointer-events-none' />
            ) : (
                <UploadUI fileInputRef={fileInputRef} />
            )}
        </div>
    );
}

function UploadUI() 
{
    return (
        <div className='z-10 flex flex-col items-center justify-center w-full h-full rounded-lg px-4 py-6 transition-all duration-200 ease-in-out'>
            <FontAwesomeIcon icon={faUpload} className='text-4xl dark:text-light-primary text-cyan-500' />
            <h1 className='text-center font-extrabold text-xl md:text-2xl dark:text-light-primary mt-3 text-cyan-500'>Upload Thumbnail</h1>
            <p className='text-center text-sm text-cyan-500 dark:text-light-primary'>Drop or tap to browse</p>
        </div>
    );
}

function TimeOption({ setQuizTime }) 
{
    return (
        <div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='w-full mb-0.5 bg-light-tertiary dark:bg-dark-primary p-2 px-4 flex-row rounded flex justify-between items-center'>
            <h2 className='dark:text-white text-xs md:text-lg'>Time Per Question</h2>
            <select name='timeLimit' onChange={(e) => setQuizTime(e.target.value)} className='bg-light-primary w-28 md:w-fit text-xs md:text-lg dark:text-white dark:bg-dark-secondary p-1 rounded'>
                <option value={-1}>No Time Limit</option>
                <option value={30}>30 Seconds</option>
                <option value={60}>1 Minute</option>
                <option value={90}>1 Minute 30 Seconds</option>
                <option value={120}>2 Minutes</option>
                <option value={180}>2 Minutes 30 Seconds</option>
            </select>
        </div>
    );
}

function VisibilityOption({ setIsQuizPrivate }) 
{
    return (
        <div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='w-full mb-0.5 bg-light-tertiary dark:bg-dark-primary p-2 px-4 flex-row rounded flex justify-between items-center'>
            <h2 className='dark:text-white text-xs md:text-lg'>Visibility</h2>
            <select name='visibility' onChange={(e) => setIsQuizPrivate(e.target.value === "true")} className='bg-light-primary text-xs md:w-fit md:text-lg dark:text-white dark:bg-dark-secondary p-1 rounded'>
                <option value="false">Public</option>
                <option value="true">Private</option>
            </select>
        </div>
    );
}

function MarkingOption({ canBeMarked, setCanBeMarked }) 
{
    return (
        <div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='w-full mb-0.5 bg-light-tertiary dark:bg-dark-primary p-2 px-4 flex-row rounded flex justify-between items-center'>
            <h2 className='dark:text-white text-xs md:text-lg'>Enable Grading</h2>
            <input type='checkbox' onChange={() => setCanBeMarked(!canBeMarked)} className='w-5 h-5 accent-accent-one cursor-pointer' checked={canBeMarked} />
        </div>
    );
}

function Tags({ tags, setTags }) 
{
    const [input, setInput] = useState('')
    const inputRef = useRef(null)

    const handleKeyDown = (e) => 
    {
        if ((e.key === ',' || e.key === 'Enter') && input.trim()) 
        {
            e.preventDefault()
            const newTag = input.trim().replace(/,$/, '').toLowerCase()
            if (newTag && !tags.includes(newTag) && tags.length < 7) 
            {
                setTags([...tags, newTag])
            }
            setInput('')
            inputRef.current?.focus();
        }
        else if (e.key === 'Backspace' && !input && tags.length) 
        {
            setTags(tags.slice(0, -1))
            inputRef.current?.focus();
        }
    }

    const removeTag = (index) => 
    {
        setTags(tags.filter((_, i) => i !== index))
    }

    function TagChip(tag, i) 
    {
        return (
            <div key={tag} className='bg-blue-500 text-white text-xs sm:text-sm md:text-md px-2 py-0.5 rounded flex items-center'>
                {tag}
                <button onClick={() => removeTag(i)} className='ml-1 text-xs'>×</button>
            </div>
        )
    }

    return (
        <div className='w-full mb-0.5 bg-light-tertiary dark:bg-dark-primary p-2 px-2 flex-col rounded flex justify-center items-center'>
            <h2 className='dark:text-white text-xs md:text-lg w-full'>&nbsp; Tags</h2>
            {tags.length > 0 && (
                <div className='flex bg-light-primary dark:bg-dark-secondary dark:text-white rounded-t-sm w-full p-2 gap-1 mt-1 overflow-x-scroll'>
                    {tags.map((tag, i) => TagChip(tag, i))}
                </div>
            )}
            <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`w-full bg-light-primary dark:bg-dark-secondary dark:text-white px-3 py-1.5 sm:py-3 mt-0.5 rounded-b-sm outline-none h-5 text-sm flex-1 ${tags.length == 0 && 'rounded-t-sm'} ${tags.length <= 6 ? 'placeholder-gray-500' : 'placeholder-red-500'}`}
                placeholder={tags.length <= 6 ? 'Type and press comma...' : 'Max 6 tags allowed'}
            />
        </div>
    )
}

function Actions({ setIsQuizSettingsOpen, showPublishButton, publishQuiz }) 
{
    return (
        <div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='flex gap-1'>
            <button className='mt-2 w-full bg-accent-one text-white py-2 rounded hover:bg-accent-two cursor-pointer' onClick={() => setIsQuizSettingsOpen(false)}>
                <FontAwesomeIcon icon={faCircleXmark} className='mr-2' />
                Close
            </button>
            {
                showPublishButton &&
                <button onClick={publishQuiz} className='mt-2 w-full bg-accent-one text-white py-2 rounded hover:bg-accent-two cursor-pointer'>
                    <FontAwesomeIcon icon={faUpload} className='mr-2' />
                    Publish
                </button>
            }
        </div>
    );
}