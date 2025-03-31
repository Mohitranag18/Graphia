import { useState, useEffect } from 'react';

const useWebSocket = (chatroomName, isPrivateChat = false) => {
  const [messages, setMessages] = useState([]);
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Dynamically set WebSocket URL
    const wsUrl = isPrivateChat
      ? `ws://127.0.0.1:8000/ws/private/${chatroomName}/`
      : `ws://127.0.0.1:8000/ws/chatroom/${chatroomName}/`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = (event) => {
      const cookie = document.cookie;
      ws.send(JSON.stringify({ type: 'auth', cookie }));
      console.log('Connected to WebSocket', event);
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    // On message received from WebSocket
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received message:', data);

      // Handle the online_users_count message
      if (data.type === 'online_users_count') {
        setOnlineUsersCount(data.count);
      }

      // Handle normal message events
      if(data.message && data.message.trim() !== '') {
        console.log('Received message 2:'); 
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            message: data.message,
            file: data.file,
            author: data.author,
            timestamp: data.timestamp,
          }
        ]);
      }
      if(data.message.trim() === '' && data.file !== null) {
        console.log('Received message 3:'); 
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            message: data.message,
            file: data.file,
            author: data.author,
            timestamp: data.timestamp,
          }
        ]);
      }
    };

    ws.onclose = (event) => {
      console.log('Disconnected from WebSocket', event);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [chatroomName, isPrivateChat]);

  const sendMessage = (message, file, username) => {
    if (!message.trim() && !file) return; // Prevent sending empty messages
  
    if (socket) {
      const messageData = {
        body: message.trim(),
        file: file || null,
        author: username,
      };
      console.log('Sending message:', messageData);
      socket.send(JSON.stringify(messageData));
    }
  };
  

  return { messages, sendMessage, onlineUsersCount };
};

export default useWebSocket;
