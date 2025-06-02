import {faPlusCircle,faMinusCircle,faTrash,faCheckCircle,faCircleXmark,faPlus,faDownload,faGear} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useEffect, useState} from 'react';
import AnimatedButton from '../AnimatedButton';

export function Question({ questions, setQuestionType, setQuestionMark, setQuestion, setQuizOptions, deleteQuestion, index: quesIndex })
{
    const [correctOptionIndex, setCorrectOptionIndex] = useState(0);

    useEffect(() =>
    {
        if(questions[quesIndex]?.type === 'tf')
        {
            updateOptions(['True', 'False']);
            setCorrectOptionIndex(0);
        }
        else if(questions[quesIndex]?.type === 'mcq')
        {
            if(questions[quesIndex]?.options.length === 0)
                createOption(0, '');
        }
        
    },[questions[quesIndex]?.type,]);

    function updateOptions(options)
    {
        const question = 
        {
            ...questions[quesIndex],
            options: options,
            answer: correctOptionIndex
        };
        
        setQuestion(quesIndex,question);
    }

    function createOption(index,value) 
    {
        const existingOptions = questions[quesIndex].options || [];
        if (existingOptions[index] !== undefined) 
        {
            updateOptions(existingOptions.map((option, i) => i === index ? value : option));
        }
        else 
        {
            updateOptions([...existingOptions, value]);
        }
    }

    function removeOption() 
    {
        if (correctOptionIndex === questions[quesIndex]?.options.length - 1)
            setCorrectOptionIndex(correctOptionIndex => correctOptionIndex - 1);

        updateOptions((questions[quesIndex].options || []).slice(0, questions[quesIndex]?.options.length - 1));
    }

    function QuestionType() 
    {
        return (
            <select value={questions[quesIndex]?.type} onChange={(e) => setQuestionType(quesIndex, e.target.value)} className='bg-light-primary text-xs md:w-fit md:text-lg dark:text-white dark:bg-dark-primary mb-1.5 p-1 rounded'>
                <option value='mcq'>Multiple Choice Question</option>
                <option value='tf'>True or False</option>
            </select>
        );
    }

    function Marks() 
    {
        return (
            <select value={questions[quesIndex]?.marks} onChange={(e) => setQuestionMark(quesIndex, e.target.value)} className='bg-light-primary text-xs md:w-fit md:text-lg dark:text-white dark:bg-dark-primary mb-1.5 p-1 rounded'>
                <option value={1}>1 Mark</option>
                <option value={2}>2 Marks</option>
                <option value={3}>3 Marks</option>
                <option value={4}>4 Marks</option>
                <option value={5}>5 Marks</option>
            </select>
        );
    }

    return (
        <>
            <div className='bg-light-tertiary dark:bg-dark-secondary w-full min-h-5 rounded-t-lg rounded-bl-lg p-2 focus-visible:outline-none text-dark-primary dark:text-light-primary flex flex-col'>
                <div className='flex justify-between'>
                    <QuestionType />
                    <Marks />
                </div>
                <textarea type='text' value={questions[quesIndex]?.question || ''} className='w-full bg-light-secondary dark:bg-dark-tertiary p-2 rounded min-h-10 h-fit dark:focus-visible:bg-dark-primary focus-visible:outline-none focus-visible:bg-light-primary text-sm md:text-lg mb-1' placeholder='Q).   Enter your question... ?' onChange={(e) => setQuestion(quesIndex,{...questions[quesIndex], question: e.target.value})} />                
                {
                    questions[quesIndex].type === 'mcq'
                    ?
                    (questions[quesIndex].options || []).slice(0, 26).map((normalOption, i) => <Options key={i} index={i} correctOptionIndex={correctOptionIndex} setCorrectOptionIndex={setCorrectOptionIndex} createOption={createOption} option={normalOption || ''} isReadOnly={false}/>)
                    :
                    (questions[quesIndex].options || []).slice(0, 2).map((option, i) => <Options key={i} index={i} correctOptionIndex={correctOptionIndex} setCorrectOptionIndex={setCorrectOptionIndex} option={option} createOption={createOption} isReadOnly={true}/>)
                }
            </div>

            {/* Actions - Add Option, Remove Option, Delete Question */}
            <div className='float-right h-10 mb-2 dark:bg-dark-secondary bg-light-tertiary rounded-b-lg flex justify-start items-center py-1 px-2'>
                <button onClick={() => createOption((questions[quesIndex].options || []).length,'')} className='h-full mx-0.5 w-10 dark:bg-dark-primary bg-light-secondary mb-1 rounded-sm cursor-pointer hover:scale-110 transition-transform duration-150 hover:dark:bg-dark-tertiary disabled:opacity-35' hidden={questions[quesIndex].type === 'tf' || (questions[quesIndex]?.options?.length || 0) >= 26}>
                    <FontAwesomeIcon icon={faPlusCircle} className='dark:text-white text-cyan-500' />
                </button>
                <button onClick={removeOption} className='h-full mx-0.5 w-10 dark:bg-dark-primary bg-light-secondary mb-1 rounded-sm cursor-pointer hover:scale-110 transition-transform duration-150 hover:dark:bg-dark-tertiary disabled:opacity-25' hidden={(questions[quesIndex]?.options?.length || 0) <= 1}>
                    <FontAwesomeIcon icon={faMinusCircle} className='dark:text-white text-cyan-500' />
                </button>
                <button onClick={() => deleteQuestion(quesIndex)} className='h-full mx-0.5 w-10 dark:bg-dark-primary bg-light-secondary mb-1 rounded-sm cursor-pointer hover:scale-110 transition-transform duration-150 hover:dark:bg-dark-tertiary'>
                    <FontAwesomeIcon icon={faTrash} className='dark:text-white text-cyan-500' />
                </button>
            </div>
        </>
    );
}

function Options({ index, correctOptionIndex, setCorrectOptionIndex, createOption, option,isReadOnly = false }) 
{
    const getAlphabet = (num) => String.fromCharCode(64 + num).toUpperCase();

    return (
        <div className='flex items-stretch justify-start'>
            <button onClick={() => setCorrectOptionIndex(index)} className={`w-10 rounded my-0.5 mr-0.5 cursor-pointer  ${index === correctOptionIndex ? 'bg-green-400' : 'dark:bg-dark-primary bg-light-primary  hover:dark:bg-dark-tertiary hover:bg-light-secondary'}`}>
                <FontAwesomeIcon icon={correctOptionIndex === index ? faCheckCircle : faCircleXmark} className={correctOptionIndex === index ? `text-white` : `text-cyan-500 dark:text-white`} />
            </button>
            <input readOnly={isReadOnly} onChange={(e) => createOption(index,e.target.value)} className='w-full dark:bg-dark-primary text-sm md:text-lg bg-light-primary focus-visible:outline-none px-3 my-0.5 h-9 rounded' placeholder={'Option ' + getAlphabet(index + 1)} value={option || ''} />
        </div>
    );
}

export function Actions({ downloadQuiz, addQuestion, setIsQuizSettingsOpen }) 
{
    return (
        <div className='w-full h-full flex justify-end items-center gap-1 m-1 md:m-0'>
            <AnimatedButton height='h-full' onClick={() => addQuestion(1)} icon={faPlus} text='Add Question' />
            <AnimatedButton height='h-full' onClick={() => downloadQuiz()} icon={faDownload} text='Download Quiz' />
            <AnimatedButton height='h-full' onClick={() => setIsQuizSettingsOpen(true)} icon={faGear} text='Quiz Settings' />
        </div>
    );
}