import React from 'react';
import { ResumeData } from '../types';

export default function ATSProfessional({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-black p-8 font-serif h-full w-full break-words">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wider">{data.name || 'YOUR NAME'}</h1>
        <div className="text-sm mt-2 flex flex-wrap justify-center gap-3">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>• {data.phone}</span>}
          {data.linkedin && <span>• {data.linkedin}</span>}
          {data.github && <span>• {data.github}</span>}
        </div>
        {data.targetRole && <p className="text-sm font-semibold mt-1">{data.targetRole}</p>}
      </div>

      {data.summary && (
        <div className="mb-5">
          <h2 className="uppercase text-sm font-bold border-b border-black mb-2 pb-1">Professional Summary</h2>
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </div>
      )}

      {(data.skills || data.education) && (
        <div className="mb-5 space-y-4">
          {data.education && (
            <div>
              <h2 className="uppercase text-sm font-bold border-b border-black mb-2 pb-1">Education</h2>
              <p className="text-sm leading-relaxed">{data.education}</p>
            </div>
          )}
          {data.skills && (
            <div>
              <h2 className="uppercase text-sm font-bold border-b border-black mb-2 pb-1">Skills</h2>
              <p className="text-sm leading-relaxed">{data.skills}</p>
            </div>
          )}
        </div>
      )}

      {data.experience && data.experience.length > 0 && (
        <div className="mb-5">
          <h2 className="uppercase text-sm font-bold border-b border-black mb-3 pb-1">Experience</h2>
          <div className="space-y-4">
            {data.experience.map((ex, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-sm">{ex.role || 'Role Title'}</span>
                  <span className="text-sm italic">{ex.company || 'Company Name'}</span>
                </div>
                {(ex.startDate || ex.endDate) && <div className="text-xs text-gray-700 mb-1">{ex.startDate} - {ex.endDate}</div>}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{ex.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.projects && data.projects.length > 0 && (
        <div className="mb-5">
          <h2 className="uppercase text-sm font-bold border-b border-black mb-3 pb-1">Projects</h2>
          <div className="space-y-4">
            {data.projects.map((p, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-sm">{p.title || 'Project Title'}</span>
                  {p.link && <span className="text-xs text-blue-600 underline">{p.link}</span>}
                </div>
                {p.technologies && <div className="text-xs italic text-gray-700 mb-1">{p.technologies}</div>}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.achievements && (
        <div className="mb-5">
          <h2 className="uppercase text-sm font-bold border-b border-black mb-2 pb-1">Achievements</h2>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.achievements}</p>
        </div>
      )}
    </div>
  );
}
