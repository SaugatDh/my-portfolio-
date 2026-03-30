export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  demoUrl?: string;
  repoUrl?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location?: string;
  period: string;
  description: string;
  technologies: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  slug: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string; // Using generic names for icons
}

export enum MessageRole {
  USER = 'user',
  MODEL = 'model'
}

export interface ChatMessage {
  role: MessageRole;
  text: string;
  isLoading?: boolean;
}

export interface Education {
  id: string;
  institution: string;
  location: string;
  period: string;
  degree: string;
}

export interface Award {
  id: string;
  title: string;
  organization: string;
  location: string;
  year: string;
  project?: string;
}

export interface Language {
  name: string;
  proficiency: string;
}