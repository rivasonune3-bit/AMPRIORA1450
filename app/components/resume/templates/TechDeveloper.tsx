import React from 'react';
import { ResumeData } from '../types';

export default function TechDeveloper({ data }: { data: ResumeData }) {
  return (
    <div className="bg-[#0D1117] text-[#C9D1D9] p-8 font-mono h-full w-full break-words text-sm">
      <div className="border-b border-[#30363D] pb-4 mb-6">
        <h1 className="text-3xl font-bold text-[#58A6FF] mb-2">{'>'} {data.name || 'user'}</h1>
        <div className="text-[#8B949E] space-y-1">
          {data.targetRole && <div>ROLE: "{data.targetRole}"</div>}
          {data.email && <div>EMAIL: "{data.email}"</div>}
          {data.github && <div>GITHUB: "{data.github}"</div>}
          {data.linkedin && <div>LINKEDIN: "{data.linkedin}"</div>}
        </div>
      </div>

      <div className="space-y-6">
        {data.summary && (
          <div>
            <h2 className="text-[#3FB950] font-bold mb-2">## SUMMARY</h2>
            <p className="whitespace-pre-wrap">{data.summary}</p>
          </div>
        )}

        {data.skills && (
          <div>
            <h2 className="text-[#3FB950] font-bold mb-2">## SKILLS</h2>
            <div className="text-[#D2A8FF]">{`[ ${data.skills} ]`}</div>
          </div>
        )}

        {data.experience && data.experience.length > 0 && (
          <div>
            <h2 className="text-[#3FB950] font-bold mb-3">## EXPERIENCE</h2>
            <div className="space-y-4 border-l-2 border-[#30363D] pl-4">
              {data.experience.map((ex, idx) => (
                <div key={idx}>
                  <div className="text-[#58A6FF] font-bold">{ex.role} <span className="text-[#8B949E] font-normal">@ {ex.company}</span></div>
                  {(ex.startDate || ex.endDate) && <div className="text-xs text-[#8B949E] mb-2">/* {ex.startDate} to {ex.endDate} */</div>}
                  <p className="whitespace-pre-wrap text-[#C9D1D9]">{ex.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.projects && data.projects.length > 0 && (
          <div>
            <h2 className="text-[#3FB950] font-bold mb-3">## PROJECTS</h2>
            <div className="grid grid-cols-1 gap-4">
              {data.projects.map((p, idx) => (
                <div key={idx} className="border border-[#30363D] rounded-md p-4 bg-[#161B22]">
                  <div className="text-[#58A6FF] font-bold mb-1">{p.title}</div>
                  {p.technologies && <div className="text-[#D2A8FF] text-xs mb-2">uses: {p.technologies}</div>}
                  {p.link && <div className="text-[#8B949E] text-xs mb-2">link: {p.link}</div>}
                  <p className="whitespace-pre-wrap text-sm">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.education && (
          <div>
            <h2 className="text-[#3FB950] font-bold mb-2">## EDUCATION</h2>
            <p className="whitespace-pre-wrap">{data.education}</p>
          </div>
        )}
      </div>
    </div>
  );
}
