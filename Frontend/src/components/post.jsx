import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";

import { FaHeart } from "react-icons/fa";
import { toggleLike } from "../api/endpoints";


function Post({id, username, description, formatted_date, liked, like_count}) {

    const nav = useNavigate();

    const handleNavigate = (route) => {
        nav(`${route}`)
    }

    const [clientLiked, setClientLiked] = useState(liked)
    const [clientLikeCount, setClientLikeCount] = useState(like_count)

    const handleToggleLike = async () =>{
        const data = await toggleLike(id)
        if (data.now_liked){
            setClientLiked(true)
            setClientLikeCount(clientLikeCount + 1)
        } else{
            setClientLiked(false)
            setClientLikeCount(clientLikeCount - 1)
        }
    }

    return ( 
        <>
        <div className="w-74">
            <div className="w-full py-2 px-4 bg-gray-200 border-2 border-gray-300 rounded-t-2xl">
                <p onClick={(route) => handleNavigate(`/user/${username}`)} className="text-lg font-semibold cursor-pointer">{`@${username}`}</p>
            </div>
            <div className="w-full h-70 p-6 bg-gray-100 border-x-2 border-gray-300 flex justify-center items-center">
                <p className="text-lg">{description}</p>
            </div>
            <div className="w-full py-2 px-4 bg-gray-200 border-2 border-gray-300 flex justify-between rounded-b-2xl">
                <div className="flex gap-2 items-center">
                    <div className="cursor-pointer text-red-600">
                        {
                            clientLiked ?
                            <FaHeart onClick={handleToggleLike} />
                            :
                            <FaRegHeart onClick={handleToggleLike} />
                        }
                    </div>
                    <p>{clientLikeCount}</p>
                </div>
                <p>{formatted_date}</p>
            </div>
        </div>
        </>
     );
}

export default Post;