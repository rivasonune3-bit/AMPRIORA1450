import React from 'react';
import { ResumeData } from '../types';

export default function ModernBlue({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-gray-800 p-8 font-sans h-full w-full break-words">
      <div className="mb-8 border-b-2 border-blue-600 pb-4">
        <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">{data.name || 'YOUR NAME'}</h1>
        {data.targetRole && <p className="text-lg text-blue-700 font-medium mt-1">{data.targetRole}</p>}
        <div className="text-sm mt-3 flex flex-wrap gap-4 text-gray-600">
          {data.email && <span className="flex items-center gap-1">✉ {data.email}</span>}
          {data.phone && <span className="flex items-center gap-1">☎ {data.phone}</span>}
          {data.linkedin && <span className="flex items-center gap-1">in {data.linkedin}</span>}
          {data.github && <span className="flex items-center gap-1">git {data.github}</span>}
        </div>
      </div>

      {data.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-800 mb-2">Summary</h2>
          <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 space-y-6 border-r border-gray-200 pr-6">
          {(data.education) && (
            <div>
              <h2 className="text-xl font-bold text-blue-800 mb-3">Education</h2>
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{data.education}</p>
            </div>
          )}
          {(data.skills) && (
            <div>
              <h2 className="text-xl font-bold text-blue-800 mb-3">Skills</h2>
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{data.skills}</p>
            </div>
          )}
          {data.achievements && (
            <div>
              <h2 className="text-xl font-bold text-blue-800 mb-3">Achievements</h2>
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{data.achievements}</p>
            </div>
          )}
        </div>
        
        <div className="col-span-2 space-y-6">
          {data.experience && data.experience.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-blue-800 mb-4">Experience</h2>
              <div className="space-y-5">
                {data.experience.map((ex, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-gray-900 text-base">{ex.role || 'Role'}</span>
                      {(ex.startDate || ex.endDate) && <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">{ex.startDate} - {ex.endDate}</span>}
                    </div>
                    <div className="text-sm text-blue-700 font-medium mb-2">{ex.company || 'Company Name'}</div>
                    <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{ex.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.projects && data.projects.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-blue-800 mb-4">Projects</h2>
              <div className="space-y-5">
                {data.projects.map((p, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-bold text-gray-900 text-base">{p.title || 'Project'}</span>
                    </div>
                    {(p.technologies || p.link) && (
                      <div className="text-xs text-blue-700 mb-2 flex gap-3">
                        {p.technologies && <span>{p.technologies}</span>}
                        {p.link && <a href={p.link} className="underline">{p.link}</a>}
                      </div>
                    )}
                    <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
