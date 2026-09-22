import React from 'react';
import { ResumeData } from '../types';

export default function AIDataScience({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-gray-900 p-8 font-sans h-full w-full break-words">
      <div className="flex justify-between items-end border-b-4 border-indigo-600 pb-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-1">{data.name || 'YOUR NAME'}</h1>
          <h2 className="text-xl text-indigo-600 font-medium">{data.targetRole || 'Data Scientist / AI Engineer'}</h2>
        </div>
        <div className="text-right text-xs text-gray-600 space-y-1">
          {data.email && <div>{data.email}</div>}
          {data.phone && <div>{data.phone}</div>}
          {data.linkedin && <div>{data.linkedin}</div>}
          {data.github && <div>{data.github}</div>}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          {data.summary && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 uppercase mb-2 flex items-center">
                <span className="bg-indigo-600 w-2 h-2 inline-block mr-2"></span> Profile
              </h3>
              <p className="text-sm leading-relaxed text-gray-700 bg-gray-50 p-3 border-l-4 border-indigo-200">{data.summary}</p>
            </div>
          )}

          {data.experience && data.experience.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 uppercase mb-4 flex items-center">
                <span className="bg-indigo-600 w-2 h-2 inline-block mr-2"></span> Experience
              </h3>
              <div className="space-y-4">
                {data.experience.map((ex, idx) => (
                  <div key={idx} className="border border-gray-100 rounded p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-bold text-gray-900">{ex.role}</div>
                      <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                        {ex.startDate} - {ex.endDate || 'Present'}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-600 mb-2">{ex.company}</div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{ex.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.projects && data.projects.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 uppercase mb-4 flex items-center">
                <span className="bg-indigo-600 w-2 h-2 inline-block mr-2"></span> ML / Data Projects
              </h3>
              <div className="space-y-4">
                {data.projects.map((p, idx) => (
                  <div key={idx} className="border border-gray-100 rounded p-4 shadow-sm">
                    <div className="font-bold text-gray-900 mb-1">{p.title}</div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap mb-2">{p.description}</p>
                    {p.technologies && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.technologies.split(',').map((tech, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-4 space-y-6 border-l border-gray-200 pl-6">
          {data.skills && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 uppercase mb-3 flex items-center">
                <span className="bg-indigo-600 w-2 h-2 inline-block mr-2"></span> Tech Stack
              </h3>
              <div className="text-sm text-gray-700 leading-relaxed space-y-1 whitespace-pre-wrap">
                {data.skills}
              </div>
            </div>
          )}

          {data.education && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 uppercase mb-3 flex items-center">
                <span className="bg-indigo-600 w-2 h-2 inline-block mr-2"></span> Education
              </h3>
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {data.education}
              </div>
            </div>
          )}

          {data.achievements && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 uppercase mb-3 flex items-center">
                <span className="bg-indigo-600 w-2 h-2 inline-block mr-2"></span> Achievements
              </h3>
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {data.achievements}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
