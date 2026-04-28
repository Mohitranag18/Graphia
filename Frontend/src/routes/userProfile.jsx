import { useState, useEffect } from "react";
import { get_user_profile_info, toggleFollow, get_followers, get_following } from "../api/endpoints";
import UserPosts from "../components/userPosts";
import { SERVER_URL } from '../api/endpoints';
import { useNavigate, useParams } from "react-router-dom";
import BlankImage from '../assets/blank_profile_picture2.png';
import FollowListModal from '../components/FollowListModal';
import { useToast } from "../context/ToastContext";

let cachedProfiles = {};

function UserProfile() {
    const nav = useNavigate();
    const { username } = useParams();
    const { showToast } = useToast();

    const handleNavigate = (route) => nav(`/${route}`);

    const cachedProfile = cachedProfiles[username];

    const [loading, setLoading] = useState(!cachedProfile);
    const [bio, setBio] = useState(cachedProfile?.bio || '');
    const [profileImage, setProfileImage] = useState(cachedProfile?.profileImage || '');
    const [followersCount, setFollowersCount] = useState(cachedProfile?.followersCount || '');
    const [followingsCount, setFollowingsCount] = useState(cachedProfile?.followingsCount || '');
    const [isOurProfile, setIsOurProfile] = useState(cachedProfile?.isOurProfile || false);
    const [following, setFollowing] = useState(cachedProfile?.following || false);

    // Follow list modal state
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [followersList, setFollowersList] = useState([]);
    const [followingList, setFollowingList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!cachedProfiles[username]) {
                setLoading(true);
            }
            try {
                const data = await get_user_profile_info(username);
                setBio(data?.bio || "No bio available");
                setProfileImage(data.profile_image);
                setFollowersCount(data.follower_count);
                setFollowingsCount(data.following_count);
                setIsOurProfile(data.is_our_profile);
                setFollowing(data.following);

                cachedProfiles[username] = {
                    bio: data?.bio || "No bio available",
                    profileImage: data.profile_image,
                    followersCount: data.follower_count,
                    followingsCount: data.following_count,
                    isOurProfile: data.is_our_profile,
                    following: data.following,
                };
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [username]);

    const handleToggleFollow = async () => {
        const previousFollowing = following;
        const previousCount = followersCount;
        
        setFollowing(!following);
        setFollowersCount(!following ? followersCount + 1 : followersCount - 1);

        try {
            const data = await toggleFollow(username);
            if (data.now_following !== !previousFollowing) {
                setFollowing(data.now_following);
                setFollowersCount(data.now_following ? previousCount + 1 : previousCount);
            }
        } catch (error) {
            setFollowing(previousFollowing);
            setFollowersCount(previousCount);
            showToast("Failed to update follow status.", "error");
        }
    };

    const handleShowFollowers = async () => {
        try {
            const data = await get_followers(username);
            setFollowersList(Array.isArray(data) ? data : []);
            setShowFollowersModal(true);
        } catch (error) {
            console.error("Error fetching followers:", error);
        }
    };

    const handleShowFollowing = async () => {
        try {
            const data = await get_following(username);
            setFollowingList(Array.isArray(data) ? data : []);
            setShowFollowingModal(true);
        } catch (error) {
            console.error("Error fetching following:", error);
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
            <div className="flex flex-col gap-6 w-full max-w-2xl bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 items-center mt-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                <div className="w-full text-center">
                    <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{loading ? '' : `@${username}`}</p>
                </div>
                <div className="flex flex-col md:flex-row gap-10 w-full items-center justify-center">
                    <div className="rounded-full ring-4 ring-indigo-50 shadow-xl w-32 h-32 overflow-hidden shrink-0">
                        <img src={profileImage ? `${profileImage}` : BlankImage} alt="Profile Pic" className="object-cover w-full h-full" />
                    </div>
                    <div className="flex flex-col justify-center items-center w-full max-w-sm gap-6">
                        <div className="flex justify-around w-full">
                            <div className="flex flex-col items-center">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Followers</p>
                                <p onClick={handleShowFollowers} className="text-2xl font-bold text-slate-800 cursor-pointer hover:text-indigo-600 transition-colors">{loading ? '_' : followersCount}</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Following</p>
                                <p onClick={handleShowFollowing} className="text-2xl font-bold text-slate-800 cursor-pointer hover:text-indigo-600 transition-colors">{loading ? '_' : followingsCount}</p>
                            </div>
                        </div>
                        <div className="flex justify-center w-full">
                            {isOurProfile ? (
                                <button onClick={() => handleNavigate('edit/profile')} className="bg-slate-50 hover:bg-slate-100 py-2.5 w-full text-sm font-semibold text-slate-700 rounded-xl cursor-pointer transition-colors border border-slate-200">Edit Profile</button>
                            ) : (
                                <div className="flex flex-col sm:flex-row gap-3 w-full">
                                    <button onClick={handleToggleFollow} className={`py-2.5 w-full text-sm font-semibold text-white rounded-xl cursor-pointer transition-transform hover:-translate-y-0.5 shadow-md ${following ? 'bg-slate-800 hover:bg-slate-900 shadow-slate-800/20' : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:shadow-indigo-500/30'}`}>{following ? "Unfollow" : "Follow"}</button>
                                    <button onClick={() => handleNavigate(`chat/${username}`)} className="bg-white border border-slate-200 hover:bg-slate-50 py-2.5 w-full text-sm font-semibold text-slate-700 rounded-xl cursor-pointer transition-colors shadow-sm">Message</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-full text-center mt-2 px-4">
                    <p className="text-base text-slate-600 leading-relaxed">{loading ? '' : bio}</p>
                </div>
            </div>
            <div className="mt-10 p-4 w-full max-w-6xl">
                <UserPosts username={username} />
            </div>

            {/* Follower/Following Modals */}
            <FollowListModal
                isOpen={showFollowersModal}
                onClose={() => setShowFollowersModal(false)}
                title="Followers"
                users={followersList}
            />
            <FollowListModal
                isOpen={showFollowingModal}
                onClose={() => setShowFollowingModal(false)}
                title="Following"
                users={followingList}
            />
        </div>
    );
}

export default UserProfile;
