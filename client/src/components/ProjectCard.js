import React from 'react';
import Avatar from './Avatar';

export default function ProjectCard({ project, onClick }) {
  const memberCount = (project.members?.length || 0) + 1; // +1 for owner
  return (
    <div
      onClick={onClick}
      className="card cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: project.color || '#6366f1' }}
        >
          {project.name[0].toUpperCase()}
        </div>
        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
          {memberCount} member{memberCount !== 1 ? 's' : ''}
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
        {project.name}
      </h3>
      {project.description && (
        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{project.description}</p>
      )}
      <div className="flex items-center justify-between mt-4">
        <div className="flex -space-x-1.5">
          <Avatar user={project.owner} size="sm" title={`${project.owner.name} (owner)`} />
          {project.members?.slice(0, 3).map(m => (
            <Avatar key={m._id} user={m} size="sm" />
          ))}
        </div>
        <span className="text-xs text-gray-400">
          {new Date(project.updatedAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
