import { FaRegHeart } from "react-icons/fa";

import { FaHeart } from "react-icons/fa";
<FaHeart />

function Post({username, description, formatted_date, like_count}) {
    return ( 
        <>
        <div className="w-64">
            <div className="w-full py-2 px-4 bg-gray-200 border-2 border-gray-400 rounded-t-2xl">
                <p className="text-lg font-semibold">{`@${username}`}</p>
            </div>
            <div className="w-full h-70 p-6 bg-gray-100 border-x-2 border-gray-400 flex justify-center items-center">
                <p className="text-lg">{description}</p>
            </div>
            <div className="w-full py-2 px-4 bg-gray-200 border-2 border-gray-400 flex justify-between rounded-b-2xl">
                <div className="flex gap-2">
                    <button><FaRegHeart /></button>
                    <p>{like_count}</p>
                </div>
                <p>{formatted_date}</p>
            </div>
        </div>
        </>
     );
}

export default Post;