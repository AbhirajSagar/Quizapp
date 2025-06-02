import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

export default function Loader({showError = false})
{
    return (
        <div className="w-full h-full min-h-65 flex justify-center items-center">
            {
                showError ? <FontAwesomeIcon icon={faCircleExclamation} className="text-4xl text-red-500"/> : <div className="loader"></div>
            }
        </div>
    );
}

