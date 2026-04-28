import { useEffect, useState, useRef } from "react";
import { get_posts } from "../api/endpoints";
import Post from "../components/post";
import { useToast } from "../context/ToastContext";
import Loader from "../components/Loader";

let cachedPosts = [];
let cachedNextPage = 1;

function Home() {
    const [posts, setPosts] = useState(cachedPosts);
    const [loading, setLoading] = useState(cachedPosts.length === 0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [nextPage, setNextPage] = useState(cachedNextPage);
    const fetched = useRef(false);
    const observerTarget = useRef(null);
    const { showToast } = useToast();

    // Use refs to access latest state inside observer without recreating it
    const stateRefs = useRef({ loading, loadingMore, nextPage });
    useEffect(() => {
        stateRefs.current = { loading, loadingMore, nextPage };
    }, [loading, loadingMore, nextPage]);

    const fetchData = async () => {
        if (loadingMore) return;
        if (nextPage !== 1) setLoadingMore(true);
        try {
            const data = await get_posts(nextPage);
            setPosts((prevPosts) => {
                const newPosts = [...prevPosts, ...data.results];
                cachedPosts = newPosts;
                return newPosts;
            });
            const newNext = data.next ? nextPage + 1 : null;
            setNextPage(newNext);
            cachedNextPage = newNext;
        } catch {
            showToast("Failed to load posts. Please try again.", "error");
        } finally {
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (!fetched.current) {  // Ensure it only runs once
            fetched.current = true;
            if (cachedPosts.length === 0) {
                fetchData().then(() => setLoading(false));
            } else {
                setLoading(false);
            }
        }
    }, []);
    useEffect(() => {
        let observer;
        const timeout = setTimeout(() => {
            observer = new IntersectionObserver(
                entries => {
                    const { loading, loadingMore, nextPage } = stateRefs.current;
                    if (entries[0].isIntersecting && nextPage && !loadingMore && !loading) {
                        fetchData();
                    }
                },
                { rootMargin: "100px" }
            );

            if (observerTarget.current) {
                observer.observe(observerTarget.current);
            }
        }, 500);

        return () => {
            clearTimeout(timeout);
            if (observer && observerTarget.current) observer.unobserve(observerTarget.current);
        };
    }, []); // Empty dependency array so it only runs once per mount

    console.log(posts)
    
    return (
        <>
            <div className="min-h-screen flex flex-col items-center pt-8 pb-16 px-4 bg-slate-50">
                {loading ? (
                    <Loader />
                ) : posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center w-full max-w-7xl">
                        {posts.map((post) => (
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
                        ))}
                    </div>
                ) : (
                    <p>No posts available</p>
                )}
                <div ref={observerTarget} className="mt-8 w-full flex justify-center h-16">
                    {loadingMore && <Loader />}
                </div>
            </div>
        </>
    );
}

export default Home;
