export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  category: 'Job' | 'Internship' | 'Hackathon';
  location: string;
  mode: 'Remote' | 'On-site' | 'Hybrid';
  compensation: string;
  deadline: string;
  source: string;
  sourceUrl: string;
  verified: boolean;
  description?: string;
  skills?: string[];
  postedAt?: string;
  logoUrl?: string;
  applicationUrl?: string;
  eligibility?: string;
  type?: string;
  lastVerified?: string;
}
