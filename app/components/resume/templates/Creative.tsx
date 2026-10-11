import React from 'react';
import { ResumeData } from '../types';

export default function Creative({ data }: { data: ResumeData }) {
  return (
    <div className="bg-[#FAF9F6] text-gray-800 font-sans h-full w-full flex break-words overflow-hidden">
      <div className="w-1/3 bg-[#2A3B4C] text-white p-8">
        <div className="w-24 h-24 bg-white/10 rounded-full mb-6 flex items-center justify-center text-3xl font-bold text-white/50">
          {data.name?.charAt(0) || 'R'}
        </div>
        
        <h2 className="uppercase tracking-wider text-xs font-bold text-white/50 mb-2 border-b border-white/20 pb-1">Contact</h2>
        <div className="space-y-2 text-sm mb-8 text-white/80">
          {data.email && <div>{data.email}</div>}
          {data.phone && <div>{data.phone}</div>}
          {data.linkedin && <div>{data.linkedin}</div>}
          {data.github && <div>{data.github}</div>}
        </div>

        {data.skills && (
          <div className="mb-8">
            <h2 className="uppercase tracking-wider text-xs font-bold text-white/50 mb-3 border-b border-white/20 pb-1">Skills</h2>
            <p className="text-sm whitespace-pre-wrap text-white/80">{data.skills}</p>
          </div>
        )}

        {data.education && (
          <div>
            <h2 className="uppercase tracking-wider text-xs font-bold text-white/50 mb-3 border-b border-white/20 pb-1">Education</h2>
            <p className="text-sm whitespace-pre-wrap text-white/80">{data.education}</p>
          </div>
        )}
      </div>
      
      <div className="w-2/3 p-8">
        <h1 className="text-5xl font-extrabold text-[#2A3B4C] mb-2">{data.name || 'YOUR NAME'}</h1>
        {data.targetRole && <p className="text-xl text-[#D4AF37] font-semibold mb-6">{data.targetRole}</p>}

        {data.summary && (
          <div className="mb-8">
            <p className="text-sm leading-relaxed text-gray-600 italic">"{data.summary}"</p>
          </div>
        )}

        {data.experience && data.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#2A3B4C] mb-4 flex items-center">
              <span className="w-8 h-px bg-[#D4AF37] mr-3"></span> Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((ex, idx) => (
                <div key={idx} className="relative pl-4 border-l-2 border-[#E5E7EB]">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#D4AF37]"></div>
                  <div className="font-bold text-[#2A3B4C]">{ex.role}</div>
                  <div className="text-sm text-[#D4AF37] font-medium mb-2">{ex.company} {(ex.startDate || ex.endDate) && `(${ex.startDate} - ${ex.endDate})`}</div>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{ex.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.projects && data.projects.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#2A3B4C] mb-4 flex items-center">
              <span className="w-8 h-px bg-[#D4AF37] mr-3"></span> Projects
            </h2>
            <div className="space-y-4">
              {data.projects.map((p, idx) => (
                <div key={idx} className="bg-white p-4 shadow-sm border border-gray-100 rounded-lg">
                  <div className="font-bold text-[#2A3B4C]">{p.title}</div>
                  {p.technologies && <div className="text-xs text-gray-400 mb-2">{p.technologies}</div>}
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
