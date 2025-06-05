import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function AnimatedButton({text = '', icon, onClick, hoverEffect = true,hideTextOnSmallScreens = true,disabled = false,className = '',iconAnim = 'none', layout = 'vertical'})
{
    const [isHovered, setIsHovered] = useState(false)
    const handleHover = (value) => hoverEffect && setIsHovered(value);

    const textClasses = `${hideTextOnSmallScreens ? 'hidden sm:inline' : 'ml-2'} ${text.length > 1 ? 'sm:ml-2' : ''}`.trim();

    return (
        <button onClick={() => onClick(1)} onMouseEnter={() => handleHover(true)} onMouseLeave={() => handleHover(false)} className={`bg-accent-one ${layout === 'vertical' ? 'mt-2' : 'm-0 max-h-[95%] -translate-y-0.5'} shadow-blue-600 dark:shadow-dark-tertiary dark:bg-dark-secondary hover:bg-blue-900 transition-colors duration-150 hover:drop-shadow-md p-3 flex items-center text-white rounded text-sm font-semibold cursor-pointer shadow-[0px_5px_0px_0px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px] ${className}`} disabled={disabled}>
            <FontAwesomeIcon icon={icon} className='text-lg' bounce={hoverEffect && isHovered} spin={iconAnim === 'spin'}/>
            <span className={textClasses}>{text}</span>
        </button>
    )
}
