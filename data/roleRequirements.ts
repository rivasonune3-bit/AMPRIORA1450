export const ROLE_SKILL_MAP: Record<string, string[]> = {
  'AI Engineer': ['Python', 'PyTorch', 'TensorFlow', 'Deep Learning', 'Machine Learning', 'Model Deployment', 'Data Structures', 'REST API'],
  'ML Engineer': ['Python', 'PyTorch', 'Scikit-Learn', 'Machine Learning', 'Data Pipelines', 'Docker', 'AWS', 'Model Deployment'],
  'Data Scientist': ['Python', 'SQL', 'Statistics', 'Pandas', 'NumPy', 'Machine Learning', 'Data Visualization', 'BigQuery'],
  'Software Engineer': ['Data Structures', 'Algorithms', 'Java', 'Python', 'System Design', 'Git', 'SQL', 'REST API'],
  'Frontend Developer': ['JavaScript', 'TypeScript', 'React', 'Next.js', 'HTML', 'CSS', 'Tailwind', 'Git'],
  'Backend Developer': ['Node.js', 'Python', 'Java', 'PostgreSQL', 'System Design', 'Docker', 'REST API', 'Git'],
  'Full Stack Developer': ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'REST API', 'System Design', 'Docker', 'Git'],
  'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Python', 'Terraform', 'Git'],
  'Cloud Engineer': ['AWS', 'Docker', 'Kubernetes', 'Linux', 'Python', 'Cloud Architecture', 'Networking', 'Git'],
  'Cybersecurity Analyst': ['Network Security', 'Linux', 'Python', 'Ethical Hacking', 'Cryptography', 'SIEM', 'Risk Assessment']
};

export const COMPANY_SPECIFIC_SKILLS: Record<string, string[]> = {
  'Google': ['Data Structures', 'System Design', 'Algorithms', 'Distributed Systems'],
  'Microsoft': ['System Design', 'C#', '.NET', 'TypeScript', 'Azure'],
  'Amazon': ['AWS', 'Distributed Systems', 'Object Oriented Design', 'System Design'],
  'NVIDIA': ['CUDA', 'C++', 'GPU Acceleration', 'Deep Learning', 'PyTorch'],
  'Meta': ['React', 'System Design', 'Algorithms', 'GraphQL', 'Python'],
  'Apple': ['Swift', 'C++', 'System Architecture', 'Data Structures'],
  'Netflix': ['Java', 'Microservices', 'Distributed Systems', 'AWS'],
  'TCS': ['Java', 'Data Structures', 'SQL', 'Software Engineering Principles'],
  'Infosys': ['Python', 'Java', 'Database Management', 'Agile Principles'],
  'Wipro': ['Java', 'Web Technologies', 'SQL', 'Problem Solving'],
  'Accenture': ['Cloud Fundamentals', 'Java', 'SQL', 'Agile']
};

export const ROLE_REQUIREMENTS: Record<string, { company: string; role: string; skills: string[] }> = {
  'Google:AI Engineer': {
    company: 'Google',
    role: 'AI Engineer',
    skills: ['Python', 'TensorFlow', 'Deep Learning', 'Data Structures', 'Model Deployment']
  },
  'Microsoft:Software Engineer': {
    company: 'Microsoft',
    role: 'Software Engineer',
    skills: ['TypeScript', 'React', 'System Design', 'Algorithms', 'Distributed Systems']
  },
  'Amazon:ML Engineer': {
    company: 'Amazon',
    role: 'ML Engineer',
    skills: ['Python', 'SageMaker', 'Model Deployment', 'Data Pipelines', 'Docker']
  },
  'TCS:Software Engineer': {
    company: 'TCS',
    role: 'Software Engineer',
    skills: ['Java', 'Data Structures', 'Algorithms', 'SQL']
  },
  'Infosys:Data Scientist': {
    company: 'Infosys',
    role: 'Data Scientist',
    skills: ['Python', 'Statistics', 'Pandas', 'Machine Learning']
  }
};

// Dynamic helper to resolve required skills for any company & role combination
export function resolveRequiredSkills(company?: string, role?: string): string[] {
  const normComp = (company || '').trim();
  const normRole = (role || '').trim();
  const exactKey = `${normComp}:${normRole}`;

  if (ROLE_REQUIREMENTS[exactKey]) {
    return ROLE_REQUIREMENTS[exactKey].skills;
  }

  const roleSkills = ROLE_SKILL_MAP[normRole] || ROLE_SKILL_MAP['Software Engineer'];
  const compSkills = COMPANY_SPECIFIC_SKILLS[normComp] || [];

  // Combine and deduplicate
  const combined = Array.from(new Set([...roleSkills, ...compSkills]));
  return combined.slice(0, 8);
}
