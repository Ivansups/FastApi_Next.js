'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { WebSocketMessage } from '@/types/websocket';
import BackButton from '@/components/BackButton';

export default function Chat({ token }: { token?: string }) {
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef(token);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const currentToken = tokenRef.current;
    const tokenParam = currentToken ? `?token=${encodeURIComponent(currentToken)}` : '';
    const wsUrl = `${protocol}//${window.location.hostname}:8000/ws${tokenParam}`;
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          
          if (data.type === 'connection') {
            if (data.status === 'authenticated') {
              console.log('Authenticated as user:', data.username || data.user_id);
              const username = data.username || `User_${data.user_id?.substring(0, 8)}`;
              setChatMessages((prev) => [...prev, `✓ Подключен как ${username}`]);
            }
          } else if (data.type === 'history') {
            if (data.messages && data.messages.length > 0) {
              const historyMessages = data.messages.map(msg => 
                `[${msg.sender_username}]: ${msg.message}`
              );
              setChatMessages((prev) => [...historyMessages, ...prev]);
            }
          } else if (data.type === 'message') {
            const messageText = data.message || '';
            const senderUsername = data.sender_username || data.username || `User_${(data.sender_id || data.user_id || 'Unknown').substring(0, 8)}`;
            setChatMessages((prev) => [...prev, `[${senderUsername}]: ${messageText}`]);
          } else if (data.type === 'pong') {
            setChatMessages((prev) => [...prev, '✓ Pong received']);
          } else if (data.type === 'clear_history') {
            const clearedBy = data.cleared_by || 'Система';
            setChatMessages([`🗑️ История чата очищена пользователем ${clearedBy}`]);
          } else if (data.type === 'error') {
            setError(data.message || 'Ошибка соединения');
          }
        } catch (err) {
          console.error('Error parsing message:', err);
          setError('Ошибка парсинга сообщения');
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Ошибка соединения с сервером');
        setIsConnected(false);
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected');
      };
    } catch (err) {
      console.error('Error creating WebSocket:', err);
      setError('Не удалось создать соединение');
    }
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      setIsConnected(false);
      setChatMessages((prev) => [...prev, '✗ Отключено']);
    }
  }, []);

  const clearChat = () => {
    if (!isConnected || !wsRef.current) {
      return;
    }

    try {
      wsRef.current.send(
        JSON.stringify({
          type: 'clear',
        })
      );
    } catch (err) {
      console.error('Error sending clear command:', err);
      setError('Ошибка отправки команды очистки');
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !isConnected || !wsRef.current) {
      return;
    }

    try {
      wsRef.current.send(
        JSON.stringify({
          type: 'message',
          message: inputMessage.trim(),
        })
      );
      setInputMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Ошибка отправки сообщения');
    }
  };

  const handlePing = () => {
    if (!isConnected || !wsRef.current) {
      return;
    }

    try {
      wsRef.current.send(
        JSON.stringify({
          type: 'ping',
        })
      );
      setChatMessages((prev) => [...prev, '→ Ping sent']);
    } catch (err) {
      console.error('Error sending ping:', err);
      setError('Ошибка отправки ping');
    }
  };

  useEffect(() => {
    // Используем setTimeout для асинхронного вызова, чтобы избежать синхронного setState в эффекте
    const timeoutId = setTimeout(() => {
      connect();
    }, 0);
    
    return () => {
      clearTimeout(timeoutId);
      disconnect();
    };
  }, [connect, disconnect]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  return (
    <div className="flex flex-col min-h-screen p-8 max-w-4xl mx-auto relative">
      <BackButton href="/me" />
      
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 via-purple-400 to-purple-300 bg-clip-text text-transparent">
          WebSocket Chat
        </h1>
        <div className="flex items-center gap-4">
          <span className={`text-sm font-semibold ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            {isConnected ? '● Connected' : '○ Disconnected'}
          </span>
          {!isConnected && (
            <button 
              onClick={connect} 
              className="px-4 py-2 rounded-lg border border-purple-500/30 bg-white/5 backdrop-blur-sm text-purple-300 font-semibold hover:bg-purple-500/10 hover:border-purple-500/60 transition-all hover:-translate-y-0.5"
            >
              Reconnect
            </button>
          )}
          {isConnected && (
            <button 
              onClick={disconnect} 
              className="px-4 py-2 rounded-lg border border-purple-500/30 bg-white/5 backdrop-blur-sm text-purple-300 font-semibold hover:bg-purple-500/10 hover:border-purple-500/60 transition-all hover:-translate-y-0.5"
            >
              Disconnect
            </button>
          )}
          {chatMessages.length > 0 && (
            <button 
              onClick={clearChat} 
              className="px-4 py-2 rounded-lg border border-red-500/30 bg-red-500/10 backdrop-blur-sm text-red-300 font-semibold hover:bg-red-500/20 hover:border-red-500/60 transition-all hover:-translate-y-0.5"
            >
              Clear Chat
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 mb-4">
          Error: {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-2xl min-h-[400px] max-h-[500px] mb-4 shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_0_1px_rgba(139,92,246,0.1),inset_0_1px_0_rgba(255,255,255,0.1)]">
        {chatMessages.length === 0 ? (
          <p className="text-center text-purple-300/60 mt-8">No messages yet. Start chatting!</p>
        ) : (
          chatMessages.map((msg, idx) => (
            <div 
              key={idx} 
              className="p-3 mb-2 bg-purple-500/10 rounded-lg text-foreground border-l-4 border-purple-500 transition-all hover:bg-purple-500/20 hover:translate-x-1"
            >
              {msg}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={!isConnected}
          className="flex-1 px-4 py-3 rounded-xl border border-purple-500/30 bg-white/5 backdrop-blur-sm text-foreground text-base transition-all focus:outline-none focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button 
          type="submit" 
          disabled={!isConnected || !inputMessage.trim()}
          className="px-6 py-3 rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-500 via-purple-400 to-purple-300 text-background font-semibold uppercase tracking-wide text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(139,92,246,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          Send
        </button>
        <button 
          type="button"
          onClick={handlePing}
          disabled={!isConnected}
          className="px-6 py-3 rounded-xl border border-purple-500/30 bg-white/5 backdrop-blur-sm text-purple-300 font-semibold uppercase tracking-wide text-sm transition-all hover:-translate-y-0.5 hover:bg-purple-500/10 hover:border-purple-500/60 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          Ping
        </button>
      </form>
    </div>
  );
}
