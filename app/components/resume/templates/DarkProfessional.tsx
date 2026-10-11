import React from 'react';
import { ResumeData } from '../types';

export default function DarkProfessional({ data }: { data: ResumeData }) {
  return (
    <div className="bg-gray-900 text-gray-300 p-8 font-sans h-full w-full break-words">
      <div className="mb-8 border-b border-gray-700 pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{data.name || 'YOUR NAME'}</h1>
          {data.targetRole && <p className="text-xl text-teal-400 font-medium">{data.targetRole}</p>}
        </div>
        <div className="text-right text-sm text-gray-400 space-y-1">
          {data.email && <div>{data.email}</div>}
          {data.phone && <div>{data.phone}</div>}
          {data.linkedin && <div>{data.linkedin}</div>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          {data.summary && (
            <div>
              <h2 className="text-lg font-bold text-white mb-3 flex items-center">
                <span className="w-4 h-4 bg-teal-500 rounded-sm mr-2"></span> Summary
              </h2>
              <p className="text-sm leading-relaxed text-gray-300">{data.summary}</p>
            </div>
          )}

          {data.experience && data.experience.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                <span className="w-4 h-4 bg-teal-500 rounded-sm mr-2"></span> Experience
              </h2>
              <div className="space-y-6">
                {data.experience.map((ex, idx) => (
                  <div key={idx} className="relative border-l border-gray-700 pl-4 ml-2">
                    <div className="absolute w-2 h-2 bg-teal-400 rounded-full -left-[4.5px] top-1.5"></div>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-bold text-white text-base">{ex.role}</span>
                    </div>
                    <div className="text-sm text-teal-400 mb-2">{ex.company} <span className="text-gray-500 ml-2">{(ex.startDate || ex.endDate) && `${ex.startDate} - ${ex.endDate}`}</span></div>
                    <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">{ex.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.projects && data.projects.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                <span className="w-4 h-4 bg-teal-500 rounded-sm mr-2"></span> Projects
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {data.projects.map((p, idx) => (
                  <div key={idx} className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-teal-500 transition-colors">
                    <div className="font-bold text-white mb-1">{p.title}</div>
                    {p.technologies && <div className="text-xs text-teal-400 mb-2">{p.technologies}</div>}
                    <p className="text-xs leading-relaxed text-gray-400 whitespace-pre-wrap">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-1 space-y-8">
          {data.skills && (
            <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
              <h2 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Skills</h2>
              <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">{data.skills}</p>
            </div>
          )}

          {data.education && (
            <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
              <h2 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Education</h2>
              <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">{data.education}</p>
            </div>
          )}

          {data.achievements && (
            <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
              <h2 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Achievements</h2>
              <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">{data.achievements}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
