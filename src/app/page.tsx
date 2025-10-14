'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
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
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const uuid = searchParams.get('uuid');

    if (code && uuid) {
      setIsInChat(true);
      setChatCode(code);
      setChatUuid(uuid);
    }
  }, [searchParams]);

  useEffect(() => {
    const checkSessionExists = async () => {
      if (sessionCode.length === 4 && !isGeneratedCode) {
        try {
          const response = await fetch(`/api/sessions?code=${sessionCode}`);
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
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const alphanumeric = letters + numbers;

    const positions = [0, 1, 2, 3];
    const shuffled = positions.sort(() => Math.random() - 0.5);

    const letterPos = shuffled[0];
    const numberPos = shuffled[1];

    let code = '';
    for (let i = 0; i < 4; i++) {
      if (i === letterPos) {
        code += letters[Math.floor(Math.random() * letters.length)];
      } else if (i === numberPos) {
        code += numbers[Math.floor(Math.random() * numbers.length)];
      } else {
        code += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
      }
    }

    return code;
  };

  const handleCreateChat = async () => {
    currentTimeouts.forEach(timeout => clearTimeout(timeout));
    setCurrentTimeouts([]);
    const code = sessionCode.length === 4 ? sessionCode : generateRandomCode();
    setSessionCode('');
    setIsCreating(true);
    setIsGeneratedCode(true);

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, peerUuid: userUuid }),
      });

      if (!response.ok) {
        setIsGeneratedCode(false);
      }
    } catch (error) {
      setIsGeneratedCode(false);
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

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && sessionCode.length === 4 && (isGeneratedCode || !hasCheckedSession || sessionExists)) {
      const response = await fetch(`/api/sessions?code=${sessionCode}`);
      const data = await response.json();

      if (data.exists) {
        router.push(`/?code=${sessionCode}&uuid=${data.peer_uuid}`);
      } else {
        const createResponse = await fetch('/api/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: sessionCode, peerUuid: userUuid }),
        });

        if (createResponse.ok) {
          router.push(`/?code=${sessionCode}&uuid=${userUuid}`);
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
              setIsInChat(false);
              setChatCode('');
              setChatUuid('');
              setIsGeneratedCode(false);
              setSessionExists(false);
              setHasCheckedSession(false);
              setSessionCode('');
              router.push('/');
            }}
            className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8" style={{ backgroundColor: 'rgb(25, 24, 36)' }}>
      <h1 className="text-4xl font-bold text-white">MorseSignalChat</h1>

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
          <h3 className="text-xl font-semibold text-white mb-3">Peer-to-Peer</h3>
          <p className="text-white/70 text-sm leading-relaxed">Connect directly to other computers.</p>
        </div>

        <div className="bg-white/5 border border-white/20 rounded-xl p-6 text-center hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105">
          <h3 className="text-xl font-semibold text-white mb-3">Morse Code</h3>
          <p className="text-white/70 text-sm leading-relaxed">Optionally encrypt your messages with morse code for fun!</p>
        </div>

        <div className="bg-white/3 border border-white/10 rounded-xl p-6 text-center hover:bg-white/5 hover:border-white/20 transition-all duration-300 hover:scale-105 opacity-60">
          <h3 className="text-xl font-semibold text-white mb-3">...</h3>
          <p className="text-white/50 text-sm leading-relaxed">Coming Soon...</p>
        </div>
      </div>
    </div>
  );
}
