import { useEffect, useState } from "react";
import { get_group_details, join_group, leave_group } from "../api/endpoints";
import { useNavigate } from "react-router-dom";

function GroupInfo() {
  const nav = useNavigate();
  const handleNavigate = (route) => nav(`${route}`);

  const storage = JSON.parse(localStorage.getItem("userData"));
  const [username, setUsername] = useState(storage ? storage.username : "");

  const getGroupNameFromUrl = () => {
    const urlSplit = window.location.pathname.split("/");
    return urlSplit[urlSplit.length - 2];
  };

  const [groupName, setGroupName] = useState(getGroupNameFromUrl());
  const [groupDetails, setGroupDetails] = useState({});
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const data = await get_group_details(groupName);
        setGroupDetails(data);
        setMembers(data.users_online);
      } catch (error) {
        console.error("Failed to fetch group details:", error);
      }
    };
    fetchGroupDetails();
  }, [groupName]);

  const isMember = members.includes(username);

  const handleJoinGroup = async () => {
    try {
      await join_group(groupDetails.id);
      setMembers((prev) => [...prev, username]);
    } catch (error) {
      console.error("Failed to join group:", error);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await leave_group(groupDetails.id);
      setMembers((prev) => prev.filter((user) => user !== username));
    } catch (error) {
      console.error("Failed to leave group:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
        <h1 className="text-2xl font-bold text-center mb-4">{groupDetails.group_name}</h1>
        <p className="text-gray-600 mb-2">{groupDetails.description}</p>
        <p className="text-gray-400 mb-6">Created on: {groupDetails.formatted_date}</p>

        <div className="flex justify-center gap-4 mb-6">
          {isMember ? (
            <>
              <button onClick={handleLeaveGroup} className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">Leave</button>
              <button onClick={() => handleNavigate(`/chatroom/${groupName}`)} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">Go to Chat</button>
            </>
          ) : (
            <button onClick={handleJoinGroup} className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">Join</button>
          )}
        </div>

        <h2 className="text-xl font-semibold mb-2">Members</h2>
        {members.length > 0 ? (
          <ul className="max-h-40 overflow-y-auto border p-2 rounded-lg bg-gray-50">
            {members.map((member, index) => (
              <li key={index} className="text-gray-700 py-1">{member}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No members online</p>
        )}
      </div>
    </div>
  );
}

export default GroupInfo;
