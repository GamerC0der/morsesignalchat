'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [sessionCode, setSessionCode] = useState('');
  const router = useRouter();

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

  const handleCreateChat = () => {
    const code = generateRandomCode();
    setSessionCode('');

    for (let i = 0; i < code.length; i++) {
      setTimeout(() => {
        setSessionCode(prev => prev + code[i]);
      }, i * 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && sessionCode.length === 4) {
      router.push(`/?code=${sessionCode}`);
    }
  };

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
          }}
          onKeyPress={handleKeyPress}
          className="px-4 py-4 text-center text-6xl font-mono bg-transparent border-2 border-white/20 text-white focus:border-white/60 focus:outline-none transition-colors duration-200 w-64"
          style={{ borderRadius: '12px' }}
          maxLength={4}
        />
      </div>

      <button onClick={handleCreateChat} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-200 mt-4 text-sm cursor-pointer">
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
