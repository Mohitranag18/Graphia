import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {SERVER_URL} from '../api/endpoints'

import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { toggleLike } from "../api/endpoints";


function Post({id, username, description, formatted_date, post_image, liked, like_count}) {

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
            <div className="w-full py-2 px-4 bg-gray-200 border-2 border-gray-300 rounded-t-2xl flex justify-between">
                <p onClick={(route) => handleNavigate(`/user/${username}`)} className="text-lg font-semibold cursor-pointer">{`@${username}`}</p>
                <p>{formatted_date}</p>
            </div>
            <div className="w-full h-70 bg-gray-100 border-x-2 border-gray-300 flex flex-col justify-center items-center overflow-hidden">
                {
                    post_image && 
                    <img className="h-full w-full object-cover" src={`${SERVER_URL}${post_image}`} alt="Post Image" />
                }
            </div>
            <div className="w-full py-2 px-4 bg-gray-200 border-2 border-gray-300 flex flex-col justify-between rounded-b-2xl">
                <div className="mb-2 flex justify-between overflow-hidden">
                    <p className="text-lg">{description.length > 25 ? `${description.slice(0, 25)}...` : description}</p>
                </div>
                <div className="flex justify-between">
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
                    <p onClick={() => handleNavigate(`/post/${id}`)} className="text-md font-semibold text-blue-600 cursor-pointer">View Post</p>
                </div>
            </div>
        </div>
        </>
     );
}

export default Post;