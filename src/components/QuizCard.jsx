import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faShare } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../supabaseClient';
import { AiOutlineLike, AiFillLike } from 'react-icons/ai';
import { getUserNameByFileName } from '../utils';

export function QuizCard({ quiz, user, canBeEdit = false}) 
{
  const [isLiked, setIsLiked] = useState(false);
  const [loaded, setIsCardLoaded] = useState(false);
  const [isThumbnailEmpty, setIsThumbnailEmpty] = useState(false);
  const navigate = useNavigate();

  const goToPlayer = (query) => navigate('/player' + query);

  useEffect(() => setIsThumbnailEmpty(!quiz.thumbnailPath), [quiz.thumbnailPath]);

  useEffect(() => 
  {
    async function checkIfLiked() 
    {
      const { data, error } = await supabase.from('liked').select().eq('user_id', user.id).eq('quiz_id', quiz.id);
      if (error) console.error(error);
      if (data?.length > 0) setIsLiked(true);
    }

    checkIfLiked();
  }, [quiz.id, user.id]);

  function getTrimmedTitle() 
  {
    if (!quiz) return null;
    if (quiz.title.length > 30) return quiz.title.substring(0, 30) + '...';
    return quiz.title;
  }

  async function toggleLiked(e) 
  {
    e.stopPropagation();
    const userId = user.id;

    if (isLiked) 
    {
      const { error } = await supabase.from('liked').delete().eq('user_id', userId).eq('quiz_id', quiz.id);
      if (error) console.error(error);
      setIsLiked(false);
    } 
    else 
    {
      const { error } = await supabase.from('liked').insert({ user_id: userId, quiz_id: quiz.id });
      if (error) console.error(error);
      setIsLiked(true);
    }
  }

  if (!loaded && !isThumbnailEmpty) return <QuizSkeleton url={quiz.thumbnailPath} setIsCardLoaded={setIsCardLoaded} />

  return (
    <div onClick={() => goToPlayer(`?file=${quiz.filePath}&id=${quiz.id}&img=${quiz.thumbnailPath}`)} className='w-full overflow-hidden bg-transparent cursor-pointer hover:translate-y-1 transition-transform duration-75 break-inside-avoid flex flex-col mb-2'>
        <div className='flex-1 bg-dark-secondary rounded-md overflow-hidden'>
            <img src={quiz.thumbnailPath} alt={quiz.title} className="w-full h-full bg-transparent aspect-video object-cover transition-transform duration-200 group-hover:scale-105"/>
        </div>
        <div className='flex justify-between items-center flex-row'>
            <div className='bg-accent-one w-12 flex justify-center items-center aspect-square text-white text-2xl font-extrabold rounded-full'>{getUserNameByFileName(quiz.filePath)[0]}</div>
            <div className='w-full h-full'>
              <div className='flex justify-between items-center px-4 pt-2'>
                <p className='dark:text-light-primary text-dark-primary md:text-md font-extrabold text-wrap text-left'>{getTrimmedTitle() || 'Untitled'}</p>
                <div className='dark:text-light-primary text-dark-primary flex items-center justify-center gap-3'>
                  {
                    canBeEdit ? EditButton(quiz.id,navigate) : LikedButton(isLiked, toggleLiked)
                  }
                </div>
              </div>
              <div className='flex justify-between items-center px-4 pb-2'>
                <p className='dark:text-light-primary text-dark-primary md:text-md text-center text-sm text-wrap'>{getUserNameByFileName(quiz.filePath)}</p>
              </div>
            </div>
        </div>
        
    </div>
  );
}

function LikedButton(isLiked, toggleLiked) 
{
  return isLiked ?
  <AiFillLike onClick={toggleLiked} className='dark:text-white text-dark-primary text-2xl transition-transform duration-200 active:scale-125' />
  : <AiOutlineLike onClick={toggleLiked} className='dark:text-white text-dark-primary text-2xl transition-transform duration-200 active:scale-125' />;
}

function EditButton(id,navigate)
{

  async function EditQuiz(e)
  {
    e.stopPropagation();
    const { data, error } = await supabase.from('quizzes').select().eq('id', id).single();
    if (error) return console.log(error);

    const { data: file, error: fileError } = await supabase.storage.from('quiz').download(data.filePath);
    if (fileError) return console.error(fileError);

    const text = await file.text();
    const quiz = JSON.parse(text);
    navigate('/editor', { state: { quiz } });
  }

  return (
    <FontAwesomeIcon icon={faPenToSquare} onClick={EditQuiz} className='dark:text-white text-dark-primary text-2xl transition-transform duration-200 active:scale-125' />
  );
}

export function QuizSkeleton({ url, setIsCardLoaded }) 
{
  return (
    <div className='w-full aspect-video my-1 bg-light-secondary dark:bg-dark-secondary relative rounded-lg overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform duration-75 animate-pulse'>
      <div className='w-full absolute bottom-0 h-12 bg-accent-one dark:bg-dark-tertiary flex justify-between items-center px-4'>
        <p className='text-light-primary sm:font-semibold md:text-xl text-center'></p>
        <FontAwesomeIcon icon={faShare} className='text-light-primary text-xl' />
        <img src={url} onLoad={() => setIsCardLoaded(true)} className='hidden' />
      </div>
    </div>
  );
}
