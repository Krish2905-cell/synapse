import React from 'react';

export default function InvitationCard({ invitation, onRespond }) {
  return (
    <div className="card border-l-4 border-indigo-400">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold flex-shrink-0">
          {invitation.projectId?.name?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{invitation.projectId?.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Invited by {invitation.senderId?.name}
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onRespond(invitation._id, 'accepted')}
          className="btn-primary text-xs py-1.5 px-3 flex-1"
        >
          Accept
        </button>
        <button
          onClick={() => onRespond(invitation._id, 'rejected')}
          className="btn-secondary text-xs py-1.5 px-3 flex-1"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
