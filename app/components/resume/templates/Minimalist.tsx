import React from 'react';
import { ResumeData } from '../types';

export default function Minimalist({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-gray-900 p-10 font-sans font-light tracking-wide h-full w-full break-words">
      <div className="mb-10 text-right">
        <h1 className="text-4xl font-light tracking-widest text-black mb-2">{data.name || 'YOUR NAME'}</h1>
        {data.targetRole && <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">{data.targetRole}</p>}
        <div className="text-xs text-gray-400 space-y-1">
          {data.email && <div>{data.email}</div>}
          {data.phone && <div>{data.phone}</div>}
          {data.linkedin && <div>{data.linkedin}</div>}
        </div>
      </div>

      <div className="space-y-8">
        {data.summary && (
          <div className="flex">
            <div className="w-1/4 text-xs uppercase tracking-widest text-gray-400 pt-1">About</div>
            <div className="w-3/4 text-sm leading-relaxed text-gray-700">{data.summary}</div>
          </div>
        )}

        {data.experience && data.experience.length > 0 && (
          <div className="flex">
            <div className="w-1/4 text-xs uppercase tracking-widest text-gray-400 pt-1">Experience</div>
            <div className="w-3/4 space-y-6">
              {data.experience.map((ex, idx) => (
                <div key={idx}>
                  <div className="font-medium text-black text-sm">{ex.role}</div>
                  <div className="text-xs text-gray-500 mb-2">{ex.company} {(ex.startDate || ex.endDate) && `| ${ex.startDate} - ${ex.endDate}`}</div>
                  <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">{ex.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.projects && data.projects.length > 0 && (
          <div className="flex">
            <div className="w-1/4 text-xs uppercase tracking-widest text-gray-400 pt-1">Projects</div>
            <div className="w-3/4 space-y-6">
              {data.projects.map((p, idx) => (
                <div key={idx}>
                  <div className="font-medium text-black text-sm">{p.title}</div>
                  {p.technologies && <div className="text-xs text-gray-500 mb-2">{p.technologies}</div>}
                  <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {(data.education || data.skills || data.achievements) && (
          <div className="flex">
            <div className="w-1/4 text-xs uppercase tracking-widest text-gray-400 pt-1">Details</div>
            <div className="w-3/4 space-y-4">
              {data.education && (
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Education</div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">{data.education}</div>
                </div>
              )}
              {data.skills && (
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Skills</div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">{data.skills}</div>
                </div>
              )}
              {data.achievements && (
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Achievements</div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">{data.achievements}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
