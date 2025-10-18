'use client';

import { useState, useEffect, useRef } from "react";
import Modal from "../components/Modal";

interface GitHubButtonProps {
  sessionCode?: string;
}

export default function GitHubButton({ sessionCode }: GitHubButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide modal after 10 seconds
  useEffect(() => {
    if (isModalOpen) {
      timeoutRef.current = setTimeout(() => {
        setIsModalOpen(false);
      }, 10000); // 10 seconds
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isModalOpen]);

  const handleGitHubClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    window.open('https://github.com/gamerc0der/morsesignalchat', '_blank', 'noopener,noreferrer');
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Only show GitHub button when no session exists
  if (sessionCode) {
    return null;
  }

  return (
    <>
      {/* GitHub Icon - Fixed at bottom right */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={handleGitHubClick}
          className="flex items-center justify-center w-12 h-12 bg-gray-800/80 hover:bg-gray-700/90 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-full text-white hover:text-gray-200 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="View source code on GitHub"
        >
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Visit GitHub Repository"
        description="You are about to navigate to the Morse Signal Chat source code repository on GitHub. This will open in a new tab."
        confirmText="Open GitHub"
        confirmVariant="primary"
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  );
}
