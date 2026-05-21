import React from 'react';

export default function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="3" fill="white" />
          <path d="M12 2C12 2 8 6 8 12C8 18 12 22 12 22" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 2C12 2 16 6 16 12C16 18 12 22 12 22" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <path d="M2 12H22" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <span className="font-bold text-gray-900 text-lg tracking-tight">Synapse</span>
    </div>
  );
}
