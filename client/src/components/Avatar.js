import React from 'react';

const COLORS = [
  'bg-indigo-500', 'bg-purple-500', 'bg-pink-500',
  'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500',
];

const getColor = (name = '') => COLORS[name.charCodeAt(0) % COLORS.length];

export default function Avatar({ user, size = 'md', title }) {
  const sizeClass = size === 'sm' ? 'w-7 h-7 text-xs' : size === 'lg' ? 'w-10 h-10 text-base' : 'w-8 h-8 text-sm';
  return (
    <div
      title={title || user?.name}
      className={`${sizeClass} ${getColor(user?.name)} rounded-full border-2 border-white flex items-center justify-center text-white font-semibold flex-shrink-0`}
    >
      {user?.name?.[0]?.toUpperCase() || '?'}
    </div>
  );
}
