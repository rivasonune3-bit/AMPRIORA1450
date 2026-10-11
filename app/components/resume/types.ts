export interface ResumeProject {
  id?: string;
  title: string;
  description: string;
  link?: string;
  technologies?: string;
}

export interface ResumeExperience {
  id?: string;
  company: string;
  role: string;
  details: string;
  startDate?: string;
  endDate?: string;
  location?: string;
}

export interface ResumeEducation {
  id?: string;
  institution: string;
  degree: string;
  year?: string;
  gpa?: string;
  location?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface ResumeData {
  id?: string;
  versionName?: string;
  name: string;
  avatar?: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  targetRole: string;
  summary?: string;
  education: string;
  educationList?: ResumeEducation[];
  skills: string;
  skillsList?: string[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  certifications?: string[];
  achievements?: string;
  hackathons?: string[];
  codingProfiles?: { platform: string; url: string }[];
  coursework?: string;
  languages?: string;
  customSections?: CustomSection[];
  hiddenSections?: string[];
  sectionOrder?: string[];
  templateId?: string;
  targetCompany?: string;
  targetJobDescription?: string;
  updatedAt?: string;
}
