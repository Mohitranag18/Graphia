import { useState, useEffect } from "react";
import { get_user_profile_info, toggleFollow } from "../api/endpoints";
import UserPosts from "../components/userPosts";

function UserProfile() {
    const [loading, setLoading] = useState(true)
    const [bio, setBio] = useState('')
    const [profileImage, setProfileImage] = useState('')
    const [followersCount, setFollowersCount] = useState('')
    const [followingsCount, setFollowingsCount] = useState('')

    const [isOurProfile, setIsOurProfile] = useState(false)
    const [following, setFollowing] = useState(false)

    const getUsernameFromUrl = () => {
        const urlSplit = window.location.pathname.split('/');
        return urlSplit[urlSplit.length - 1];
    };

    const [username, setUsername] = useState(getUsernameFromUrl());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await get_user_profile_info(username);
                console.log(data);
                setBio(data?.bio || "No bio available");
                setProfileImage(data.profile_image)
                setFollowersCount(data.follower_count)
                setFollowingsCount(data.following_count)
                setIsOurProfile(data.is_our_profile)
                setFollowing(data.following)
                
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally{
                setLoading(false);
            }
        };
        fetchData();
    }, [username]);

    const handleToggleFollow = async () =>{
        const data = await toggleFollow(username)
        if(data.now_following){
            setFollowersCount(followersCount + 1)
            setFollowing(true)
        } else{
            setFollowersCount(followersCount - 1)
            setFollowing(false)
        }
    }

    return (
        <div className="min-h-screen p-8">
            <div className="flex flex-col gap-4">
                <div className="flex justify-center">
                    <p className="text-2xl font-semibold">{ loading ? '' : `@${username}`}</p>
                </div>
                <div className="flex gap-8">
                    <div className="rounded-full border-2 border-black w-48 h-48 overflow-hidden">
                        <img src={loading ? '' : `http://127.0.0.1:8000/api${profileImage}`} alt="Profile Pic" className="object-cover w-full h-full" />
                    </div>
                    <div className="flex flex-col justify-around">
                        <div className="flex gap-8">
                            <div className="flex flex-col gap-2 items-center">
                                <p className="font-semibold">Follower</p>
                                <p>{loading ? '_' : followersCount}</p>
                            </div>
                            <div className="flex flex-col gap-2 items-center">
                                <p className="font-semibold">Following</p>
                                <p>{loading ? '_' : followingsCount}</p>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            {
                                isOurProfile ?
                                <button className="bg-gray-400 p-2 text-black rounded-lg">Edit</button>
                                :
                                <button onClick={handleToggleFollow} className="bg-blue-500 p-2 text-white rounded-lg">{ following ? "Unfollow" : "Follow"}</button>
                            }
                        </div>
                    </div>
                </div>
                <div><p>{loading ? '' : bio}</p></div>
            </div>
            <div className="mt-8 p-4">
                <UserPosts username={username}/>
            </div>
        </div>
    );
}

export default UserProfile;
