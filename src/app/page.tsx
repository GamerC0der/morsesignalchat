'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Send, Radio, Copy, Check, ArrowLeft, Reply, Users } from 'lucide-react';

const morseCodeMap: { [key: string]: string } = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  ' ': '/',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', '!': '-.-.--',
  "'": '.----.', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
  '+': '.-.-.', '=': '-...-', '-': '-....-', ':': '---...',
  ';': '-.-.-.', '@': '.--.-.'
};

const encodeToMorse = (text: string): string =>
  text.toUpperCase().split('').map(char => morseCodeMap[char] || char).join(' ');

const decodeFromMorse = (morse: string): string => {
  const reverseMap: { [key: string]: string } = {};
  Object.entries(morseCodeMap).forEach(([char, code]) => {
    reverseMap[code] = char;
  });
  return morse.split(' ').map(code => reverseMap[code] || code).join('');
};

const isMorseCode = (text: string): boolean => {
  const morseCodes = Object.values(morseCodeMap);
  const words = text.split(' ');
  return words.length > 0 && words.every(word => morseCodes.includes(word) || word === '');
};

export default function Home() {
  const generateUsername = () => {
    const rand = Math.random() * 100;
    const animals = ['Blahaj', 'Djungelskog', 'Blavingad'];
    const animal = rand < 50 ? animals[0] : rand < 80 ? animals[1] : animals[2];
    const numbers = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `Anonymous${animal}${numbers}`;
  };

  const [sessionCode, setSessionCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [currentTimeouts, setCurrentTimeouts] = useState<NodeJS.Timeout[]>([]);
  const [userUuid] = useState(() => uuidv4());
  const [isInChat, setIsInChat] = useState(false);
  const [chatCode, setChatCode] = useState('');
  const [chatUuid, setChatUuid] = useState('');
  const [isGeneratedCode, setIsGeneratedCode] = useState(false);
  const [sessionExists, setSessionExists] = useState(false);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);
  const [messages, setMessages] = useState<{content: string, replyTo?: {sender: string, content: string}}[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [connectedPeers, setConnectedPeers] = useState<string[]>([]);
  const [username] = useState(() => generateUsername());
  const [isMorseEnabled, setIsMorseEnabled] = useState(false);
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<{index: number, content: string, sender: string} | null>(null);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteSuggestions] = useState(['/morse']);

  const eventSourceRef = useRef<EventSource | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const resetState = () => {
    setIsInChat(false);
    setChatCode('');
    setChatUuid('');
    setIsGeneratedCode(false);
    setSessionExists(false);
    setHasCheckedSession(false);
    setSessionCode('');
    setMessages([]);
    setReplyingTo(null);
  };

  const initializeEventSource = async (sessionCode: string) => {
    cleanupEventSource();

    const es = new EventSource(`https://gamerc0der-http.hf.space/api/events/${sessionCode}/${userUuid}`);

    eventSourceRef.current = es;

    es.onopen = () => {
      console.log('EventSource connected');
    };

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleEventSourceMessage(data);
      } catch (error) {
        console.error('Failed to parse event source message:', error);
      }
    };

    es.onerror = (error) => {
      console.error('EventSource error:', error);
      setConnectedPeers([]);
    };
  };

  const cleanupEventSource = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setConnectedPeers([]);
  };

  const handleEventSourceMessage = (data: any) => {
    if (data.type === 'joined_session') {
      console.log(`Joined session ${data.session_code} with ${data.client_count} clients`);
    } else if (data.type === 'user_joined') {
      if (data.client_id !== userUuid) {
        setMessages(prev => [...prev, { content: `Someone joined the chat` }]);
      }
    } else if (data.type === 'user_left') {
      if (data.client_id !== userUuid) {
        setMessages(prev => [...prev, { content: `Someone left the chat` }]);
      }
    } else if (data.type === 'message') {
      if (data.client_id !== userUuid) {
        const newMessage = {
          content: `${data.username}: ${data.content}`,
          timestamp: data.timestamp
        };
        setMessages(prev => [...prev, newMessage]);
      }
    } else if (data.type === 'error') {
      console.error('WebSocket error:', data.message);
    } else if (data.type === 'session_expired') {
      console.log('Session expired:', data.session_code);
      setMessages(prev => [...prev, { content: 'Session has expired' }]);
    }
  };

  const broadcastMessage = async (message: any) => {
    try {
      await fetch('https://gamerc0der-http.hf.space/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...message,
          username: username
        }),
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  useEffect(() => {
    const code = searchParams.get('code');
    const uuid = searchParams.get('uuid');

    if (code && uuid) {
      fetch(`https://gamerc0der-http.hf.space/api/session/${code}`)
        .then(response => response.json())
        .then(data => {
          if (data.exists) {
            setIsInChat(true);
            setChatCode(code);
            setChatUuid(uuid);
            setMessages([{ content: `${username} joined the chat` }]);
            initializeEventSource(code);
          } else {
            router.push('/');
          }
        })
        .catch(() => {
          router.push('/');
        });
    }
  }, [searchParams, username, router]);

  useEffect(() => {
    return () => {
      cleanupEventSource();
    };
  }, [username]);

  useEffect(() => {
    const checkSessionExists = async () => {
      if (sessionCode.length === 4 && !isGeneratedCode) {
        try {
          const response = await fetch(`https://gamerc0der-http.hf.space/api/session/${sessionCode}`);
          const data = await response.json();
          setSessionExists(data.exists);
          setHasCheckedSession(true);
        } catch (error) {
          setSessionExists(false);
          setHasCheckedSession(true);
        }
      } else {
        setSessionExists(false);
        setHasCheckedSession(false);
      }
    };

    checkSessionExists();
  }, [sessionCode, isGeneratedCode]);

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };


  const handleCreateChat = async () => {
    currentTimeouts.forEach(timeout => clearTimeout(timeout));
    setCurrentTimeouts([]);
    const code = sessionCode.length === 4 ? sessionCode : generateRandomCode();
    setSessionCode('');
    setIsCreating(true);
    setIsGeneratedCode(true);

    try {
      const response = await fetch('https://gamerc0der-http.hf.space/api/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ client_id: userUuid }),
      });

      if (response.ok) {
        const data = await response.json();
        const actualCode = data.session_code;
        setMessages([{ content: `${username} joined the chat` }]);
        router.push(`/?code=${actualCode}&uuid=${userUuid}`);
      } else {
        setIsGeneratedCode(false);
        setIsCreating(false);
      }
    } catch (error) {
      setIsGeneratedCode(false);
      setIsCreating(false);
    }

    const newTimeouts: NodeJS.Timeout[] = [];

    for (let i = 0; i < code.length; i++) {
      const timeout = setTimeout(() => {
        setSessionCode(prev => prev + code[i]);
        if (i === code.length - 1) {
          setIsCreating(false);
        }
      }, i * 100);
      newTimeouts.push(timeout);
    }

    setCurrentTimeouts(newTimeouts);
  };

  const handleSendMessage = async () => {
    if (currentMessage.trim()) {
      const messageToSend = isMorseEnabled ? encodeToMorse(currentMessage.trim()) : currentMessage.trim();

      const newMessage = {
        content: `${username}: ${messageToSend}`,
        ...(replyingTo && { replyTo: { sender: replyingTo.sender, content: replyingTo.content } })
      };

      setMessages(prev => [...prev, newMessage]);

      await broadcastMessage({
        client_id: userUuid,
        content: messageToSend,
        session_code: chatCode
      });

      setCurrentMessage('');
      setReplyingTo(null);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      if (typeof window !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else if (typeof window !== 'undefined' && document && document.execCommand) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (!successful) {
          throw new Error('Fallback copy method failed');
        }
      } else {
        throw new Error('Clipboard not supported');
      }

      setCopiedMessageIndex(index);
      setTimeout(() => setCopiedMessageIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const editMessage = (index: number, newMessage: {content: string, replyTo?: {sender: string, content: string}}) => {
    setMessages(prev => prev.map((msg, i) => i === index ? newMessage : msg));
  };

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && sessionCode.length === 4) {
      const response = await fetch(`https://gamerc0der-http.hf.space/api/session/${sessionCode}`);
      const data = await response.json();

      if (data.exists) {
        setMessages([{ content: `${username} joined the chat` }]);
        router.push(`/?code=${sessionCode}&uuid=${userUuid}`);
      } else {
        const createResponse = await fetch('https://gamerc0der-http.hf.space/api/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ client_id: userUuid }),
        });

        if (createResponse.ok) {
          const createData = await createResponse.json();
          setMessages([{ content: `${username} joined the chat` }]);
          router.push(`/?code=${createData.session_code}&uuid=${userUuid}`);
        }
      }
    }
  };

  if (isInChat) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'rgb(25, 24, 36)' }}>
        <div className="absolute top-4 left-4 text-white/60 text-sm font-mono">
          Session: {chatCode}
        </div>
        <div className="absolute top-4 right-4">
          <button
            onClick={() => {
              cleanupEventSource();
              resetState();
              router.push('/');
            }}
            className="text-white/60 hover:text-white transition-colors duration-200 text-sm flex items-center gap-1"
          >
            <ArrowLeft size={14} />
            Back
          </button>
        </div>
        <div className="flex items-center justify-center h-screen">
          <div className="w-[48rem] h-[37.5rem] border border-white/20 rounded-lg bg-transparent flex flex-col">
            <div className="flex-1 p-4 overflow-y-auto chat-scroll">
              {messages.map((message, index) => {
                const messageParts = message.content.split(': ');
                const sender = messageParts[0];
                const content = messageParts.slice(1).join(': ');

                return (
                  <div
                    key={index}
                    className="text-white/80 text-sm mb-2 font-mono relative group"
                  >
                    {message.replyTo && (
                      <div className="mb-1 pl-3 border-l-2 border-white/30 text-white/50 text-xs">
                        Replying to <span className="font-semibold">{message.replyTo.sender}</span>: {message.replyTo.content.length > 50 ? `${message.replyTo.content.substring(0, 50)}...` : message.replyTo.content}
                      </div>
                    )}
                    <div>{message.content}</div>
                    <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => setReplyingTo({ index, content, sender })}
                          className="p-1 rounded bg-white/10 hover:bg-white/20 transition-colors duration-200 text-white/60 hover:text-white"
                          title="Reply to message"
                        >
                          <Reply size={12} />
                        </button>
                        <button
                          onClick={() => copyToClipboard(content, index)}
                          className="p-1 rounded bg-white/10 hover:bg-white/20 transition-colors duration-200 text-white/60 hover:text-white"
                          title="Copy message"
                        >
                          {copiedMessageIndex === index ? (
                            <Check size={12} className="text-green-400" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                        {isMorseCode(content) && (
                          <button
                            onClick={() => editMessage(index, { content: `${sender}: ${decodeFromMorse(content)}`, replyTo: message.replyTo })}
                            className="p-1 rounded bg-white/10 hover:bg-white/20 transition-colors duration-200 text-white/60 hover:text-white"
                            title="Translate from Morse code"
                          >
                            <Radio size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                );
              })}
            </div>
            <div className="p-4 border-t border-white/20">
              {replyingTo && (
                <div className="mb-3 p-2 bg-white/5 border border-white/20 rounded-md flex items-center justify-between">
                  <div className="text-white/70 text-sm">
                    Replying to <span className="font-semibold text-white/90">{replyingTo.sender}</span>: {replyingTo.content.length > 60 ? `${replyingTo.content.substring(0, 60)}...` : replyingTo.content}
                  </div>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="text-white/50 hover:text-white transition-colors duration-200 text-lg leading-none"
                    title="Cancel reply"
                  >
                    ×
                  </button>
                </div>
              )}
              {showAutocomplete && (
                <div className="mb-2 bg-white/10 border border-white/20 rounded-md overflow-hidden">
                  {autocompleteSuggestions.map((suggestion, index) => (
                    <div
                      key={suggestion}
                      className="px-3 py-2 text-white/80 hover:bg-white/20 cursor-pointer transition-colors duration-200 text-sm"
                      onClick={() => {
                        if (suggestion === '/morse') {
                          setIsMorseEnabled(!isMorseEnabled);
                          setCurrentMessage('');
                          setShowAutocomplete(false);
                        }
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setIsMorseEnabled(!isMorseEnabled)}
                  className={`px-3 py-2 border rounded-md transition-colors duration-200 flex items-center justify-center ${
                    isMorseEnabled
                      ? 'bg-white/30 border-white/50 text-white'
                      : 'bg-white/10 border-white/20 text-white/60 hover:bg-white/20'
                  }`}
                  title={isMorseEnabled ? 'Disable Morse Code' : 'Enable Morse Code'}
                >
                  <Radio size={16} />
                </button>
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCurrentMessage(value);
                    setShowAutocomplete(value === '/');
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      if (showAutocomplete && currentMessage === '/morse') {
                        setIsMorseEnabled(!isMorseEnabled);
                        setCurrentMessage('');
                        setShowAutocomplete(false);
                      } else {
                        handleSendMessage();
                      }
                    } else if (e.key === 'Escape') {
                      setShowAutocomplete(false);
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-transparent border border-white/20 rounded-md text-white placeholder-white/50 focus:border-white/60 focus:outline-none transition-colors duration-200"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim()}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:opacity-50 text-white rounded-md transition-colors duration-200 font-medium flex items-center justify-center"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'rgb(25, 24, 36)' }}>
      <div className="flex-grow flex flex-col items-center justify-center gap-8">
        <h1 className="text-4xl font-bold text-white">ChatS</h1>

        <div className="transition-opacity duration-500 opacity-100">
        <input
          type="text"
          value={sessionCode}
          onChange={(e) => {
            const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4);
            setSessionCode(value);
            setIsGeneratedCode(false);
            setSessionExists(false);
            setHasCheckedSession(false);
          }}
          onKeyPress={handleKeyPress}
          className={`px-4 py-4 text-center text-6xl font-mono bg-transparent border-2 border-white/20 focus:border-white/60 focus:outline-none transition-colors duration-200 w-64 ${
            sessionCode.length === 4 && !isGeneratedCode && hasCheckedSession && !sessionExists ? 'text-red-400' : 'text-white'
          }`}
          style={{ borderRadius: '12px' }}
          maxLength={4}
        />
      </div>

      <button onClick={handleCreateChat} disabled={isCreating} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-200 mt-4 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
        Create Chat
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 max-w-4xl">
        <div className="bg-white/5 border border-white/20 rounded-xl p-6 text-center hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105">
          <Users size={48} className="text-white/60 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-3">Peer-to-Peer</h3>
          <p className="text-white/70 text-sm leading-relaxed">Connect directly to other computers.</p>
        </div>

        <div className="bg-white/5 border border-white/20 rounded-xl p-6 text-center hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105">
          <Radio size={48} className="text-white/60 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-3">Morse Code</h3>
          <p className="text-white/70 text-sm leading-relaxed">Optionally encrypt your messages with morse code for fun!</p>
        </div>

        <div className="bg-white/5 border border-white/20 rounded-xl p-6 text-center hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105">
          <Reply size={48} className="text-white/60 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-3">Replies</h3>
          <p className="text-white/70 text-sm leading-relaxed">Reply to specific messages in conversations</p>
        </div>
      </div>
      </div>

      <div className="text-center pb-4">
        
        <p className="text-white/40 text-xs">
          © 2025 ChatS. All rights reserved.
        </p>
      </div>
    </div>
  );
}
