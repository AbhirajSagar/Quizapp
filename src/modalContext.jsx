import { createContext, useContext, useState } from 'react'
import AnimatedButton from './components/AnimatedButton'
import { faCheck, faCheckCircle, faClose } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion';
const ModalContext = createContext()

export const useModal = () => useContext(ModalContext)

export const ModalProvider = ({ children }) =>
{
    const [content, setContent] = useState(null)
    const [subContent,setSubContent] = useState(null)

    const showModal = (modalContent,subContent = '') => 
    {
        setContent(modalContent)
        setSubContent(subContent)
    }
    const hideModal = () => setContent(null)

    return (
        <ModalContext.Provider value={{ showModal, hideModal }}>
            {children}
            {content && (
                <motion.div initial={{ opacity: 0, scale: 1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1 }} transition={{ duration: 0.2 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }} className="flex-col p-3 rounded md:w-120 dark:bg-dark-primary shadow-lg bg-white w-full m-2 h-max flex justify-center items-center">
                        <div className='text-sm flex-col font-semibold dark:bg-dark-tertiary bg-light-primary justify-center flex items-center min-h-35 p-2 rounded w-full'>
                            <p className='dark:text-white'>{content[0].toUpperCase() + content.substring(1, content.length)}</p>
                            <p className='text-gray-500 font-normal dark:text-gray-200'>{subContent && subContent[0].toUpperCase() + subContent.substring(1, subContent.length)}</p>
                        </div>
                        <AnimatedButton text='Got it' onClick={hideModal} icon={faCheckCircle} hideTextOnSmallScreens={false} className='w-full justify-center'/>
                    </motion.div>
                </motion.div>
            )}
        </ModalContext.Provider>
    )
}
