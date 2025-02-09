import { useNavigate } from "react-router-dom";
import { PiChatTeardropDotsLight } from "react-icons/pi";



function GroupCard({id, group_name, slug, description}) {

    const nav = useNavigate();

    const handleNavigate = (route) => {
        nav(`${route}`)
    }

    return (
        <>
        <div className=" flex justify-between rounded-md bg-gray-100 w-full h-20 border-2 border-gray-200">
            <div className="flex flex-col justify-center overflow-hidden p-2 px-4">
                <h3 className="font-semibold text-lg">{group_name}</h3>
                <p className="text-gray-800">{description}</p>
            </div>
            <div onClick={(route) => handleNavigate(`/chatroom/${slug}/info`)} className="w-14 bg-blue-200 p-2 text-2xl font-semibold rounded-sm flex items-center justify-center cursor-pointer hover:bg-gray-200"><PiChatTeardropDotsLight /></div>
        </div>
        </>
     );
}

export default GroupCard;