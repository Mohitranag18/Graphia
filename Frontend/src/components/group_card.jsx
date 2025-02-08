import { useNavigate } from "react-router-dom";

function GroupCard({id, group_name, slug, description}) {

    const nav = useNavigate();

    const handleNavigate = (route) => {
        nav(`${route}`)
    }

    return (
        <>
        <div onClick={(route) => handleNavigate(`/chatroom/${slug}/info`)} className="flex flex-col justify-center rounded-md bg-gray-100 p-2 px-4 w-86 h-20 overflow-hidden border-2 border-black cursor-pointer hover:bg-gray-200">
            <h3 className="font-bold text-lg">{group_name}</h3>
            <p className="text-gray-800">{description}</p>
        </div>
        </>
     );
}

export default GroupCard;