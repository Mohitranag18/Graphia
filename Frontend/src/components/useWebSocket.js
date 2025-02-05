// useWebSocket.js
import { useState, useEffect } from 'react';

const useWebSocket = () => {
  const [messages, setMessages] = useState([]);
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://127.0.0.1:8000/ws/chatroom/public-chat');
    
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
      console.log('Received message:', data); // Debugging line

      // Handle the online_users_count message
      if (data.type === 'online_users_count') {
        setOnlineUsersCount(data.count);  // Update the online users count
      }

      // Handle normal message events
      if (data.message && data.message.trim() !== '') {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            message: data.message,
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
  }, []);

  const sendMessage = (message, username) => {
    if (socket) {
      const messageData = {
        body: message,
        author: username,
      };
      console.log('Sending message:', messageData);  // Debugging line
      socket.send(JSON.stringify(messageData));
    }
  };

  return { messages, sendMessage, onlineUsersCount };
};

export default useWebSocket;
