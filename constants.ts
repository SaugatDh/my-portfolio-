import { Project, Experience, BlogPost, SocialLink, Education, Award, Language } from './types';

export const SOCIALS: SocialLink[] = [
  { platform: 'GitHub', url: 'https://github.com/SaugatDh', icon: 'github' },
  { platform: 'LinkedIn', url: 'https://linkedin.com/in/saugat-dhungana-41899129a', icon: 'linkedin' },
  { platform: 'Facebook', url: 'https://www.facebook.com/saugat201', icon: 'facebook' },
  { platform: 'Website', url: 'https://www.saugat-dhungana.com.np', icon: 'globe' },
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Ausadhi AI',
    description: 'An AI-powered mobile system for extracting and understanding medicine label data using OCR and NLP. Built to help users identify medication information instantly.',
    image: 'https://picsum.photos/600/400?grayscale',
    tags: ['React Native', 'Python', 'Flask', 'PaddleOCR', 'spaCy'],
    demoUrl: '#',
    repoUrl: 'https://github.com/SaugatDh/Ausadhi-AI',
  },
  {
    id: '2',
    title: 'Smart Farm (IoT)',
    description: 'Award-winning hardware project (DELTA Hackathon 2024). An automated farming system integrating sensors and data analysis for optimized agriculture.',
    image: 'https://picsum.photos/600/401?grayscale',
    tags: ['C++', 'IoT', 'Hardware', 'Data Analysis'],
    demoUrl: '#',
    repoUrl: 'https://github.com/SaugatDh/smart-farm-',
  },
  {
    id: '3',
    title: 'Fine-tuned NLLB Translator',
    description: 'A fine-tuned NLLB (No Language Left Behind) model specifically optimized for Nepali to English translation tasks, hosted on Hugging Face.',
    image: 'https://picsum.photos/600/402?grayscale',
    tags: ['Python', 'Hugging Face', 'PyTorch', 'Transformers'],
    demoUrl: 'https://huggingface.co/Saugat212/ne-en-nllb-model',
    repoUrl: 'https://huggingface.co/Saugat212/ne-en-nllb-model',
  },
  {
    id: '4',
    title: 'RAG & Vector Search Experiments',
    description: 'Implementation of Retrieval-Augmented Generation using LangChain, ChromaDB, and Pinecone to build intelligent QA systems.',
    image: 'https://picsum.photos/600/403?grayscale',
    tags: ['LangChain', 'Pinecone', 'ChromaDB', 'Gemini API'],
    demoUrl: '#',
    repoUrl: 'https://github.com/SaugatDh',
  }
];

export const EXPERIENCE: Experience[] = [
  {
    id: '1',
    role: 'AI Engineer',
    company: 'Ausadhi AI',
    location: 'Jhapa',
    period: 'Jan 2023 - Jul 2023',
    description: 'Designed and developed AausadiAI, an AI-powered mobile system for extracting and understanding medicine label data using OCR and NLP.',
    technologies: ['React Native', 'Python', 'Flask', 'spaCy', 'PaddleOCR', 'MySQL', 'Pandas', 'NumPy']
  },
  {
    id: '2',
    role: 'AI Intern',
    company: 'IOXET Nepal',
    location: 'Kathmandu',
    period: 'Nov 2025 - Present',
    description: 'Working on advanced AI solutions involving Vector Databases (Pinecone, ChromaDB), Langchain, and LLM Fine-tuning. Implementing ASR, TTS, and translation pipelines.',
    technologies: ['Pinecone', 'ChromDB', 'Embeddings', 'Langchain', 'Fine-tuning PyTorch', 'ASR', 'TTS', 'Translator', 'Prompt Engineering']
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Building RAG Pipelines with LangChain',
    excerpt: 'A comprehensive guide to connecting vector stores like ChromaDB with LLMs for context-aware data retrieval.',
    date: 'Dec 15, 2025',
    readTime: '10 min read',
    slug: 'building-rag-pipelines'
  },
  {
    id: '2',
    title: 'Fine-tuning NLLB for Low-Resource Languages',
    excerpt: 'Challenges and strategies in fine-tuning massive multilingual models for specific language pairs like Nepali-English.',
    date: 'Nov 20, 2025',
    readTime: '8 min read',
    slug: 'finetuning-nllb-nepali'
  },
  {
    id: '3',
    title: 'Optimizing OCR for Mobile Devices',
    excerpt: 'How to implement lightweight OCR solutions using PaddleOCR within a React Native environment.',
    date: 'Oct 05, 2025',
    readTime: '6 min read',
    slug: 'optimizing-ocr-mobile'
  }
];

export const SKILLS = [
  "Frontend Development", "Backend Development", "IOT Development", "Python", "Machine Learning", "Deep Learning", "LangChain", "TensorFlow", "PyTorch", "React Native", "Django", "Flask", "PostgreSQL", "Vector DBs", "Docker", "NLP"
];

export const EDUCATION: Education[] = [
  {
    id: '1',
    institution: 'Shree Janata Secondary School',
    location: 'Gauradaha-4, Jhapa',
    period: 'Apr 2016 - Apr 2020',
    degree: 'Technical Education in Computer Engineering'
  },
  {
    id: '2',
    institution: 'Madan Bhandari College of Engineering',
    location: 'Urlabari-03, Morang',
    period: 'Apr 2020 - Oct 2025',
    degree: 'Bachelors in Computer Engineering'
  }
];

export const AWARDS: Award[] = [
  {
    id: '1',
    title: 'DELTA Hackathon 2024 - Hardware',
    organization: 'DELTA',
    location: 'Dharan',
    year: '2024',
    project: 'Smart Farm'
  }
];

export const CERTIFICATIONS = [
  {
    id: '1',
    title: 'AI Workshop',
    organization: 'MBCOE - Pi Innovation',
    year: '2025'
  },
  {
    id: '2',
    title: 'Machine Learning by Tejash Katual',
    organization: '7days (ITSNP)',
    year: '2025'
  }
];

export const LANGUAGES: Language[] = [
  { name: 'English', proficiency: 'Professional Working' },
  { name: 'Hindi', proficiency: 'Professional Working' },
  { name: 'Nepali', proficiency: 'Native' }
];

// System instruction for the Gemini Chatbot
export const GEMINI_SYSTEM_INSTRUCTION = `You are an AI assistant for Saugat Dhungana's portfolio website. 
Your goal is to answer questions about Saugat's professional background as an AI Engineer.
Keep your answers professional, concise, and helpful.

Context:
Name: Saugat Dhungana
Role: Aspiring AI Engineer | Developer
Location: New Baneshwor, Kathmandu
Email: saugatdhungana746@gmail.com

Education:
- Technical Education in Computer Engineering: Shree Janata Secondary School (Apr 2016 - Apr 2020)
- Bachelors in Computer Engineering: Madan Bhandari College of Engineering (Apr 2020 - Oct 2025)

Skills: ${SKILLS.join(', ')}

Experience:
${EXPERIENCE.map(e => `- ${e.role} at ${e.company} (${e.period}): ${e.description}`).join('\n')}

Projects:
${PROJECTS.map(p => `- ${p.title}: ${p.description}`).join('\n')}

Awards & Certifications:
${AWARDS.map(a => `- ${a.title} (${a.year})`).join('\n')}
${CERTIFICATIONS.map(c => `- ${c.title} - ${c.organization} (${c.year})`).join('\n')}

Languages: ${LANGUAGES.map(l => `${l.name} (${l.proficiency})`).join(', ')}

Interests: Building scalable AI systems, OCR, RAG pipelines, NLP, and integrating unstructured data.
`;