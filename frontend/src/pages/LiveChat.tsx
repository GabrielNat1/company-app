import { useEffect, useRef, useState } from 'react';
import { Send, RefreshCw } from 'lucide-react';
import { useAuth } from '../stores/auth';
import type { Message } from '../types';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-hot-toast';

export function LiveChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const socketRef = useRef<Socket>();
  const reconnectAttempts = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connectSocket = () => {
      try {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }

        const token = localStorage.getItem('token');
        if (!token || !user) {
          toast.error('Sessão expirada. Faça login novamente.');
          return;
        }

        // Simplified configuration
        socketRef.current = io('http://localhost:8080', {
          autoConnect: true,
          auth: {
            token: token
          },
          transports: ['websocket'], // Force WebSocket only
          reconnectionAttempts: 3,
          reconnectionDelay: 1000,
          timeout: 5000,
          query: {
            userId: user.id,
            userName: user.name
          }
        });

        // Log connection status
        socketRef.current.on("connect", () => {
          console.log("Socket conectado:", socketRef.current?.id);
          setIsConnected(true);
          reconnectAttempts.current = 0;
        });

        // Detailed error logging
        socketRef.current.on("connect_error", (err) => {
          console.error("Erro de conexão:", {
            message: err.message,
            stack: err.stack,
            name: err.name,
            userId: user.id,
            transport: socketRef.current?.io?.engine?.transport?.name
          });
          
          setIsConnected(false);
          toast.error(`Erro de conexão: ${err.message}`);
        });

        socketRef.current.on('previous_messages', (previousMessages: Message[]) => {
          setMessages(previousMessages);
        });

        socketRef.current.on('message', (newMessage: Message) => {
          setMessages(prev => [...prev, newMessage]);
        });

        socketRef.current.on('disconnect', () => {
          console.log('Disconnected from WebSocket');
          setIsConnected(false);
        });
      } catch (error) {
        console.error('Erro de inicialização:', error);
        setIsConnected(false);
      }
    };

    connectSocket();

    // Cleanup
    return () => {
      if (socketRef.current) {
        console.log('Desconectando socket...');
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  // Função para reconexão manual
  const handleReconnect = () => {
    reconnectAttempts.current = 0;
    socketRef.current?.disconnect();
    socketRef.current?.connect();
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (!message.trim() || !socketRef.current || !user) return;

    const newMessage = {
      userId: user.id,
      userName: user.name,
      content: message.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      socketRef.current.emit('message', newMessage);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erro ao enviar mensagem');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors">
      <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-xl font-semibold dark:text-white">Chat ao Vivo</h2>
        <div className="flex items-center gap-2">
          <div className={`flex items-center ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'} ${isConnected ? '' : 'animate-pulse'}`} />
            {isConnected ? 'Conectado' : 'Desconectado'}
          </div>
          {!isConnected && (
            <button
              onClick={handleReconnect}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Reconectar"
            >
              <RefreshCw size={16} className="animate-spin" />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.userId === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] rounded-lg px-4 py-2 ${
              msg.userId === user?.id 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}>
              {msg.userId !== user?.id && (
                <p className="text-xs font-medium mb-1">{msg.userName}</p>
              )}
              <p>{msg.content}</p>
              <p className="text-xs opacity-75 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-4 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleSend}
            disabled={!isConnected}
            className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}