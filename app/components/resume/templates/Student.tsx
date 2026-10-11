import React from 'react';
import { ResumeData } from '../types';

export default function Student({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-gray-800 p-8 font-sans h-full w-full break-words">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.name || 'YOUR NAME'}</h1>
        <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600 bg-gray-50 py-2 rounded-full px-6 inline-flex mx-auto">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>• {data.phone}</span>}
          {data.linkedin && <span>• {data.linkedin}</span>}
          {data.github && <span>• {data.github}</span>}
        </div>
      </div>

      {data.summary && (
        <div className="mb-6 text-center max-w-2xl mx-auto">
          <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
        </div>
      )}

      {data.education && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b-2 border-green-500 mb-3 pb-1 inline-block">Education</h2>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap font-medium">{data.education}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 mb-6">
        {data.skills && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-yellow-400 mb-3 pb-1 inline-block">Skills</h2>
            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{data.skills}</p>
          </div>
        )}
        {data.achievements && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-purple-500 mb-3 pb-1 inline-block">Achievements & Extracurriculars</h2>
            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{data.achievements}</p>
          </div>
        )}
      </div>

      {data.projects && data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b-2 border-blue-500 mb-4 pb-1 inline-block">Academic & Personal Projects</h2>
          <div className="space-y-4">
            {data.projects.map((p, idx) => (
              <div key={idx} className="pl-4 border-l-2 border-blue-200">
                <div className="font-bold text-gray-900">{p.title}</div>
                {p.technologies && <div className="text-xs text-blue-600 font-medium mb-1">{p.technologies}</div>}
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.experience && data.experience.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 border-b-2 border-orange-500 mb-4 pb-1 inline-block">Internships & Experience</h2>
          <div className="space-y-4">
            {data.experience.map((ex, idx) => (
              <div key={idx} className="pl-4 border-l-2 border-orange-200">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-gray-900">{ex.role}</span>
                  {(ex.startDate || ex.endDate) && <span className="text-xs text-gray-500">{ex.startDate} - {ex.endDate}</span>}
                </div>
                <div className="text-sm text-gray-600 font-medium mb-1">{ex.company}</div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{ex.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
