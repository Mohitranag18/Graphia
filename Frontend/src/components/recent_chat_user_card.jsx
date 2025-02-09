import { useNavigate } from "react-router-dom";
import { PiChatTeardropDotsLight } from "react-icons/pi";
import { get_user_profile_info } from "../api/endpoints";
import {SERVER_URL} from '../api/endpoints'
import BlankImage from '../assets/blank_profile_picture2.png'
import React, { useEffect, useState } from 'react';


function RecentChatUserCard({username, group_name}) {

    const [bio, setBio] = useState('')
    const [profileImage, setProfileImage] = useState('')

    const nav = useNavigate();

    const handleNavigate = (route) => {
        nav(`${route}`)
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await get_user_profile_info(username)
                setBio(data?.bio || "No bio available");
                setProfileImage(data.profile_image)
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchData();
    }, [username]);

    return ( 
        <>
        <div className=" flex justify-between rounded-md bg-gray-100 w-full h-20 border-2 border-gray-200">
            <div className="flex items-center gap-4 overflow-hidden p-2 px-4">
                <div>
                    {
                        profileImage ?
                        <img src={`${SERVER_URL}${profileImage}`} alt="DP" className='h-12 w-12 object-cover object-top rounded-full border-2 border-gray-400' />
                        :
                        <img src={BlankImage} className='h-12 w-12 object-cover rounded-full border-2 border-gray-400'/>
                    }
                </div>
                <div className="flex flex-col">
                    <h3 onClick={(route) => handleNavigate(`/user/${username}`)}  className="font-semibold text-lg mt-0 cursor-pointer">{username}</h3>
                    <p>{bio}</p>
                </div>
            </div>
            <div onClick={(route) => handleNavigate(`/chat/${username}`)} className="w-14 bg-blue-200 p-2 text-2xl font-semibold rounded-sm flex items-center justify-center cursor-pointer hover:bg-gray-200"><PiChatTeardropDotsLight /></div>
        </div>
        </>
     );
}

export default RecentChatUserCard;