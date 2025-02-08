import { useEffect, useState } from "react";
import { get_group_details, join_group, leave_group } from "../api/endpoints";
import { useNavigate } from "react-router-dom";


function GroupInfo() {

    const nav = useNavigate();

    const handleNavigate = (route) => {
        nav(`${route}`)
    }

    const storage = JSON.parse(localStorage.getItem('userData'))
    const [username, setUsername] = useState(storage ? storage.username : '')

    const getGroupNameFromUrl = () => {
        const urlSplit = window.location.pathname.split('/');
        return urlSplit[urlSplit.length - 2];
    };

    const [groupName, setGroupName] = useState(getGroupNameFromUrl());
    const [groupDetails, setGroupDetails] = useState([])

    const [members, setMembers] = useState([])

    useEffect(() => {
        const fetchMessages = async () => {
          try {
            const data = await get_group_details(groupName);
            setGroupDetails(data);
            setMembers(data.users_online)
          } catch (error) {
            console.error("Failed to fetch group details:", error);
          }
        };
        fetchMessages();
    }, [groupName]);

    const isMember = members.includes(username);

    const handleJoinGroup = async () => {
        try {
          const data = await join_group(groupDetails.id);
          console.log(data);
          setMembers((prevMembers) => [...prevMembers, username]); // Update local state
    } catch (error) {
        console.error("Failed to join group:", error);
    }
    };
      
    const handleLeaveGroup = async () => {
    try {
        const data = await leave_group(groupDetails.id);
        console.log(data);
        setMembers((prevMembers) => prevMembers.filter((user) => user !== username)); // Update local state
    } catch (error) {
        console.error("Failed to leave group:", error);
    }
    };
      

    return ( 
        <>
        <div className="flex flex-col items-center mt-10 gap-4">
            <div className="flex flex-col gap-2">
                <p className="text-lg font-bold">{groupDetails.group_name}</p>
                <p>{groupDetails.description}</p>
                <p>{groupDetails.created_at}</p>
            </div>
            <div className="flex gap-4">
                {
                    isMember ?
                    <div className="flex gap-4">
                    <button onClick={handleLeaveGroup} className="bg-red-500 p-2 rounded-sm cursor-pointer">Leave</button>
                    <button onClick={(route) => handleNavigate(`/chatroom/${groupName}`)} className="bg-gray-400 p-2 rounded-sm cursor-pointer">Go to Chat</button>
                    </div>
                    :
                    <button onClick={handleJoinGroup} className="bg-blue-500 p-2 rounded-sm cursor-pointer">Join</button>
                }
            </div>
            <ul>
                {members.map((member, index) => (
                    <li key={index} className="text-sm text-gray-700">{member}</li>
                ))}
            </ul>
        </div>
        </>
     );
}

export default GroupInfo;