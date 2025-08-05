import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import { QuizCard } from '../components/QuizCard'
import { useAuth } from '../authContext'
import { supabase } from '../supabaseClient'
import { motion, AnimatePresence } from "framer-motion"

export default function Search()
{
    const { user } = useAuth()

    const [search, setSearch] = useState('')
    const [searching, setIsSearching] = useState('idle')
    const [searchItems, setSearchItems] = useState([])

    useEffect(() =>
    {
        const timeout = setTimeout(() =>
        {
            updateSearch(search)
        }, 500)

        return () => clearTimeout(timeout)
    }, [search])

    async function updateSearch(value)
    {
        const cleaned = value.trim()
        if (cleaned === '')
        {
            setSearchItems([])
            setIsSearching('idle')
            return
        }

        setIsSearching('searching')

        const { data: quizzes, error } = await supabase.from('quizzes').select('*, profiles!inner(username), tags(name)').textSearch('search_text', cleaned, { type: 'websearch' })

        if (!error && quizzes && quizzes.length > 0)
        {
            setSearchItems(quizzes)
            setIsSearching('found')
            return
        }

        const { data: tagQuizzes } = await supabase
            .from('quizzes')
            .select('*, profiles!inner(username), tags(name)')
            .filter('tags.name', 'ilike', `${cleaned}%`)

        const { data: userQuizzes } = await supabase
            .from('quizzes')
            .select('*, profiles!inner(username), tags(name)')
            .filter('profiles.username', 'ilike', `${cleaned}%`)

        const combined = [...(tagQuizzes || []), ...(userQuizzes || [])]
        const unique = Array.from(new Map(combined.map(q => [q.id, q])).values())

        if (unique.length === 0)
        {
            setSearchItems([])
            setIsSearching('notfound')
            return
        }

        setSearchItems(unique)
        setIsSearching('found')
    }

    return (
        <div className='p-20 px-6 sm:px-15 bg-dark-primary min-h-[100vh]'>
            <SearchSection search={search} setSearch={setSearch} heading={'Find your quiz'} subheading={'Search by tags, title, description or creator'} />
            <div className="w-full grid md:grid-cols-3 gap-4 py-10">
                <AnimatePresence>
                    {searching === 'searching' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-white col-span-full">
                            Searching...
                        </motion.div>
                    )}
                    {searching === 'notfound' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-white col-span-full">
                            No quizzes found.
                        </motion.div>
                    )}
                    {searchItems.map((quiz, index) => (
                        <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                            <QuizCard quiz={quiz} user={user} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}

function SearchSection({ search, setSearch, heading, subheading })
{
    const [hovering, setIsHovering] = useState(false)

    return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full bg-primary-secondary p-1 pt-3 md:p-4">
            <div className='w-full py-6 bg-gradient-to-r from-accent-one via-light-tertiary to-accent-one dark:from-dark-secondary dark:via-dark-tertiary dark:to-dark-secondary rounded-lg flex flex-col items-center'>
                {heading && <h2 className='text-center dark:text-white font-bold md:text-2xl text-sm'>{heading}</h2>}
                {subheading && <h2 className='text-center dark:text-white md:text-lg text-xs text-dark-primary mb-4'>{subheading}</h2>}

                <div onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)} className='md:m-2 p-[2px] md:w-[60%] w-[95%] rounded-2xl hover:bg-gradient-to-r dark:from-pink-500 dark:via-purple-500 dark:to-indigo-500 from-blue-600 via-sky-400 to-blue-950'>
                    <div className='p-3 px-5 cursor-text rounded-2xl flex justify-between items-center bg-light-primary dark:bg-dark-primary h-9 md:h-18'>
                        <FontAwesomeIcon bounce={hovering} icon={faSearch} className='md:text-2xl text-xl text-dark-secondary dark:text-white mr-2' />
                        <input type='search' aria-label='Search Quizzes' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search Topics..' className='bg-transparent outline-none text-dark-secondary dark:text-white md:text-lg text-sm w-full pl-2' />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
