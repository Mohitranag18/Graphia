import { useEffect, useState, useRef } from "react";
import { get_posts } from "../api/endpoints";
import Post from "../components/post";

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nextPage, setNextPage] = useState(1);
    const fetched = useRef(false); 

    const fetchData = async () => {
        try {
            const data = await get_posts(nextPage);
            setPosts((prevPosts) => [...prevPosts, ...data.results]);
            setNextPage(data.next ? nextPage + 1 : null);
        } catch {
            alert("Error getting posts");
        }
    };

    useEffect(() => {
        if (!fetched.current) {  // Ensure it only runs once
            fetched.current = true;
            fetchData().then(() => setLoading(false));
        }
    }, []);
    // useEffect(() => {
    //     const fetchInitialData = async () => {
    //         await fetchData();
    //         setLoading(false);
    //     };
    //     fetchInitialData();
    // }, []);

    const loadMorePosts = () => {
        if (nextPage) {
            fetchData();
        }
    };

    console.log(posts)
    
    return (
        <>
            <div className="min-h-screen flex flex-col justify-center items-center gap-4 my-8">
                {loading ? (
                    <p>Loading....</p>
                ) : posts.length > 0 ? (
                    posts.map((post) => (
                        <Post
                            key={post.id}
                            id={post.id}
                            username={post.username}
                            description={post.description}
                            formatted_date={post.formatted_date}
                            post_image={post.post_image}
                            liked={post.liked}
                            like_count={post.like_count}
                        />
                    ))
                ) : (
                    <p>No posts available</p>
                )}
                <div className="mt-8">
                    {nextPage && posts.length > 0 && !loading && (
                        <button onClick={loadMorePosts} className="p-4 hover:bg-gray-100 rounded-md cursor-pointer">
                            Load More
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}

export default Home;
