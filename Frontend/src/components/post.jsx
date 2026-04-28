import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {SERVER_URL} from '../api/endpoints'
import { useToast } from "../context/ToastContext";

import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { toggleLike } from "../api/endpoints";


function Post({id, username, description, formatted_date, post_image, liked, like_count}) {

    const nav = useNavigate();
    const { showToast } = useToast();

    const handleNavigate = (route) => {
        nav(`${route}`)
    }

    const [clientLiked, setClientLiked] = useState(liked)
    const [clientLikeCount, setClientLikeCount] = useState(like_count)

    const handleToggleLike = async () =>{
        const previousLiked = clientLiked;
        const previousCount = clientLikeCount;
        
        setClientLiked(!clientLiked);
        setClientLikeCount(!clientLiked ? clientLikeCount + 1 : clientLikeCount - 1);
        
        try {
            const data = await toggleLike(id)
            if (data.now_liked !== !previousLiked) {
                setClientLiked(data.now_liked)
                setClientLikeCount(data.now_liked ? previousCount + 1 : previousCount)
            }
        } catch (error) {
            setClientLiked(previousLiked);
            setClientLikeCount(previousCount);
            showToast("Failed to toggle like.", "error");
        }
    }

    return ( 
        <>
        <div className="w-[320px] max-w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100/50">
            <div className="w-full py-3 px-5 flex justify-between items-center bg-white">
                <p onClick={() => handleNavigate(`/user/${username}`)} className="text-sm font-semibold cursor-pointer text-slate-800 hover:text-indigo-600 transition-colors">{`@${username}`}</p>
                <p className="text-xs text-slate-400 font-medium">{formatted_date}</p>
            </div>
            <div className="w-full aspect-square bg-slate-50 flex flex-col justify-center items-center overflow-hidden">
                {
                    post_image ? 
                    <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" src={post_image} alt="Post Image" /> :
                    <div className="text-slate-300 text-sm">No Image</div>
                }
            </div>
            <div className="w-full py-4 px-5 bg-white flex flex-col justify-between">
                <div className="mb-3 flex justify-between overflow-hidden">
                    <p className="text-sm text-slate-700 leading-relaxed">{description.length > 50 ? `${description.slice(0, 50)}...` : description}</p>
                </div>
                <div className="flex justify-between items-center mt-1">
                    <div className="flex gap-2 items-center">
                        <div className="cursor-pointer text-red-500 hover:scale-125 transition-transform duration-200 active:scale-95">
                            {
                                clientLiked ?
                                <FaHeart onClick={handleToggleLike} className="drop-shadow-sm" />
                                :
                                <FaRegHeart onClick={handleToggleLike} />
                            }
                        </div>
                        <p className="text-sm font-medium text-slate-600">{clientLikeCount}</p>
                    </div>
                    <p onClick={() => handleNavigate(`/post/${id}`)} className="text-xs font-semibold text-indigo-500 cursor-pointer hover:text-indigo-700 transition-colors bg-indigo-50 px-3 py-1.5 rounded-full">View Post</p>
                </div>
            </div>
        </div>
        </>
     );
}

export default Post;