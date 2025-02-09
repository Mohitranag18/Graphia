import React, { useEffect, useState } from 'react';
import { IoSearchSharp } from "react-icons/io5";
import { get_recent_private_chats } from "../api/endpoints";
import RecentChatUserCard from './recent_chat_user_card';

function RecentChat() {

    const [recentChats, setRecentChat] = useState([])
    const [loading, setLoading] = useState(true)
    const [query, setQuery] = useState('')

    useEffect(() => {
        const fetchRecentGroups = async () => {
            try{
                const data = await get_recent_private_chats(query)
                setRecentChat(data)
            }catch{
                alert('error getting recent chat list')
            } finally{
                setLoading(false)
            }
            }
            fetchRecentGroups()
    },[])

    const handleSearch = async () => {
        try{
            const data = await get_recent_private_chats(query)
            setRecentChat(data)
        }catch{
            alert('error getting recent chat list 2')
        }
    }

    return ( 
        <>
        <div className='h-112 w-112'>
        <div className='flex flex-col gap-4'>
            <h2 className="text-2xl font-bold">Recent Chats</h2>
            <div className='flex items-center gap-2'>
                <input onChange={(e) => setQuery(e.target.value)} className='bg-gray-100 rounded-sm p-2 w-full border-1 border-gray-300'
                    type="text"
                    required
                />
                <div onClick={handleSearch} className='bg-gray-200 p-2 text-2xl rounded-sm cursor-pointer'><IoSearchSharp /></div>
            </div>
            <div className='flex flex-col gap-4 border-2 border-gray-300 rounded-2xl p-6 h-96'>
                {
                    recentChats.map((chat)=>{
                        return <RecentChatUserCard username={chat.users.username} group_name={chat.group_name}/>
                    })
                }
            </div>
        </div>
        </div>
        </>
     );
}

export default RecentChat;