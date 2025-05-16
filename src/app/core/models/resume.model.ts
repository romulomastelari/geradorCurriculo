export interface Resume {
  id: string;
  userId: string;
  title: string;
  templateId: string;
  createdAt: Date;
  updatedAt: Date;
  content: ResumeContent;
}

export interface ResumeContent {
  personalInfo: PersonalInfo;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: SkillItem[];
  languages: LanguageItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  references: ReferenceItem[];
  customSections?: CustomSection[];
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  title?: string;
  summary?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  photoUrl?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate: Date;
  endDate?: Date;
  isCurrentlyStudying?: boolean;
  location?: string;
  description?: string;
  gpa?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  isCurrentlyWorking?: boolean;
  location?: string;
  description?: string;
  achievements?: string[];
}

export interface SkillItem {
  id: string;
  name: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: 'elementary' | 'limited_working' | 'professional_working' | 'full_professional' | 'native';
}

export interface ProjectItem {
  id: string;
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  url?: string;
  technologies?: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expirationDate?: Date;
  credentialId?: string;
  url?: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  company: string;
  position: string;
  email?: string;
  phone?: string;
  relationship?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  bullets?: string[];
}
