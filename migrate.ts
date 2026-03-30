import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { supabaseAdmin } from './supabase';

async function migrate() {
  console.log('Starting migration from SQLite to Supabase...');

  // Open SQLite database
  const db = await open({
    filename: path.join(process.cwd(), 'database.sqlite'),
    driver: sqlite3.Database,
  });

  // 1. Migrate projects
  console.log('Migrating projects...');
  const projects = await db.all('SELECT * FROM projects');
  for (const project of projects) {
    const tags = typeof project.tags === 'string' ? JSON.parse(project.tags) : project.tags;
    const { error } = await supabaseAdmin.from('projects').insert({
      id: project.id,
      title: project.title,
      description: project.description,
      image: project.image,
      tags,
      demoUrl: project.demoUrl,
      repoUrl: project.repoUrl,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    });
    if (error) {
      console.error('Error inserting project:', error);
    }
  }
  console.log(`Migrated ${projects.length} projects`);

  // 2. Migrate experience
  console.log('Migrating experience...');
  const experiences = await db.all('SELECT * FROM experience');
  for (const exp of experiences) {
    const technologies = typeof exp.technologies === 'string' ? JSON.parse(exp.technologies) : exp.technologies;
    const { error } = await supabaseAdmin.from('experience').insert({
      id: exp.id,
      role: exp.role,
      company: exp.company,
      period: exp.period,
      description: exp.description,
      technologies,
      createdAt: exp.createdAt,
      updatedAt: exp.updatedAt,
    });
    if (error) {
      console.error('Error inserting experience:', error);
    }
  }
  console.log(`Migrated ${experiences.length} experience entries`);

  // 3. Migrate tech_stacks
  console.log('Migrating tech_stacks...');
  const techStacks = await db.all('SELECT * FROM tech_stacks');
  for (const stack of techStacks) {
    const { error } = await supabaseAdmin.from('tech_stacks').insert({
      id: stack.id,
      name: stack.name,
      createdAt: stack.createdAt,
      updatedAt: stack.updatedAt,
    });
    if (error) {
      console.error('Error inserting tech stack:', error);
    }
  }
  console.log(`Migrated ${techStacks.length} tech stacks`);

  // 4. Migrate blog_posts
  console.log('Migrating blog_posts...');
  const posts = await db.all('SELECT * FROM blog_posts');
  for (const post of posts) {
    const { error } = await supabaseAdmin.from('blog_posts').insert({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
      readTime: post.readTime,
      slug: post.slug,
      content: post.content,
      // createdAt/updatedAt not in SQLite schema, skip
    });
    if (error) {
      console.error('Error inserting blog post:', error);
    }
  }
  console.log(`Migrated ${posts.length} blog posts`);

  // 5. Create admin user in Supabase Auth
  console.log('Creating admin user in Supabase Auth...');
  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email: 'admin@portfolio.com',
    email_confirm: true,
    password: 'admin123',
    user_metadata: { username: 'admin' },
  });
  if (userError) {
    console.error('Error creating admin user:', userError);
  } else {
    console.log('Admin user created:', userData.user?.id);
  }

  console.log('Migration completed!');
  await db.close();
}

migrate().catch(console.error);