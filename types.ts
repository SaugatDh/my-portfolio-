export interface Project {
  id: number;
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
  content?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string; // Using generic names for icons
}

export enum MessageRole {
  USER = "user",
  MODEL = "model",
}

export interface ChatMessage {
  role: MessageRole;
  text: string;
  isLoading?: boolean;
}

// Admin Auth Types
export interface AdminUser {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  sessionId: string;
  admin: AdminUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
