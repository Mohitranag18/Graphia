import useWebSocket from './useWebSocket';  // Import the WebSocket module
import { useEffect, useState, useRef } from "react";
import { get_private_messages, create_private_files_message } from "../api/endpoints";
import {SERVER_URL} from '../api/endpoints'
import { useNavigate } from "react-router-dom";

const ChatRoomPrivate = () => {

  const nav = useNavigate();

    const handleNavigate = (route) => {
        nav(`${route}`)
    }

    const getUsernameFromUrl = () => {
        const urlSplit = window.location.pathname.split('/');
        return urlSplit[urlSplit.length - 1];
    };

    const [otherUser, setOtherUser] = useState(getUsernameFromUrl());

    const { messages, sendMessage, onlineUsersCount } = useWebSocket(otherUser, true);
    const [newMessage, setNewMessage] = useState('');
    const [oldMessages, setOldMessages] = useState([]);
    const [file, setFile] = useState(null);
    const messagesEndRef = useRef(null); // Ref to scroll to bottom
    const fileInputRef = useRef(null); // Add a ref for the file input

    const storage = JSON.parse(localStorage.getItem('userData'))
    const [username, setUsername] = useState(storage ? storage.username : '')

    const group_name = [username, otherUser].sort().join('_');

    useEffect(() => {
        const fetchMessages = async () => {
        const oldMessages = await get_private_messages(group_name);
        setOldMessages(oldMessages);
        };
        fetchMessages();
    }, [group_name]);

    // Scroll to the bottom of the messages container
    useEffect(() => {
        // Only scroll to the bottom of the inner messages container
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, oldMessages]);

    // Handle File Selection
    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
    };

    // Handle Send Message
    const handleSend = async () => {
      if (!newMessage && !file) return; // Prevent empty messages

      // Send WebSocket message if it's only text
      if (newMessage && !file) {
        sendMessage(newMessage, null, username);
        setNewMessage('');
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Clear the file input field
        }
        setFile(null);
      }
      else{
        // Handle File Upload via API
      const formData = new FormData();
      formData.append("chat", group_name);
      formData.append("body", newMessage);
      if (file) {
        formData.append("file", file);
      }
      try {
        const response = await create_private_files_message(group_name, newMessage, file);
        console.log("File uploaded successfully:", response);

        sendMessage(response.body, response.file, username);

        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Clear the file input field
        }
        setFile(null);
        setNewMessage('');
      } catch (error) {
        console.error("Error uploading file:", error);
      }
      } 
    };

  return (
    <div>
      <div className="flex flex-col items-center max-w-2xl mx-auto m-4 space-y-4 p-6 py-4 border border-gray-300 rounded-lg bg-white shadow-lg">
        {/* Header */}
        <div className='flex justify-between w-full'>
          <p onClick={() => handleNavigate(`/user/${otherUser}`)}  className='text-md font-bold text-blue-500 hover:underline cursor-pointer'>
            {otherUser}
          </p>
        </div>

        {/* Messages Container */}
        <div className="w-full h-96 overflow-y-auto space-y-2 p-2 bg-gray-50 rounded-lg shadow-inner hide-scrollbar">
          {/* Old Messages */}
          {oldMessages.map((message) => (
            username == message.sender ?(
              <div key={message.id} className="flex items-start justify-end space-x-2 bg-gray-100 p-3 rounded-lg shadow-sm">
              <div className='bg-green-300 flex flex-col gap-1 p-4 rounded-xl'>
                {message.file && (
                  <a href={`${SERVER_URL}${message.file}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    <img src={`${SERVER_URL}${message.file}`} alt="file" className='w-30 h-full rounded-lg'/>
                  </a>
                )}
                <p className="text-gray-800 text-sm">{message.body}</p>
              </div>
              {/* <strong className="text-sm text-blue-600">{message.sender}</strong> */}
              </div>)
              :
              (<div key={message.id} className="flex items-start space-x-2 bg-gray-100 p-3 rounded-lg shadow-sm">
              <strong className="text-sm text-blue-600">{message.sender}</strong>
              <div className='bg-red-300 flex flex-col gap-1 p-4 rounded-xl'>
                {message.file && (
                  <a href={`${SERVER_URL}${message.file}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    <img src={`${SERVER_URL}${message.file}`} alt="file" className='w-30 h-full rounded-lg'/>
                  </a>
                )}
                <p className="text-gray-800 text-sm">{message.body}</p>
              </div>
              </div>)
          ))}

          {/* New Messages */}
          {messages.map((msg, index) => (
            username == msg.author ?(
              <div key={index} className="flex items-start justify-end space-x-2 bg-gray-100 p-3 rounded-lg shadow-sm">
                {/* <strong className="text-sm text-blue-600">{msg.author}</strong> */}
                <div className='bg-green-300 flex flex-col gap-1 p-4 rounded-xl'>
                  {msg.file && (
                    <a href={`${SERVER_URL}${msg.file}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                      <img src={`${SERVER_URL}${msg.file}`} alt="file" className='w-30 h-auto rounded-lg'/>
                    </a>
                  )}
                  <p className="text-gray-800 text-sm">{msg.message}</p>
                </div>
              </div>)
              :
              (<div key={index} className="flex items-start space-x-2 bg-gray-100 p-3 rounded-lg shadow-sm">
                <strong className="text-sm text-blue-600">{msg.author}</strong>
                <div className='bg-red-300 flex flex-col gap-1 p-4 rounded-xl'>
                  {msg.file && (
                    <a href={`${SERVER_URL}${msg.file}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                      <img src={`${SERVER_URL}${msg.file}`} alt="file" className='w-30 h-auto rounded-lg'/>
                    </a>
                  )}
                  <p className="text-gray-800 text-sm">{msg.message}</p>
                </div>
              </div>)
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
          <input
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="p-2 border border-gray-300 rounded-md"
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

export default ChatRoomPrivate;
