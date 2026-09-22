import React from 'react';
import { ResumeData } from './types';

// Existing Templates
import ATSProfessional from './templates/ATSProfessional';
import ModernBlue from './templates/ModernBlue';
import Executive from './templates/Executive';
import TechDeveloper from './templates/TechDeveloper';
import Creative from './templates/Creative';
import AIDataScience from './templates/AIDataScience';
import Student from './templates/Student';
import Minimalist from './templates/Minimalist';
import DarkProfessional from './templates/DarkProfessional';
import Academic from './templates/Academic';

export interface TemplateDefinition {
  id: string;
  name: string;
  category: 'ATS Friendly' | 'Minimal' | 'Modern' | 'Professional' | 'Corporate' | 'Software Engineering' | 'AI / ML' | 'Fresher / Student' | 'Academic / Research' | 'Creative' | 'Dark Theme';
  description: string;
  badge?: string;
  component: React.ComponentType<{ data: ResumeData }>;
}

// Additional Simple & Production Templates
function ATSSimple({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-black p-8 font-mono h-full w-full text-xs leading-relaxed">
      <div className="border-b-2 border-black pb-4 mb-4">
        <h1 className="text-2xl font-bold uppercase">{data.name || 'YOUR NAME'}</h1>
        <p className="font-semibold text-slate-700 mt-1">{data.targetRole}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600">
          {data.email && <span>Email: {data.email}</span>}
          {data.phone && <span>Tel: {data.phone}</span>}
          {data.location && <span>Location: {data.location}</span>}
          {data.linkedin && <span>LinkedIn: {data.linkedin}</span>}
          {data.github && <span>GitHub: {data.github}</span>}
        </div>
      </div>

      {data.summary && (
        <div className="mb-4">
          <h2 className="font-bold uppercase tracking-wider border-b border-slate-400 mb-1 text-[11px]">Summary</h2>
          <p>{data.summary}</p>
        </div>
      )}

      {data.skills && (
        <div className="mb-4">
          <h2 className="font-bold uppercase tracking-wider border-b border-slate-400 mb-1 text-[11px]">Technical Skills</h2>
          <p>{data.skills}</p>
        </div>
      )}

      {data.experience && data.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold uppercase tracking-wider border-b border-slate-400 mb-2 text-[11px]">Experience</h2>
          <div className="space-y-3">
            {data.experience.map((ex, i) => (
              <div key={i}>
                <div className="flex justify-between font-bold">
                  <span>{ex.role} — {ex.company}</span>
                  <span>{ex.startDate} - {ex.endDate}</span>
                </div>
                <p className="whitespace-pre-wrap mt-0.5 text-slate-800">{ex.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.projects && data.projects.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold uppercase tracking-wider border-b border-slate-400 mb-2 text-[11px]">Projects</h2>
          <div className="space-y-3">
            {data.projects.map((p, i) => (
              <div key={i}>
                <div className="flex justify-between font-bold">
                  <span>{p.title}</span>
                  {p.link && <span className="underline">{p.link}</span>}
                </div>
                {p.technologies && <p className="italic text-slate-600">Tech: {p.technologies}</p>}
                <p className="whitespace-pre-wrap mt-0.5">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.education && (
        <div className="mb-4">
          <h2 className="font-bold uppercase tracking-wider border-b border-slate-400 mb-1 text-[11px]">Education</h2>
          <p>{data.education}</p>
        </div>
      )}
    </div>
  );
}

function ATSTech({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-slate-900 p-8 font-sans h-full w-full text-xs">
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{data.name || 'YOUR NAME'}</h1>
          <p className="text-sm font-bold text-sky-700 mt-0.5">{data.targetRole || 'Software Engineer'}</p>
        </div>
        <div className="text-right text-[11px] text-slate-600 space-y-0.5">
          {data.email && <div>{data.email}</div>}
          {data.phone && <div>{data.phone}</div>}
          {data.github && <div className="font-mono">{data.github}</div>}
          {data.linkedin && <div className="font-mono">{data.linkedin}</div>}
        </div>
      </div>

      {data.summary && (
        <div className="mb-4 bg-slate-50 p-3 rounded border border-slate-200">
          <h2 className="font-bold uppercase tracking-wider text-slate-900 mb-1 text-[10px]">Overview</h2>
          <p className="text-slate-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {data.skills && (
        <div className="mb-4">
          <h2 className="font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5 text-[11px]">Technical Core</h2>
          <p className="font-mono bg-slate-100 p-2 rounded text-slate-800 leading-relaxed">{data.skills}</p>
        </div>
      )}

      {data.experience && data.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2 text-[11px]">Professional History</h2>
          <div className="space-y-3">
            {data.experience.map((ex, i) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{ex.role} @ {ex.company}</span>
                  <span className="text-slate-500 font-normal">{ex.startDate} - {ex.endDate}</span>
                </div>
                <p className="whitespace-pre-wrap text-slate-700 mt-1">{ex.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.projects && data.projects.length > 0 && (
        <div className="mb-4">
          <h2 className="font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2 text-[11px]">Engineering Projects</h2>
          <div className="space-y-3">
            {data.projects.map((p, i) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{p.title}</span>
                  {p.link && <span className="text-sky-600 font-mono text-[10px]">{p.link}</span>}
                </div>
                {p.technologies && <span className="inline-block px-1.5 py-0.5 bg-sky-50 text-sky-800 font-mono text-[10px] rounded mb-1">Stack: {p.technologies}</span>}
                <p className="whitespace-pre-wrap text-slate-700">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.education && (
        <div>
          <h2 className="font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1 text-[11px]">Education</h2>
          <p className="text-slate-800">{data.education}</p>
        </div>
      )}
    </div>
  );
}

function ModernEmerald({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-slate-800 p-8 font-sans h-full w-full text-xs">
      <div className="bg-emerald-800 text-white p-6 rounded-2xl mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black">{data.name || 'YOUR NAME'}</h1>
          <p className="text-emerald-200 font-semibold text-sm mt-0.5">{data.targetRole}</p>
        </div>
        <div className="text-right text-[11px] text-emerald-100 space-y-0.5">
          {data.email && <div>{data.email}</div>}
          {data.phone && <div>{data.phone}</div>}
          {data.location && <div>{data.location}</div>}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-5">
          {data.summary && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-200 pb-1 mb-2">About Me</h2>
              <p className="leading-relaxed text-slate-600">{data.summary}</p>
            </div>
          )}

          {data.experience && data.experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-200 pb-1 mb-3">Work Experience</h2>
              <div className="space-y-4">
                {data.experience.map((ex, i) => (
                  <div key={i} className="border-l-2 border-emerald-500 pl-3">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{ex.role}</span>
                      <span className="text-slate-400 font-normal text-[10px]">{ex.startDate} - {ex.endDate}</span>
                    </div>
                    <div className="text-emerald-700 font-semibold mb-1">{ex.company}</div>
                    <p className="text-slate-600 whitespace-pre-wrap">{ex.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.projects && data.projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-200 pb-1 mb-3">Key Projects</h2>
              <div className="space-y-3">
                {data.projects.map((p, i) => (
                  <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{p.title}</span>
                      {p.link && <span className="text-emerald-600 text-[10px]">{p.link}</span>}
                    </div>
                    {p.technologies && <div className="text-[10px] text-emerald-800 font-mono mt-0.5">{p.technologies}</div>}
                    <p className="text-slate-600 mt-1 whitespace-pre-wrap">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-4 space-y-5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          {data.skills && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">Skills & Tools</h2>
              <div className="flex flex-wrap gap-1.5">
                {data.skills.split(',').map((s, i) => (
                  <span key={i} className="px-2 py-1 bg-white border border-slate-200 text-slate-700 font-medium rounded-md text-[10px]">
                    {s.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.education && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">Education</h2>
              <p className="text-slate-700 font-medium leading-relaxed">{data.education}</p>
            </div>
          )}

          {(data.linkedin || data.github || data.portfolio) && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">Links</h2>
              <div className="space-y-1 text-[10px] text-emerald-700 font-mono break-all">
                {data.linkedin && <div>{data.linkedin}</div>}
                {data.github && <div>{data.github}</div>}
                {data.portfolio && <div>{data.portfolio}</div>}
              </div>
            </div>
          )}

          {data.achievements && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">Honors</h2>
              <p className="text-slate-600 text-[11px] leading-relaxed whitespace-pre-wrap">{data.achievements}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CorporateNavy({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-slate-900 p-8 font-sans h-full w-full text-xs">
      <div className="border-b-4 border-slate-900 pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{data.name || 'YOUR NAME'}</h1>
          <p className="text-slate-600 font-bold text-sm mt-1">{data.targetRole}</p>
        </div>
        <div className="text-right text-[11px] text-slate-600 font-medium space-y-0.5">
          {data.email && <div>{data.email}</div>}
          {data.phone && <div>{data.phone}</div>}
          {data.linkedin && <div>{data.linkedin}</div>}
        </div>
      </div>

      {data.summary && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 bg-slate-100 px-3 py-1 mb-2">Executive Summary</h2>
          <p className="text-slate-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {data.experience && data.experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 bg-slate-100 px-3 py-1 mb-3">Professional Experience</h2>
          <div className="space-y-4">
            {data.experience.map((ex, i) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-slate-900">
                  <span className="text-sm">{ex.role}</span>
                  <span className="text-slate-500 font-normal">{ex.startDate} - {ex.endDate}</span>
                </div>
                <div className="text-slate-700 font-semibold mb-1">{ex.company}</div>
                <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{ex.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.skills && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 bg-slate-100 px-3 py-1 mb-2">Core Competencies</h2>
          <p className="text-slate-700 font-medium leading-relaxed">{data.skills}</p>
        </div>
      )}

      {data.education && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 bg-slate-100 px-3 py-1 mb-2">Education & Credentials</h2>
          <p className="text-slate-700 font-medium">{data.education}</p>
        </div>
      )}
    </div>
  );
}

function SoftwareEngineering({ data }: { data: ResumeData }) {
  return (
    <div className="bg-slate-950 text-slate-100 p-8 font-mono h-full w-full text-xs">
      <div className="border-b border-slate-800 pb-4 mb-6 flex justify-between items-start">
        <div>
          <div className="text-emerald-400 text-xs">// SOFTWARE ENGINEER RESUME</div>
          <h1 className="text-3xl font-extrabold text-white mt-1">{data.name || 'Your Name'}</h1>
          <p className="text-slate-400 font-bold mt-0.5">&gt; {data.targetRole || 'Software Engineer'}</p>
        </div>
        <div className="text-right text-[10px] text-slate-400 space-y-1">
          {data.email && <div>email: "{data.email}"</div>}
          {data.github && <div className="text-emerald-400">github: "{data.github}"</div>}
          {data.linkedin && <div>linkedin: "{data.linkedin}"</div>}
        </div>
      </div>

      {data.summary && (
        <div className="mb-5 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-[10px] mb-1">const bio =</div>
          <p className="text-slate-200 font-sans text-xs leading-relaxed">"{data.summary}"</p>
        </div>
      )}

      {data.skills && (
        <div className="mb-5">
          <div className="text-emerald-400 text-xs font-bold mb-2">&gt; tech_stack.list()</div>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.split(',').map((s, i) => (
              <span key={i} className="px-2.5 py-1 bg-slate-900 text-emerald-300 border border-slate-800 rounded text-[10px]">
                {s.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.projects && data.projects.length > 0 && (
        <div className="mb-5">
          <div className="text-emerald-400 text-xs font-bold mb-3">&gt; featured_projects.deploy()</div>
          <div className="space-y-3">
            {data.projects.map((p, i) => (
              <div key={i} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                <div className="flex justify-between font-bold text-white mb-1">
                  <span>{p.title}</span>
                  {p.link && <span className="text-emerald-400 text-[10px]">{p.link}</span>}
                </div>
                {p.technologies && <div className="text-[10px] text-slate-400 mb-2">Stack: {p.technologies}</div>}
                <p className="text-slate-300 font-sans text-xs leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.experience && data.experience.length > 0 && (
        <div className="mb-5">
          <div className="text-emerald-400 text-xs font-bold mb-3">&gt; work_history.log()</div>
          <div className="space-y-3">
            {data.experience.map((ex, i) => (
              <div key={i} className="bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                <div className="flex justify-between text-white font-bold">
                  <span>{ex.role} @ {ex.company}</span>
                  <span className="text-slate-400 text-[10px]">{ex.startDate} - {ex.endDate}</span>
                </div>
                <p className="text-slate-300 font-sans text-xs mt-1 leading-relaxed">{ex.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.education && (
        <div>
          <div className="text-emerald-400 text-xs font-bold mb-1">&gt; education.get()</div>
          <p className="text-slate-300 font-sans text-xs">{data.education}</p>
        </div>
      )}
    </div>
  );
}

function ModernSlate({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-slate-900 p-8 font-sans h-full w-full text-xs">
      <div className="bg-slate-900 text-white p-6 rounded-xl mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wider">{data.name || 'YOUR NAME'}</h1>
        <p className="text-slate-300 font-semibold text-sm mt-1">{data.targetRole}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-slate-300 border-t border-slate-800 pt-3">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
        </div>
      </div>

      {data.summary && (
        <div className="mb-4">
          <h2 className="font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-2 text-[11px]">Profile Summary</h2>
          <p className="text-slate-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {data.skills && (
        <div className="mb-4">
          <h2 className="font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-2 text-[11px]">Core Skills</h2>
          <p className="text-slate-800 font-medium">{data.skills}</p>
        </div>
      )}

      {data.experience && data.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-3 text-[11px]">Experience</h2>
          <div className="space-y-3">
            {data.experience.map((ex, i) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{ex.role} — {ex.company}</span>
                  <span className="text-slate-500 font-normal">{ex.startDate} - {ex.endDate}</span>
                </div>
                <p className="text-slate-700 mt-1 whitespace-pre-wrap">{ex.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.projects && data.projects.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-3 text-[11px]">Projects</h2>
          <div className="space-y-3">
            {data.projects.map((p, i) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{p.title}</span>
                  {p.link && <span className="text-sky-600">{p.link}</span>}
                </div>
                <p className="text-slate-700 mt-1 whitespace-pre-wrap">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.education && (
        <div>
          <h2 className="font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-2 text-[11px]">Education</h2>
          <p className="text-slate-800">{data.education}</p>
        </div>
      )}
    </div>
  );
}

function StudentIntern({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-slate-800 p-8 font-sans h-full w-full text-xs">
      <div className="text-center border-b-2 border-sky-600 pb-4 mb-5">
        <h1 className="text-3xl font-extrabold text-slate-900">{data.name || 'YOUR NAME'}</h1>
        <p className="text-sky-600 font-bold text-sm mt-1">{data.targetRole || 'Student / Intern'}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-3 text-[11px] text-slate-600 font-medium">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>• {data.phone}</span>}
          {data.linkedin && <span>• {data.linkedin}</span>}
          {data.github && <span>• {data.github}</span>}
        </div>
      </div>

      {data.education && (
        <div className="mb-4 bg-sky-50/50 p-4 rounded-xl border border-sky-100">
          <h2 className="text-sky-900 font-extrabold uppercase tracking-wider text-[11px] mb-1">Education</h2>
          <p className="text-slate-800 font-semibold">{data.education}</p>
        </div>
      )}

      {data.skills && (
        <div className="mb-4">
          <h2 className="text-slate-900 font-extrabold uppercase tracking-wider border-b border-slate-200 pb-1 mb-2 text-[11px]">Skills & Technical Tools</h2>
          <p className="text-slate-700 leading-relaxed font-medium">{data.skills}</p>
        </div>
      )}

      {data.projects && data.projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-slate-900 font-extrabold uppercase tracking-wider border-b border-slate-200 pb-1 mb-3 text-[11px]">Academic & Personal Projects</h2>
          <div className="space-y-3">
            {data.projects.map((p, i) => (
              <div key={i} className="border-l-2 border-sky-500 pl-3">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{p.title}</span>
                  {p.link && <span className="text-sky-600 text-[10px]">{p.link}</span>}
                </div>
                {p.technologies && <div className="text-[10px] text-slate-500 italic mt-0.5">Built with: {p.technologies}</div>}
                <p className="text-slate-700 mt-1 whitespace-pre-wrap">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.experience && data.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-slate-900 font-extrabold uppercase tracking-wider border-b border-slate-200 pb-1 mb-3 text-[11px]">Experience & Campus Leadership</h2>
          <div className="space-y-3">
            {data.experience.map((ex, i) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{ex.role} — {ex.company}</span>
                  <span className="text-slate-500 font-normal">{ex.startDate} - {ex.endDate}</span>
                </div>
                <p className="text-slate-700 mt-1 whitespace-pre-wrap">{ex.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.achievements && (
        <div>
          <h2 className="text-slate-900 font-extrabold uppercase tracking-wider border-b border-slate-200 pb-1 mb-2 text-[11px]">Achievements & Hackathons</h2>
          <p className="text-slate-700 whitespace-pre-wrap">{data.achievements}</p>
        </div>
      )}
    </div>
  );
}

export const ALL_TEMPLATES: TemplateDefinition[] = [
  { id: 'ATSProfessional', name: 'ATS Professional', category: 'ATS Friendly', description: 'Clean single-column ATS layout with serif headings & 100% parser compatibility.', badge: 'Popular', component: ATSProfessional },
  { id: 'ATSSimple', name: 'ATS Classic Simple', category: 'ATS Friendly', description: 'High contrast, zero graphics classic font hierarchy for strict ATS compliance.', badge: 'ATS Safe', component: ATSSimple },
  { id: 'ATSTech', name: 'ATS Tech Focus', category: 'ATS Friendly', description: 'Technical ATS layout optimized for engineering keyword extraction & tech stacks.', badge: 'Tech Recommended', component: ATSTech },
  
  { id: 'Minimalist', name: 'Minimalist Clean', category: 'Minimal', description: 'Refined layout with generous whitespace, crisp lines and elegant typography.', component: Minimalist },
  
  { id: 'ModernBlue', name: 'Modern Indigo Banner', category: 'Modern', description: 'Indigo banner accent with contemporary skill chips and modern typography.', badge: 'Popular', component: ModernBlue },
  { id: 'ModernEmerald', name: 'Modern Emerald Split', category: 'Modern', description: 'Fresh emerald green theme with dual-column sidebar layout for skills & links.', component: ModernEmerald },
  { id: 'ModernSlate', name: 'Modern Slate Classic', category: 'Modern', description: 'Dark slate banner header with clean structured section cards.', component: ModernSlate },
  
  { id: 'Executive', name: 'Executive Leader', category: 'Professional', description: 'Distinctive boxed header for senior, lead & executive roles.', component: Executive },
  
  { id: 'CorporateNavy', name: 'Corporate Formal', category: 'Corporate', description: 'Formal corporate layout with navy blue accents and structured section dividers.', component: CorporateNavy },
  
  { id: 'SoftwareEngineering', name: 'Software Developer CLI', category: 'Software Engineering', description: 'Terminal-inspired developer layout highlighting GitHub, repos, and stack chips.', badge: 'Developer Favorite', component: SoftwareEngineering },
  { id: 'TechDeveloper', name: 'Tech Developer Grid', category: 'Software Engineering', description: 'Code font accents with structured matrices for projects & tools.', component: TechDeveloper },
  
  { id: 'AIDataScience', name: 'AI & Data Science', category: 'AI / ML', description: 'Tailored for AI/ML engineers with papers, models, & math frameworks.', badge: 'AI Specialized', component: AIDataScience },
  
  { id: 'Student', name: 'Fresher & Student', category: 'Fresher / Student', description: 'Education-first layout highlighting coursework, projects, and GPA.', badge: 'Student Favorite', component: Student },
  { id: 'StudentIntern', name: 'Student Intern Focus', category: 'Fresher / Student', description: 'Highlighting hackathons, campus leadership, and academic projects.', component: StudentIntern },
  
  { id: 'Academic', name: 'Academic Research', category: 'Academic / Research', description: 'Classical academic format for publications, research & teaching experience.', component: Academic },
  
  { id: 'Creative', name: 'Creative Designer', category: 'Creative', description: 'Vibrant multi-accent layout with visual project highlight cards.', component: Creative },
  
  { id: 'DarkProfessional', name: 'Dark Mode Portfolio', category: 'Dark Theme', description: 'Dark theme preview tailored for digital portfolio and social sharing.', component: DarkProfessional },
];
