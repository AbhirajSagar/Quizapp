import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function AnimatedButton({
    text = '',
    icon,
    onClick,
    height = 'h-10',
    width = 'w-auto',
    hoverEffect = true,
    hideTextOnSmallScreens = true,
    disabled = false,
    className = '',
    spinIcon = false,
    justify = 'justify-center',
    ...props
})
{
    const [isHovered, setIsHovered] = useState(false)

    const handleHover = (value) =>
    {
        if (hoverEffect)
        {
            setIsHovered(value)
        }
    }

    const buttonClasses = `
        bg-accent-one ${width} ${height} px-3 dark:bg-dark-secondary md:px-4 flex items-center rounded
        text-light-primary text-xs cursor-pointer font-bold text-nowrap ${justify} m-0.5 my-2 mb-3 disabled:opacity-50 disabled:cursor-not-allowed dark:shadow-dark-tertiary shadow-blue-600 transition-all duration-100 ease-linear shadow-[0px_5px_0px_0px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px]
        ${hoverEffect ? 'hover:bg-accent-two transition-colors duration-150 hover:drop-shadow-md' : ''}
        shadow-accent-two ${className}
    `.trim()

    const textClasses = `
        ${hideTextOnSmallScreens ? 'hidden sm:inline' : 'ml-2'}
        ${text.length > 1 ? 'sm:ml-2' : ''}
    `.trim()

    return (
        <button
            onClick={() => onClick(1)}
            onMouseEnter={() => handleHover(true)}
            onMouseLeave={() => handleHover(false)}
            className={buttonClasses}
            disabled={disabled}
            {...props}
        >
            <FontAwesomeIcon icon={icon} className='text-lg' bounce={hoverEffect && isHovered} spin={spinIcon}/>
            <span className={textClasses}>{text}</span>
        </button>
    )
}
