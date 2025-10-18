'use client';

import { Suspense, useState } from 'react';
import Chat from '../components/Chat';
import GitHubButton from './GitHubButton';

export default function Page() {
  const [sessionCode, setSessionCode] = useState('');

  const handleCreateChat = async () => {
    try {
      const response = await fetch('https://gamerc0der-http.hf.space/api/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ client_id: 'temp-' + Math.random().toString(36).substring(2, 15) }),
      });

      if (response.ok) {
        const data = await response.json();
        setSessionCode(data.session_code);
      }
    } catch (error) {
      console.error('Failed to generate session code:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'rgb(25, 24, 36)' }}>
      <div className="flex-grow flex flex-col items-center justify-center gap-8 p-8">
        <div className="transition-opacity duration-500 opacity-100">
          <Suspense fallback={<div className="w-64 h-24 bg-white/10 rounded animate-pulse"></div>}>
            <Chat sessionCode={sessionCode} onSessionCodeChange={setSessionCode} />
          </Suspense>
        </div>

        <button
          onClick={handleCreateChat}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-200 mt-4 text-sm cursor-pointer"
        >
          Create Chat
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Features Section - Hidden when session exists */}
        {!sessionCode && (
          <div className="max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors duration-200">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Real-time Messaging</h3>
                <p className="text-gray-300 text-sm">Instant messaging with session codes</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors duration-200">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Morse Code Support</h3>
                <p className="text-gray-300 text-sm">Encode and decode Morse code</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors duration-200">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Reply System</h3>
                <p className="text-gray-300 text-sm">Reply to messages with context</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <GitHubButton sessionCode={sessionCode} />
    </div>
  );
}

