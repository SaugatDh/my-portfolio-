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
    description: 'AI-powered mobile system for medicine identification using OCR and NLP. Snap a photo to get detailed information including uses, side effects, and chemical classes.',
    image: 'https://picsum.photos/600/400?grayscale',
    tags: ['React Native', 'FastAPI', 'PaddleOCR', 'EasyOCR', 'spaCy', 'MySQL'],
    demoUrl: '#',
    repoUrl: 'https://github.com/SaugatDh/Ausadhi-AI',
  },
  {
    id: '2',
    title: 'RAG Pipeline with Gemini',
    description: 'Lightweight RAG pipeline using Google Gemini API for embeddings. Ingests text documents, generates vector embeddings, and retrieves relevant context.',
    image: 'https://picsum.photos/600/401?grayscale',
    tags: ['Python', 'Gemini API', 'NumPy', 'scikit-learn', 'Embeddings'],
    demoUrl: '#',
    repoUrl: 'https://github.com/SaugatDh/Simple-RAG-with-gemini',
  },
  {
    id: '3',
    title: 'RAG with Ollama & ChromaDB',
    description: 'Local RAG system using Ollama with nomic-embed-text for embeddings, ChromaDB for vector storage, and semantic search capabilities.',
    image: 'https://picsum.photos/600/402?grayscale',
    tags: ['Python', 'Ollama', 'ChromaDB', 'Nomic', 'Embeddings'],
    demoUrl: '#',
    repoUrl: 'https://github.com/SaugatDh/nomic_embed-with-chromadb',
  },
  {
    id: '4',
    title: 'Nepali TTS Fine-tuning',
    description: 'Fine-tuning Speech T5 and other TTS models for generating natural Nepali speech from text for voice assistants and accessibility applications.',
    image: 'https://picsum.photos/600/403?grayscale',
    tags: ['Python', 'SpeechT5', 'transformers', 'torchaudio', 'HuggingFace'],
    demoUrl: '#',
    repoUrl: 'https://github.com/SaugatDh/Nepali-TTS-Finetuning',
  },
  {
    id: '5',
    title: 'Nepali ASR Fine-tuning',
    description: 'Fine-tuning Wav2Vec2 and Whisper models for Nepali speech recognition. Model hosted on Hugging Face for Nepali speech-to-text conversion.',
    image: 'https://picsum.photos/600/404?grayscale',
    tags: ['Python', 'Wav2Vec2', 'Whisper', 'PyTorch', 'HuggingFace'],
    demoUrl: 'https://huggingface.co/Saugat212/ASR_MODEL',
    repoUrl: 'https://github.com/SaugatDh/Finetuning-ASR-Model',
  },
  {
    id: '6',
    title: 'NLLB Translator',
    description: 'Fine-tuned NLLB-200 distilled model for Nepali-English translation. 600M parameters optimized for domain-specific translation tasks.',
    image: 'https://picsum.photos/600/405?grayscale',
    tags: ['Python', 'NLLB', 'PyTorch', 'Transformers', 'HuggingFace'],
    demoUrl: 'https://huggingface.co/Saugat212/ne-en-nllb-model',
    repoUrl: 'https://github.com/SaugatDh/NLLB-English-to-Nepali-translation-finetuned',
  },
  {
    id: '7',
    title: 'TTS Model Quantization',
    description: '4-bit quantization techniques for TTS and speech models using bitsandbytes. Optimized for efficient inference on limited hardware.',
    image: 'https://picsum.photos/600/406?grayscale',
    tags: ['Python', 'bitsandbytes', 'LoRA', 'Parler TTS', 'Quantization'],
    demoUrl: '#',
    repoUrl: 'https://github.com/SaugatDh/TTS-Model-Quantization',
  },
  {
    id: '8',
    title: 'Smart Farm (IoT)',
    description: 'Award-winning hardware project (DELTA Hackathon 2024). Automated farming system integrating sensors and data analysis for optimized agriculture.',
    image: 'https://picsum.photos/600/407?grayscale',
    tags: ['C++', 'IoT', 'Hardware', 'Data Analysis'],
    demoUrl: '#',
    repoUrl: 'https://github.com/SaugatDh/smart-farm-',
  },
  {
    id: '9',
    title: 'Meroshop E-commerce',
    description: 'Modern e-commerce platform with Django backend and React frontend. Features product management, shopping cart, and checkout flow.',
    image: 'https://picsum.photos/600/408?grayscale',
    tags: ['Django', 'DRF', 'React', 'Vite', 'Tailwind CSS', 'SQLite'],
    demoUrl: '#',
    repoUrl: 'https://github.com/SaugatDh/Meroshop-Ecommerce-Django',
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

export const FAQ_ANSWERS: Record<string, string> = {
  skills: `Saugat's skills include: ${SKILLS.join(', ')}. His core expertise is in AI/ML, NLP, and full-stack development with Python, TensorFlow, PyTorch, React Native, and LangChain.`,
  
  projects: `Saugat has built several projects:

1. Ausadhi AI - AI-powered medicine identification using OCR and NLP
2. RAG Pipeline with Gemini - Lightweight RAG using Gemini API embeddings
3. RAG with Ollama & ChromaDB - Local RAG with nomic-embed-text
4. Nepali TTS Fine-tuning - Speech T5 for Nepali speech generation
5. Nepali ASR Fine-tuning - Wav2Vec2 and Whisper for Nepali speech-to-text
6. NLLB Translator - Nepali-English translation model on Hugging Face
7. TTS Model Quantization - 4-bit quantization for TTS models
8. Smart Farm (IoT) - Award-winning automated farming system
9. Meroshop E-commerce - Django + React e-commerce platform`,
  
  experience: `Saugat's experience includes:

1. AI Engineer at Ausadhi AI (Jan 2023 - Jul 2023): Built an AI-powered mobile system for medicine label extraction using OCR and NLP.

2. AI Intern at IOXET Nepal (Nov 2025 - Present): Working on Vector Databases, LangChain, LLM Fine-tuning, ASR, TTS, and translation pipelines.`,
  
  education: `Saugat's education:

1. Bachelors in Computer Engineering: Madan Bhandari College of Engineering (Apr 2020 - Oct 2025)

2. Technical Education in Computer Engineering: Shree Janata Secondary School (Apr 2016 - Apr 2020)`,
  
  contact: `You can reach Saugat at:

- Email: saugatdhungana746@gmail.com
- GitHub: https://github.com/SaugatDh
- LinkedIn: https://linkedin.com/in/saugat-dhungana-41899129a
- Website: https://www.saugat-dhungana.com.np`,
  
  default: `Thanks for your interest in Saugat's profile! I'm his AI assistant, but I'm currently running in offline mode (no API key configured). 

You can ask me about his:
- Skills - Technical expertise and technologies
- Projects - Notable work and implementations
- Experience - Work history and roles
- Education - Academic background
- Contact - How to reach out

Or feel free to email him directly at saugatdhungana746@gmail.com`
};