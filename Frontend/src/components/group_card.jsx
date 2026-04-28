import { useNavigate } from "react-router-dom";
import { PiChatTeardropDotsLight } from "react-icons/pi";



function GroupCard({id, group_name, slug, description}) {

    const nav = useNavigate();

    const handleNavigate = (route) => {
        nav(`${route}`)
    }

    return (
        <>
        <div className="flex justify-between rounded-2xl bg-white w-full h-24 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group">
            <div className="flex flex-col justify-center overflow-hidden p-3 px-5 w-full">
                <h3 className="font-bold text-lg text-slate-800 tracking-tight">{group_name}</h3>
                <p className="text-slate-500 text-sm truncate">{description}</p>
            </div>
            <div onClick={() => handleNavigate(`/chatroom/${slug}/info`)} className="w-16 bg-indigo-50 text-indigo-600 p-2 text-2xl font-semibold flex items-center justify-center cursor-pointer transition-colors duration-300 group-hover:bg-indigo-600 group-hover:text-white"><PiChatTeardropDotsLight className="transition-transform group-hover:scale-110" /></div>
        </div>
        </>
     );
}

export default GroupCard;