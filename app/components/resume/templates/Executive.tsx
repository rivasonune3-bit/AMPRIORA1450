import React from 'react';
import { ResumeData } from '../types';

export default function Executive({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-gray-900 p-10 font-serif h-full w-full break-words border-t-8 border-gray-900">
      <div className="text-center mb-8 pb-8 border-b border-gray-300">
        <h1 className="text-4xl font-bold uppercase tracking-widest text-gray-900 mb-3">{data.name || 'YOUR NAME'}</h1>
        {data.targetRole && <p className="text-lg font-medium text-gray-600 uppercase tracking-widest mb-4">{data.targetRole}</p>}
        <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-500 font-sans">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>| {data.phone}</span>}
          {data.linkedin && <span>| {data.linkedin}</span>}
        </div>
      </div>

      {data.summary && (
        <div className="mb-8">
          <h2 className="text-center uppercase text-sm font-bold tracking-widest text-gray-900 mb-4">Executive Summary</h2>
          <p className="text-sm leading-relaxed text-gray-700 text-justify">{data.summary}</p>
        </div>
      )}

      {data.experience && data.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-center uppercase text-sm font-bold tracking-widest text-gray-900 mb-6">Professional Experience</h2>
          <div className="space-y-6">
            {data.experience.map((ex, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-gray-900 text-base">{ex.company}</span>
                  <span className="text-sm font-sans text-gray-500 uppercase">{(ex.startDate || ex.endDate) ? `${ex.startDate} - ${ex.endDate}` : ''}</span>
                </div>
                <div className="text-sm italic text-gray-700 mb-2">{ex.role}</div>
                <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{ex.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        <div>
          {data.education && (
            <div className="mb-8">
              <h2 className="uppercase text-sm font-bold tracking-widest text-gray-900 mb-4 border-b border-gray-300 pb-2">Education</h2>
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{data.education}</p>
            </div>
          )}
          {data.skills && (
            <div>
              <h2 className="uppercase text-sm font-bold tracking-widest text-gray-900 mb-4 border-b border-gray-300 pb-2">Core Competencies</h2>
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{data.skills}</p>
            </div>
          )}
        </div>
        
        <div>
          {data.projects && data.projects.length > 0 && (
            <div className="mb-8">
              <h2 className="uppercase text-sm font-bold tracking-widest text-gray-900 mb-4 border-b border-gray-300 pb-2">Key Initiatives</h2>
              <div className="space-y-4">
                {data.projects.map((p, idx) => (
                  <div key={idx}>
                    <div className="font-bold text-sm text-gray-900">{p.title}</div>
                    <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.achievements && (
            <div>
              <h2 className="uppercase text-sm font-bold tracking-widest text-gray-900 mb-4 border-b border-gray-300 pb-2">Achievements</h2>
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{data.achievements}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
