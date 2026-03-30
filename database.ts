import { PrismaClient } from '@prisma/client';
import { supabaseAdmin } from './supabase';

const prisma = new PrismaClient();

export { prisma };

// Seed data (only used if tables are empty)
const seedExperiences = [
  {
    role: 'AI Intern',
    company: 'IOXET NP',
    period: 'Nov 2025 - Present',
    description:
      'Working on advanced AI solutions involving Vector Databases (Pinecone, ChromaDB), Langchain, and LLM Fine-tuning. Implementing ASR, TTS, and translation pipelines.',
    technologies: ['Python', 'LangChain', 'PyTorch', 'Prompt Engineering'],
  },
  {
    role: 'Developer',
    company: 'Ausadhi AI',
    period: 'Jan 2023 - Jul 2023',
    description:
      'Designed and developed an AI-powered mobile system for medicine label extraction. Implemented OCR pipelines using PaddleOCR and processed data with Pandas/NumPy.',
    technologies: ['React Native', 'Python', 'Flask', 'PaddleOCR', 'MySQL'],
  },
  {
    role: 'Computer Engineering Student',
    company: 'Madan Bhandari College',
    period: 'Apr 2020 - Oct 2025',
    description:
      'Completed Bachelors in Computer Engineering. Participated in AI/ML workshops and won the DELTA Hackathon 2024 Hardware category.',
    technologies: ['C++', 'Python', 'System Design', 'IoT'],
  },
];

const seedTechStacks = [
  'Python',
  'Machine Learning',
  'Deep Learning',
  'LangChain',
  'TensorFlow',
  'PyTorch',
  'React Native',
  'Django/Flask',
  'PostgreSQL',
  'Vector DBs',
  'Docker',
  'NLP',
];

const seedProjects = [
  {
    title: 'Ausadhi AI',
    description:
      'An AI-powered mobile system for extracting and understanding medicine label data using OCR and NLP. Built to help users identify medication information instantly.',
    image: 'https://picsum.photos/600/400?grayscale',
    tags: ['React Native', 'Python', 'Flask', 'PaddleOCR', 'spaCy'],
    demoUrl: '#',
    repoUrl: 'https://github.com/SaugatDh/Ausadhi-AI',
  },
  {
    title: 'Smart Farm (IoT)',
    description:
      'Award-winning hardware project (DELTA Hackathon 2024). An automated farming system integrating sensors and data analysis for optimized agriculture.',
    image: 'https://picsum.photos/600/401?grayscale',
    tags: ['C++', 'IoT', 'Hardware', 'Data Analysis'],
    demoUrl: '#',
    repoUrl: 'https://github.com/SaugatDh/smart-farm-',
  },
  {
    title: 'Fine-tuned NLLB Translator',
    description:
      'A fine-tuned NLLB (No Language Left Behind) model specifically optimized for Nepali to English translation tasks, hosted on Hugging Face.',
    image: 'https://picsum.photos/600/402?grayscale',
    tags: ['Python', 'Hugging Face', 'PyTorch', 'Transformers'],
    demoUrl: 'https://huggingface.co/Saugat212/ne-en-nllb-model',
    repoUrl: 'https://huggingface.co/Saugat212/ne-en-nllb-model',
  },
  {
    title: 'RAG & Vector Search Experiments',
    description:
      'Implementation of Retrieval-Augmented Generation using LangChain, ChromaDB, and Pinecone to build intelligent QA systems.',
    image: 'https://picsum.photos/600/403?grayscale',
    tags: ['LangChain', 'Pinecone', 'ChromaDB', 'Gemini API'],
    demoUrl: '#',
    repoUrl: 'https://github.com/SaugatDh',
  },
];

const seedBlogPosts = [
  {
    title: 'Building RAG Pipelines with LangChain',
    excerpt:
      'A comprehensive guide to connecting vector stores like ChromaDB with LLMs for context-aware data retrieval.',
    date: 'Dec 15, 2025',
    readTime: '10 min read',
    slug: 'building-rag-pipelines',
    content: 'Full content for RAG pipelines...',
  },
  {
    title: 'Fine-tuning NLLB for Low-Resource Languages',
    excerpt:
      'Challenges and strategies in fine-tuning massive multilingual models for specific language pairs like Nepali-English.',
    date: 'Nov 20, 2025',
    readTime: '8 min read',
    slug: 'finetuning-nllb-nepali',
    content: 'Full content for NLLB fine-tuning...',
  },
  {
    title: 'Optimizing OCR for Mobile Devices',
    excerpt:
      'How to implement lightweight OCR solutions using PaddleOCR within a React Native environment.',
    date: 'Oct 05, 2025',
    readTime: '6 min read',
    slug: 'optimizing-ocr-mobile',
    content: 'Full content for OCR optimization...',
  },
];

export async function ensureSeeded() {
  // Check if tables are empty, if so seed data
  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    console.log('Seeding projects...');
    for (const project of seedProjects) {
      await prisma.project.create({ data: project });
    }
  }

  const experienceCount = await prisma.experience.count();
  if (experienceCount === 0) {
    console.log('Seeding experiences...');
    for (const exp of seedExperiences) {
      await prisma.experience.create({ data: exp });
    }
  }

  const techStackCount = await prisma.techStack.count();
  if (techStackCount === 0) {
    console.log('Seeding tech stacks...');
    for (const skill of seedTechStacks) {
      await prisma.techStack.create({ data: { name: skill } });
    }
  }

  const blogPostCount = await prisma.blogPost.count();
  if (blogPostCount === 0) {
    console.log('Seeding blog posts...');
    for (const post of seedBlogPosts) {
      await prisma.blogPost.create({ data: post });
    }
  }

  // Admin user is handled by Supabase Auth (already created via migration)
  console.log('Database seeding check completed.');
}

// Note: We no longer need getDb() function. Server should import prisma directly.