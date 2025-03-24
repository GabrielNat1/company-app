import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

function EventChat() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:8080/ws/chat', {
      transports: ['websocket'],
      auth: {
        token: localStorage.getItem('token'),
      },
    });
    setSocket(newSocket);

    newSocket.emit('join', { eventId: id });

    newSocket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [id]);

  const handleSendMessage = () => {
    if (socket) {
      socket.emit('message', { eventId: id, content: message });
      setMessage('');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Event Chat</h1>
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.userName}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded-l-lg"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 rounded-r-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default EventChat;
