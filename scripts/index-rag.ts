import { prisma } from '../database';
import { initializeRAG, upsertToPinecone, hasRAGConfig } from '../services/ragService';

async function indexPortfolioContent() {
  if (!hasRAGConfig()) {
    console.log('RAG not configured. Skipping indexing.');
    return;
  }

  console.log('Starting portfolio content indexing...');
  
  initializeRAG();

  try {
    // Index Projects
    const projects = await prisma.project.findMany();
    console.log(`Indexing ${projects.length} projects...`);
    
    for (const project of projects) {
      const text = `Project: ${project.title}. ${project.description}. Technologies: ${(project.tags as string[]).join(', ')}.`;
      await upsertToPinecone(
        `project-${project.id}`,
        text,
        { type: 'project', title: project.title }
      );
    }

    // Index Experience
    const experiences = await prisma.experience.findMany();
    console.log(`Indexing ${experiences.length} experiences...`);
    
    for (const exp of experiences) {
      const text = `Experience: ${exp.role} at ${exp.company}. ${exp.period}. ${exp.description}. Technologies: ${(exp.technologies as string[]).join(', ')}.`;
      await upsertToPinecone(
        `experience-${exp.id}`,
        text,
        { type: 'experience', role: exp.role, company: exp.company }
      );
    }

    // Index Tech Stacks/Skills
    const techStacks = await prisma.techStack.findMany();
    console.log(`Indexing ${techStacks.length} tech stacks...`);
    
    for (const tech of techStacks) {
      await upsertToPinecone(
        `tech-${tech.id}`,
        `Skill: ${tech.name}`,
        { type: 'skill', name: tech.name }
      );
    }

    // Index Blog Posts
    const blogPosts = await prisma.blogPost.findMany();
    console.log(`Indexing ${blogPosts.length} blog posts...`);
    
    for (const post of blogPosts) {
      const text = `Blog: ${post.title}. ${post.excerpt}. ${post.content || ''}`;
      await upsertToPinecone(
        `blog-${post.id}`,
        text,
        { type: 'blog', title: post.title, slug: post.slug }
      );
    }

    console.log('Portfolio content indexing completed!');
  } catch (error) {
    console.error('Error indexing portfolio content:', error);
  }
}

// Run if called directly
indexPortfolioContent()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });