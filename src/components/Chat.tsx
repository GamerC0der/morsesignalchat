'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Send, Radio, Copy, Check, ArrowLeft, Reply, Users, Search, X, MessageCircle } from 'lucide-react';
import Modal from '../components/Modal';
import { encodeToMorse, decodeFromMorse, isMorseCode, formatRelativeTime } from '../utils/morseCode';


interface EventSourceMessage {
  type: string;
  session_code?: string;
  client_count?: number;
  client_id?: string;
  username?: string;
  content?: string;
  timestamp?: string;
  message?: string;
  replyTo?: { sender: string; content: string };
}

interface BroadcastMessage {
  client_id: string;
  content: string;
  session_code: string;
  replyTo?: { sender: string; content: string };
}

interface ChatProps {
  sessionCode?: string;
  onSessionCodeChange?: (value: string) => void;
}

function Home({ sessionCode: externalSessionCode = '', onSessionCodeChange }: ChatProps = {}) {
  const generateUsername = () => {
    const rand = Math.random() * 100;
    const animals = ['Blahaj', 'Djungelskog', 'Blavingad'];
    const animal = rand < 50 ? animals[0] : rand < 80 ? animals[1] : animals[2];
    const numbers = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `Anonymous${animal}${numbers}`;
  };

  const [sessionCode, setSessionCode] = useState(externalSessionCode);
  const [isCreating, setIsCreating] = useState(false);
  const [currentTimeouts, setCurrentTimeouts] = useState<NodeJS.Timeout[]>([]);
  const [userUuid] = useState(() => uuidv4());
  const [isInChat, setIsInChat] = useState(false);
  const [chatCode, setChatCode] = useState('');
  const [isGeneratedCode, setIsGeneratedCode] = useState(false);
  const [sessionExists, setSessionExists] = useState(false);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);
  const [messages, setMessages] = useState<{content: string, timestamp?: string, replyTo?: {sender: string, content: string}}[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [username] = useState(() => generateUsername());
  const [isMorseEnabled, setIsMorseEnabled] = useState(false);
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<{index: number, content: string, sender: string} | null>(null);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteSuggestions] = useState(['/morse']);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkToOpen, setLinkToOpen] = useState('');
  const [showBackModal, setShowBackModal] = useState(false);
  const [showSearchPopover, setShowSearchPopover] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  const [awayTimer, setAwayTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastMessageCount, setLastMessageCount] = useState(0);

  const eventSourceRef = useRef<EventSource | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const filteredMessages = showSearchPopover && searchQuery.trim()
    ? messages.filter(message =>
        message.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  const parseLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <button
            key={index}
            onClick={() => {
              setLinkToOpen(part);
              setShowLinkModal(true);
            }}
            className="text-blue-400 hover:text-blue-300 underline break-all"
          >
            {part}
          </button>
        );
      }
      return part;
    });
  };

  const resetState = () => {
    setIsInChat(false);
    setChatCode('');
    setIsGeneratedCode(false);
    setSessionExists(false);
    setHasCheckedSession(false)
    setSessionCode('');
    setMessages([]);
    setReplyingTo(null);
  };

  const cleanupEventSource = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  const handleEventSourceMessage = useCallback((data: EventSourceMessage) => {
    if (data.type === 'joined_session') {
      console.log(`Joined session ${data.session_code} with ${data.client_count} clients`);
    } else if (data.type === 'user_joined') {
      if (data.client_id !== userUuid) {
        setMessages(prev => [...prev, { content: `Someone joined the chat`, timestamp: new Date().toISOString() }]);

        if (!isTabVisible && hasNotificationPermission && 'Notification' in window) {
          const notification = new Notification('ChatS - User Joined', {
            body: 'Someone joined the chat session',
            icon: '/favicon.ico',
            tag: 'chats-user-joined',
            silent: true
          });

          setTimeout(() => notification.close(), 3000);
        }
      }
    } else if (data.type === 'user_left') {
      console.log('User left:', data.client_id);
      if (data.client_id !== userUuid) {
        setMessages(prev => [...prev, { content: `Someone left the chat`, timestamp: new Date().toISOString() }]);

        if (!isTabVisible && hasNotificationPermission && 'Notification' in window) {
          const notification = new Notification('ChatS - User Left', {
            body: 'Someone left the chat session',
            icon: '/favicon.ico',
            tag: 'chats-user-left',
            silent: true
          });

          setTimeout(() => notification.close(), 3000);
        }
      }
    } else if (data.type === 'message') {
      if (data.client_id !== userUuid) {

        console.log('Message received:', data.content);
        const newMessage = {
          content: `${data.username}: ${data.content}`,
          timestamp: data.timestamp || new Date().toISOString(),
          ...(data.replyTo && { replyTo: { sender: data.replyTo.sender, content: data.replyTo.content } })
        };
        setMessages(prev => [...prev, newMessage]);

        // Show notification if tab is not visible and we have permission
        if (!isTabVisible && hasNotificationPermission && 'Notification' in window) {
          const notification = new Notification('New ChatS Message', {
            body: `${data.username}: ${data.content}`,
            icon: '/favicon.ico',
            tag: 'chats-message',
            silent: false
          });

          // Auto-close notification after 5 seconds
          setTimeout(() => {
            notification.close();
          }, 5000);
        }
      }
    } else if (data.type === 'error') {
      console.error('WebSocket error:', data.message);
    } else if (data.type === 'session_expired') {
      console.log('Session expired:', data.session_code);
      setMessages(prev => [...prev, { content: 'Session has expired', timestamp: new Date().toISOString() }]);
    }
  }, [userUuid, isTabVisible, hasNotificationPermission]);

  const initializeEventSource = useCallback(async (sessionCode: string) => {
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
    };
  }, [userUuid, handleEventSourceMessage]);

  const broadcastMessage = async (message: BroadcastMessage) => {
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

  // Close search popover on escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showSearchPopover) {
        setShowSearchPopover(false);
        setSearchQuery('');
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (showSearchPopover && !(e.target as Element).closest('.search-popover') && !(e.target as Element).closest('.search-button')) {
        setShowSearchPopover(false);
      }
    };

    if (showSearchPopover) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearchPopover, isTabVisible, hasNotificationPermission]);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      const isVisible = !document.hidden;
      setIsTabVisible(isVisible);

      if (isVisible) {
        if (awayTimer) {
          clearTimeout(awayTimer);
          setAwayTimer(null);
        }
      } else {
        if ('Notification' in window && Notification.permission === 'default') {
          Notification.requestPermission().then(permission => {
            setHasNotificationPermission(permission === 'granted');
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    handleVisibilityChange();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (awayTimer) {
        clearTimeout(awayTimer);
      }
    };
  }, [awayTimer]);

  useEffect(() => {
    if ('Notification' in window) {
      setHasNotificationPermission(Notification.permission === 'granted');
    }
  }, []);

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
            setMessages([{ content: `${username} joined the chat`, timestamp: new Date().toISOString() }]);
            initializeEventSource(code);
          } else {
            router.push('/');
          }
        })
        .catch(() => {
          router.push('/');
        });
    }
  }, [searchParams, username, router, initializeEventSource]);

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
        } catch (_error) {
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
        setMessages([{ content: `${username} joined the chat`, timestamp: new Date().toISOString() }]);
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
        timestamp: new Date().toISOString(),
        ...(replyingTo && { replyTo: { sender: replyingTo.sender, content: replyingTo.content } })
      };

      setMessages(prev => [...prev, newMessage]);

      await broadcastMessage({
        client_id: userUuid,
        content: messageToSend,
        session_code: chatCode,
        ...(replyingTo && { replyTo: { sender: replyingTo.sender, content: replyingTo.content } })
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

  const editMessage = (index: number, newMessage: {content: string, timestamp?: string, replyTo?: {sender: string, content: string}}) => {
    setMessages(prev => prev.map((msg, i) => i === index ? newMessage : msg));
  };

  const handleKeyPress = useCallback(async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && sessionCode.length === 4) {
      const response = await fetch(`https://gamerc0der-http.hf.space/api/session/${sessionCode}`);
      const data = await response.json();

      if (data.exists) {
        setMessages([{ content: `${username} joined the chat`, timestamp: new Date().toISOString() }]);
        router.push(`/?code=${sessionCode}&uuid=${userUuid}`);
      } else {
        // Use API route to create a new session
        const createResponse = await fetch('https://gamerc0der-http.hf.space/api/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ client_id: userUuid }),
        });

        if (createResponse.ok) {
          const createData = await createResponse.json();
          setMessages([{ content: `${username} joined the chat`, timestamp: new Date().toISOString() }]);
          router.push(`/?code=${createData.session_code}&uuid=${userUuid}`);
        }
      }
    }
  }, [sessionCode, username, userUuid, router]);

  useEffect(() => {
    if (externalSessionCode && externalSessionCode.length === 4 && externalSessionCode !== sessionCode) {
      setSessionCode(externalSessionCode);
      onSessionCodeChange?.(externalSessionCode);
      handleKeyPress({ key: 'Enter' } as React.KeyboardEvent<HTMLInputElement>);
    }
  }, [externalSessionCode, sessionCode, onSessionCodeChange, handleKeyPress]);

  if (isInChat) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'rgb(25, 24, 36)' }}>
        <div className="absolute top-4 left-4 text-white/60 text-sm font-mono">
          Session: {chatCode}
        </div>
        <div className="flex items-center justify-center h-screen">
          <div className="w-[48rem] h-[37.5rem] border border-white/20 rounded-lg bg-transparent flex flex-col relative">
            {/* Search Button - Top Right of Chat Window */}
            <div className="absolute top-3 right-3 z-40">
              <button
                onClick={() => setShowSearchPopover(!showSearchPopover)}
                className={`search-button p-2 rounded-md transition-all duration-200 ${
                  showSearchPopover
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                title="Search messages"
              >
                <Search size={16} />
              </button>
            </div>

            {/* Search Popover */}
            {showSearchPopover && (
              <div className="search-popover absolute top-12 right-3 z-50">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search messages..."
                    className="w-64 px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/40 focus:border-blue-400 focus:outline-none transition-colors duration-200"
                    autoFocus
                  />
                </div>
              </div>
            )}

            <div className="flex-1 p-4 overflow-y-auto chat-scroll">
              {filteredMessages.map((message, index) => {
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
                    <div className="flex items-center gap-2">
                      <span className="flex-1">{parseLinks(message.content)}</span>
                      {message.timestamp && !message.content.includes('joined the chat') && (
                        <span className="text-white/40 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {formatRelativeTime(message.timestamp)}
                        </span>
                      )}
                    </div>
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
                            onClick={() => editMessage(index, { content: `${sender}: ${decodeFromMorse(content)}`, timestamp: message.timestamp, replyTo: message.replyTo })}
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
                  {autocompleteSuggestions.map((suggestion) => (
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
                  maxLength={200}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCurrentMessage(value);
                    setShowAutocomplete(value === '/');
                  }}
                  onKeyDown={(e) => {
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

        <Modal
          isOpen={showLinkModal}
          title="Confirm Navigation"
          description={`You are about to open this link: ${linkToOpen}`}
          confirmText="Open Link"
          confirmVariant="primary"
          onCancel={() => setShowLinkModal(false)}
          onConfirm={() => {
            window.open(linkToOpen, '_blank');
            setShowLinkModal(false);
          }}
        />

        <Modal
          isOpen={showBackModal}
          title="Leave Chat?"
          description="Are you sure you want to leave this chat session? You will need the session code to rejoin."
          confirmText="Leave Chat"
          confirmVariant="danger"
          onCancel={() => setShowBackModal(false)}
          onConfirm={() => {
            cleanupEventSource();
            resetState();
            router.push('/');
            setShowBackModal(false);
          }}
        />
      </div>
    );
  }

  // If not in chat, render the session code input for the landing page
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-4xl font-semibold text-white">ChatS</h1>
      <input
      type="text"
      value={sessionCode}
      onChange={(e) => {
        const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4);
        setSessionCode(value);
        onSessionCodeChange?.(value);
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
  );
}

export default Home;

