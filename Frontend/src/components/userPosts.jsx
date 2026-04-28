import { useEffect, useState } from "react";
import { get_users_posts } from "../api/endpoints";
import Post from "./post";
import { useToast } from "../context/ToastContext";
import Loader from "./Loader";

let cachedUserPosts = {};

function UserPosts({username}) {
    const cachedPosts = cachedUserPosts[username];
    const [posts, setPosts] = useState(cachedPosts || [])
    const [loading, setLoading] = useState(!cachedPosts)
    const { showToast } = useToast()

    useEffect(()=>{
        const fetchPosts = async () => {
            if (!cachedUserPosts[username]) {
                setLoading(true)
            }
            try{
                const fetchedPosts = await get_users_posts(username)
                if (JSON.stringify(cachedUserPosts[username]) !== JSON.stringify(fetchedPosts)) {
                    setPosts(fetchedPosts)
                    cachedUserPosts[username] = fetchedPosts;
                }
            }catch{
                showToast('Failed to load posts.', 'error')
            } finally{
                setLoading(false)
            }
        }
        fetchPosts()
    }, [username])

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