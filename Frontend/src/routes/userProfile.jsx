import { useState, useEffect } from "react";
import { get_user_profile_info, toggleFollow } from "../api/endpoints";
import UserPosts from "../components/userPosts";
import { SERVER_URL } from '../api/endpoints';
import { useNavigate } from "react-router-dom";
import BlankImage from '../assets/blank_profile_picture2.png';

function UserProfile() {
    const nav = useNavigate();

    const handleNavigate = (route) => nav(`/${route}`);

    const [loading, setLoading] = useState(true);
    const [bio, setBio] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [followersCount, setFollowersCount] = useState('');
    const [followingsCount, setFollowingsCount] = useState('');
    const [isOurProfile, setIsOurProfile] = useState(false);
    const [following, setFollowing] = useState(false);

    const getUsernameFromUrl = () => window.location.pathname.split('/').pop();

    const [username, setUsername] = useState(getUsernameFromUrl());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await get_user_profile_info(username);
                setBio(data?.bio || "No bio available");
                setProfileImage(data.profile_image);
                setFollowersCount(data.follower_count);
                setFollowingsCount(data.following_count);
                setIsOurProfile(data.is_our_profile);
                setFollowing(data.following);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [username]);

    const handleToggleFollow = async () => {
        const data = await toggleFollow(username);
        if (data.now_following) {
            setFollowersCount(followersCount + 1);
            setFollowing(true);
        } else {
            setFollowersCount(followersCount - 1);
            setFollowing(false);
        }
    };

    return (
        <div className="min-h-screen p-8 flex flex-col items-center">
            <div className="flex flex-col gap-6 w-full max-w-lg md:max-w-full items-start md:items-center md:px-16">
                <div className="w-full">
                    <p className="text-4xl font-semibold">{loading ? '' : `@${username}`}</p>
                </div>
                <div className="flex flex-col md:flex-row gap-8 w-full">
                    <div className="rounded-full border-2 border-black w-32 h-32 overflow-hidden">
                        <img src={profileImage ? `${SERVER_URL}${profileImage}` : BlankImage} alt="Profile Pic" className="object-cover w-full h-full" />
                    </div>
                    <div className="flex flex-col justify-around items-center w-full md:w-lg">
                        <div className="flex justify-evenly w-full">
                            <div className="flex flex-col gap-2 items-center">
                                <p className="font-semibold">Follower</p>
                                <p>{loading ? '_' : followersCount}</p>
                            </div>
                            <div className="flex flex-col gap-2 items-center">
                                <p className="font-semibold">Following</p>
                                <p>{loading ? '_' : followingsCount}</p>
                            </div>
                        </div>
                        <div className="flex justify-center w-full mt-4">
                            {isOurProfile ? (
                                <button onClick={() => handleNavigate('edit/profile')} className="bg-gray-400 p-2 py-1 w-full text-lg text-black rounded-lg cursor-pointer">Edit</button>
                            ) : (
                                <div className="flex flex-col gap-2 w-full">
                                    <button onClick={handleToggleFollow} className="bg-blue-500 p-2 py-1 w-full text-lg text-white rounded-lg cursor-pointer">{following ? "Unfollow" : "Follow"}</button>
                                    <button onClick={() => handleNavigate(`chat/${username}`)} className="bg-gray-400 p-2 py-1 w-full text-lg text-black rounded-lg cursor-pointer">Message</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <p className="text-lg">{loading ? '' : bio}</p>
                </div>
            </div>
            <div className="mt-8 p-4 w-full max-w-lg md:max-w-full">
                <UserPosts username={username} />
            </div>
        </div>
    );
}

export default UserProfile;
