import useWebSocket from './useWebSocket';  // Import the WebSocket module
import { useEffect, useState, useRef } from "react";
import { get_group_messages } from "../api/endpoints";
import { useNavigate } from "react-router-dom";

const ChatRoom = () => {

  const nav = useNavigate();

  const handleNavigate = (route) => {
      nav(`${route}`)
  }

  const getGroupNameFromUrl = () => {
    const urlSplit = window.location.pathname.split('/');
    return urlSplit[urlSplit.length - 1];
  };

  const [groupName, setGroupName] = useState(getGroupNameFromUrl());
  

  const { messages, sendMessage, onlineUsersCount } = useWebSocket(groupName);
  const [newMessage, setNewMessage] = useState('');
  const [oldMessages, setOldMessages] = useState([]);
  const messagesEndRef = useRef(null); // Ref to scroll to bottom

  const storage = JSON.parse(localStorage.getItem('userData'))
  const [username, setUsername] = useState(storage ? storage.username : '')

  useEffect(() => {
    const fetchMessages = async () => {
      const oldMessages = await get_group_messages(groupName);
      setOldMessages(oldMessages);
    };
    fetchMessages();
  }, [groupName]);

  // Scroll to the bottom of the messages container
  useEffect(() => {
    // Only scroll to the bottom of the inner messages container
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, oldMessages]);

  const handleSend = () => {
    sendMessage(newMessage, username);
    setNewMessage(''); // Clear input field
  };

  return (
    <div>
      <div className="flex flex-col items-center max-w-2xl mx-auto m-4 space-y-4 p-6 py-4 border border-gray-300 rounded-lg bg-white shadow-lg">
        {/* Messages Container */}
        <div className='flex justify-between w-full'>
          <p className='text-sm mb-4'>Online Users: {onlineUsersCount}</p>
          <p onClick={(route) => handleNavigate(`/chatroom/${groupName}/info`)} className='text-md font-bold text-blue-500 hover:underline cursor-pointer'>{groupName}</p>
        </div>
        <div className="w-full h-96 overflow-y-auto space-y-2 p-2 bg-gray-50 rounded-lg shadow-inner hide-scrollbar">
          {/* Old Messages */}
          {oldMessages.map((message) => (
            <div key={message.id} className="flex items-start space-x-2 bg-gray-100 p-3 rounded-lg shadow-sm">
              <strong className="text-sm text-blue-600">{message.author}</strong>
              <p className="text-gray-800 text-sm">{message.body}</p>
            </div>
          ))}

          {/* New Messages */}
          {messages.map((msg, index) => (
            <div key={index} className="flex items-start space-x-2 bg-gray-100 p-3 rounded-lg shadow-sm">
              <strong className="text-sm text-blue-600">{msg.author}</strong>
              <p className="text-gray-800 text-sm">{msg.message}</p>
            </div>
          ))}

          {/* Scroll to bottom */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="w-full mt-4 flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
