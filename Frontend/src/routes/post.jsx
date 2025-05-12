import { useState, useEffect } from "react";
import {SERVER_URL, create_comment} from '../api/endpoints'
import { get_comments, get_post_byId } from "../api/endpoints";
import { useNavigate } from "react-router-dom";

import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { toggleLike } from "../api/endpoints";

function PostDetails() {
    const nav = useNavigate();

    const handleNavigate = (route) => {
        nav(`${route}`)
    }

    const[loading, setLoading] = useState(true)
    const[loadingComment, setLoadingComment] = useState(true)

    const[id, setId] = useState("")
    const[username, setUsername] = useState("")
    const[description, setDescription] = useState("")
    const[formattedDate, setFromattedDate] = useState("")
    const[postImage, setPostImage] = useState("")
    const[liked, setLiked] = useState(false)
    const[likeCount, setLikeCount] = useState("")

    const [comments, setComments] = useState("")

    const [content, setContent] = useState("")

    const getUsernameFromUrl = () => {
        const urlSplit = window.location.pathname.split('/');
        return urlSplit[urlSplit.length - 1];
    };

    const [postId, setPostId] = useState(getUsernameFromUrl());

    const fetchPostData = async () => {
        try {
            const data = await get_post_byId(postId)
            setUsername(data.username)
            setDescription(data.description)
            setFromattedDate(data.formatted_date)
            setPostImage(data.post_image)
            setLikeCount(data.like_count)
            setLiked(data.liked)
        } catch (error) {
            console.error("Error in fetching post's data:", error);
        } finally{
            setLoading(false);
        }
    };
    const fetchPostComments = async () => {
        try {
            const data = await get_comments(postId)
            setComments(data)
            console.log(data)
        } catch (error) {
            console.error("Error in fetching post's data:", error);
        } finally{
            setLoadingComment(false);
        }
    };
    useEffect(()=>{
        fetchPostData()
        fetchPostComments()
    },[])

    const createComment = async () => {
        try {
            const data = await create_comment(content, postId)
            console.log(data)
            setComments((prev) => [{
                  content: data.content,
                  created_at: data.created_at,
                  formatted_date: data.formatted_date,
                  id: data.id,
                  user: data.user,
                  post: data.post,
                }, ...prev]);
        } catch (error) {
            console.error("Error in adding comment:", error);
        }finally{
            setContent("")
        }
    };

    const handleToggleLike = async () =>{
        const data = await toggleLike(postId)
        if (data.now_liked){
            setLiked(true)
            setLikeCount(likeCount + 1)
        } else{
            setLiked(false)
            setLikeCount(likeCount - 1)
        }
    }

  return (
    <>
        <div className="min-h-screen flex flex-col gap-8 justify-center items-center my-8 md:gap-18 lg:flex-row">
            {/* left box */}
            <div className="flex flex-col items-center lg:mt-0 gap-4">
                <div className='h-full w-88 flex flex-col gap-4'>
                    <div className="flex flex-col border-2 border-gray-300 rounded-2xl max-h-160 h-160">
                        <div className="w-full h-10 py-2 px-4 flex justify-between items-center">
                            <p onClick={(route) => handleNavigate(`/user/${username}`)} className="text-lg font-semibold cursor-pointer">{`@${username}`}</p>
                            <p>{formattedDate}</p>
                        </div>

                        <div className="flex flex-col gap-4 h-110">
                            <div className="w-full h-full">
                                <div className="w-full h-110 flex flex-col justify-center items-center overflow-hidden border-y-2 border-gray-300">
                                    {
                                        postImage && 
                                        <img className="h-full w-full object-cover" src={postImage} alt="Post Image" />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-40 py-2 px-4 flex justify-center items-start">
                            <div className="flex flex-col gap-1 items-center justify-between">
                                <div className="flex gap-2 items-center">
                                    <div className="cursor-pointer text-red-600">
                                        {
                                            liked ?
                                            <FaHeart onClick={handleToggleLike} />
                                            :
                                            <FaRegHeart onClick={handleToggleLike} />
                                        }
                                    </div>
                                    <p>{likeCount}</p>
                                </div>
                                <p className="text-md">{description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* right box */}
            <div className="flex flex-col items-center lg:mt-0 gap-4">
                <div className='h-full w-88 lg:w-112 flex flex-col gap-4'>
                    <div className="flex flex-col border-2 border-gray-300 rounded-2xl p-6 min-h-160 h-160">
                        <div className="w-fullflex flex-col justify-between">
                            <h1 className="mb-2 text-lg font-bold w-full">Add Comment</h1>
                            <input value={content} onChange={(e)=>setContent(e.target.value)} className="mb-2 w-full bg-gray-200 rounded-lg p-2"></input>
                            <button onClick={createComment} className="mb-2 w-full bg-blue-600 cursor-pointer rounded-sm p-2 text-white">Submit</button>
                        </div>
                        <h1 className="text-lg font-bold w-full mb-2">Comments</h1>
                        <div className="flex flex-col gap-4 h-112 overflow-hidden overflow-y-auto custom-scrollbar">
                        {
                            loadingComment ? (
                                <p>Loading Comments</p>
                            ): !loadingComment && comments.length > 0 ? (
                            comments.map((comment) => (
                                <div key={comment.id} className="bg-gray-200 rounded-xl p-2 px-4">
                                    <div className="flex justify-between">
                                        <h1 className="font-bold">{comment.user}</h1>
                                        <p className="text-gray-500 text-sm">{comment.formatted_date}</p>
                                    </div>
                                    <p>{comment.content}</p>
                                </div>
                            ))) : (
                                <p>No Comments available on this post</p>
                            ) 
                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default PostDetails