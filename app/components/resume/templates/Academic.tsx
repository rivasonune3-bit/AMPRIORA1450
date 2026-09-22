import React from 'react';
import { ResumeData } from '../types';

export default function Academic({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-black p-10 font-serif h-full w-full break-words leading-relaxed">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-1">{data.name || 'YOUR NAME'}</h1>
        <div className="text-sm">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span> • {data.phone}</span>}
          {data.linkedin && <span> • {data.linkedin}</span>}
        </div>
      </div>

      <div className="space-y-6">
        {data.education && (
          <div>
            <h2 className="text-lg font-bold border-b border-black mb-2 uppercase tracking-wide">Education</h2>
            <p className="text-sm whitespace-pre-wrap">{data.education}</p>
          </div>
        )}

        {data.experience && data.experience.length > 0 && (
          <div>
            <h2 className="text-lg font-bold border-b border-black mb-3 uppercase tracking-wide">Academic & Research Experience</h2>
            <div className="space-y-4">
              {data.experience.map((ex, idx) => (
                <div key={idx}>
                  <div className="flex justify-between font-bold text-sm">
                    <span>{ex.role}, {ex.company}</span>
                    <span>{(ex.startDate || ex.endDate) ? `${ex.startDate} - ${ex.endDate}` : ''}</span>
                  </div>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{ex.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.projects && data.projects.length > 0 && (
          <div>
            <h2 className="text-lg font-bold border-b border-black mb-3 uppercase tracking-wide">Publications & Projects</h2>
            <ul className="list-disc list-outside ml-4 space-y-2">
              {data.projects.map((p, idx) => (
                <li key={idx} className="text-sm">
                  <span className="font-bold">{p.title}</span>. {p.description} {p.link && <span className="italic">{p.link}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.skills && (
          <div>
            <h2 className="text-lg font-bold border-b border-black mb-2 uppercase tracking-wide">Technical Skills</h2>
            <p className="text-sm whitespace-pre-wrap">{data.skills}</p>
          </div>
        )}

        {data.achievements && (
          <div>
            <h2 className="text-lg font-bold border-b border-black mb-2 uppercase tracking-wide">Honors & Awards</h2>
            <p className="text-sm whitespace-pre-wrap">{data.achievements}</p>
          </div>
        )}
      </div>
    </div>
  );
}
