import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

// Initialize tables
export async function initializeDb() {
  await query(`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT,
      tags JSONB DEFAULT '[]',
      demo_url TEXT DEFAULT '#',
      repo_url TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS experiences (
      id SERIAL PRIMARY KEY,
      role TEXT NOT NULL,
      company TEXT NOT NULL,
      period TEXT NOT NULL,
      description TEXT NOT NULL,
      technologies JSONB DEFAULT '[]',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS tech_stacks (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      date TEXT NOT NULL,
      read_time TEXT DEFAULT '5 min read',
      slug TEXT UNIQUE NOT NULL,
      content TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS rag_content (
      id SERIAL PRIMARY KEY,
      category TEXT UNIQUE NOT NULL,
      content TEXT DEFAULT '',
      "order" INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log('Database tables initialized');
}

// Seed data
const seedExperiences = [
  {
    role: 'AI Intern',
    company: 'IOXET NP',
    period: 'Nov 2025 - Present',
    description: 'Working on advanced AI solutions involving Vector Databases (Pinecone, ChromaDB), Langchain, and LLM Fine-tuning. Implementing ASR, TTS, and translation pipelines.',
    technologies: ['Python', 'LangChain', 'PyTorch', 'Prompt Engineering'],
  },
  {
    role: 'Developer',
    company: 'Ausadhi AI',
    period: 'Jan 2023 - Jul 2023',
    description: 'Designed and developed an AI-powered mobile system for medicine label extraction. Implemented OCR pipelines using PaddleOCR and processed data with Pandas/NumPy.',
    technologies: ['React Native', 'Python', 'Flask', 'PaddleOCR', 'MySQL'],
  },
  {
    role: 'Computer Engineering Student',
    company: 'Madan Bhandari College',
    period: 'Apr 2020 - Oct 2025',
    description: 'Completed Bachelors in Computer Engineering. Participated in AI/ML workshops and won the DELTA Hackathon 2024 Hardware category.',
    technologies: ['C++', 'Python', 'System Design', 'IoT'],
  },
];

const seedTechStacks = [
  'Python', 'Machine Learning', 'Deep Learning', 'LangChain',
  'TensorFlow', 'PyTorch', 'React Native', 'Django/Flask',
  'PostgreSQL', 'Vector DBs', 'Docker', 'NLP',
];

const seedProjects = [
  {
    title: 'Ausadhi AI',
    description: 'An AI-powered mobile system for extracting and understanding medicine label data using OCR and NLP. Built to help users identify medication information instantly.',
    image: 'https://picsum.photos/600/400?grayscale',
    tags: ['React Native', 'Python', 'Flask', 'PaddleOCR', 'spaCy'],
    demoUrl: '#',
    repoUrl: 'https://github.com/SaugatDh/Ausadhi-AI',
  },
  {
    title: 'Smart Farm (IoT)',
    description: 'Award-winning hardware project (DELTA Hackathon 2024). An automated farming system integrating sensors and data analysis for optimized agriculture.',
    image: 'https://picsum.photos/600/401?grayscale',
    tags: ['C++', 'IoT', 'Hardware', 'Data Analysis'],
    demoUrl: '#',
    repoUrl: 'https://github.com/SaugatDh/smart-farm-',
  },
  {
    title: 'Fine-tuned NLLB Translator',
    description: 'A fine-tuned NLLB (No Language Left Behind) model specifically optimized for Nepali to English translation tasks, hosted on Hugging Face.',
    image: 'https://picsum.photos/600/402?grayscale',
    tags: ['Python', 'Hugging Face', 'PyTorch', 'Transformers'],
    demoUrl: 'https://huggingface.co/Saugat212/ne-en-nllb-model',
    repoUrl: 'https://huggingface.co/Saugat212/ne-en-nllb-model',
  },
  {
    title: 'RAG & Vector Search Experiments',
    description: 'Implementation of Retrieval-Augmented Generation using LangChain, ChromaDB, and Pinecone to build intelligent QA systems.',
    image: 'https://picsum.photos/600/403?grayscale',
    tags: ['LangChain', 'Pinecone', 'ChromaDB', 'Gemini API'],
    demoUrl: '#',
    repoUrl: 'https://github.com/SaugatDh',
  },
];

const seedBlogPosts = [
  {
    title: 'Building RAG Pipelines with LangChain',
    excerpt: 'A comprehensive guide to connecting vector stores like ChromaDB with LLMs for context-aware data retrieval.',
    date: 'Dec 15, 2025',
    readTime: '10 min read',
    slug: 'building-rag-pipelines',
    content: 'Full content for RAG pipelines...',
  },
  {
    title: 'Fine-tuning NLLB for Low-Resource Languages',
    excerpt: 'Challenges and strategies in fine-tuning massive multilingual models for specific language pairs like Nepali-English.',
    date: 'Nov 20, 2025',
    readTime: '8 min read',
    slug: 'finetuning-nllb-nepali',
    content: 'Full content for NLLB fine-tuning...',
  },
  {
    title: 'Optimizing OCR for Mobile Devices',
    excerpt: 'How to implement lightweight OCR solutions using PaddleOCR within a React Native environment.',
    date: 'Oct 05, 2025',
    readTime: '6 min read',
    slug: 'optimizing-ocr-mobile',
    content: 'Full content for OCR optimization...',
  },
];

export async function ensureSeeded() {
  const projectCount = (await query('SELECT COUNT(*) FROM projects')).rows[0].count;
  if (parseInt(projectCount) === 0) {
    console.log('Seeding projects...');
    for (const p of seedProjects) {
      await query(
        'INSERT INTO projects (title, description, image, tags, demo_url, repo_url) VALUES ($1, $2, $3, $4, $5, $6)',
        [p.title, p.description, p.image, JSON.stringify(p.tags), p.demoUrl, p.repoUrl]
      );
    }
  }

  const expCount = (await query('SELECT COUNT(*) FROM experiences')).rows[0].count;
  if (parseInt(expCount) === 0) {
    console.log('Seeding experiences...');
    for (const e of seedExperiences) {
      await query(
        'INSERT INTO experiences (role, company, period, description, technologies) VALUES ($1, $2, $3, $4, $5)',
        [e.role, e.company, e.period, e.description, JSON.stringify(e.technologies)]
      );
    }
  }

  const stackCount = (await query('SELECT COUNT(*) FROM tech_stacks')).rows[0].count;
  if (parseInt(stackCount) === 0) {
    console.log('Seeding tech stacks...');
    for (const s of seedTechStacks) {
      await query('INSERT INTO tech_stacks (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [s]);
    }
  }

  const blogCount = (await query('SELECT COUNT(*) FROM blog_posts')).rows[0].count;
  if (parseInt(blogCount) === 0) {
    console.log('Seeding blog posts...');
    for (const b of seedBlogPosts) {
      await query(
        'INSERT INTO blog_posts (title, excerpt, date, read_time, slug, content) VALUES ($1, $2, $3, $4, $5, $6)',
        [b.title, b.excerpt, b.date, b.readTime, b.slug, b.content]
      );
    }
  }

  console.log('Database seeding check completed.');
}

export default { query, initializeDb, ensureSeeded };
