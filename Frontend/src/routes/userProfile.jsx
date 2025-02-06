import { useState, useEffect } from "react";
import { get_user_profile_info, toggleFollow } from "../api/endpoints";
import UserPosts from "../components/userPosts";
import {SERVER_URL} from '../api/endpoints'
import { useNavigate } from "react-router-dom";
import BlankImage from '../assets/blank_profile_picture2.png'

function UserProfile() {
    const nav = useNavigate();

    const handleNavigate = (route) => {
        nav(`/${route}`)
    }

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
        <div className="min-h-screen p-8 w-screen flex flex-col items-center">
            <div className="flex flex-col gap-6 w-[80%]">
                <div>
                    <p className="text-4xl font-semibold">{ loading ? '' : `@${username}`}</p>
                </div>
                <div className="flex gap-8">
                    <div className="rounded-full border-2 border-black w-38 h-38 overflow-hidden">
                        {
                            profileImage ?
                            <img src={loading ? '' : `${SERVER_URL}${profileImage}`} alt="Profile Pic" className="object-cover w-full h-full" />
                            :
                            <img src={BlankImage} alt="Profile Pic" className="object-cover w-full h-full" />
                        }
                        
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
                        <div className="flex justify-center w-full">
                            {
                                isOurProfile ?
                                <button onClick={(route) => handleNavigate('edit/profile')} className="bg-gray-400 p-2 py-1 w-full text-lg text-black rounded-lg">Edit</button>
                                :
                                <div>
                                <button onClick={handleToggleFollow} className="bg-blue-500 p-2 py-1 w-full text-lg text-white rounded-lg">{ following ? "Unfollow" : "Follow"}</button>
                                <button onClick={(route) => handleNavigate(`chatPrivate/${username}`)} className="bg-gray-400 p-2 py-1 w-full text-lg text-black rounded-lg">Message</button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div><p>{loading ? '' : bio}</p></div>
            </div>
            <div className="mt-8 p-4 w-[80%]">
                <UserPosts username={username}/>
            </div>
        </div>
    );
}

export default UserProfile;
