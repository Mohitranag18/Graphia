import { useEffect, useState } from "react";
import { get_users_posts } from "../api/endpoints";
import Post from "./post";
import { useToast } from "../context/ToastContext";
import Loader from "./Loader";

function UserPosts({username}) {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const { showToast } = useToast()

    useEffect(()=>{
        const fetchPosts = async () => {
            try{
                const posts = await get_users_posts(username)
                setPosts(posts)
            }catch{
                showToast('Failed to load posts.', 'error')
            } finally{
                setLoading(false)
            }
        }
        fetchPosts()
    }, [])

    return ( 
        <>
        <div className="flex flex-wrap justify-evenly gap-10">
            {loading ?
                <Loader />
            :
                posts.map((post) => {
                    return <Post key={post.id} id={post.id} username={post.username} description={post.description} formatted_date={post.formatted_date} post_image={post.post_image} liked={post.liked} like_count={post.like_count}></Post>
                })
            }
        </div>
        </>
     );
}

export default UserPosts