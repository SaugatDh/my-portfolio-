import express, { Request, Response, NextFunction } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { Groq } from "groq-sdk";
import { query, initializeDb, ensureSeeded } from "./database";
import { supabaseAdmin } from "./supabase";
import { initializeRAG, upsertToPinecone, hasRAGConfig, queryPinecone, deleteFromPinecone, deleteAllFromPinecone } from "./services/ragService";

declare global {
  namespace Express {
    interface Request {
      adminId?: string;
      adminUsername?: string;
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      try {
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
        if (user && !error) {
          req.adminId = user.id;
          req.adminUsername = user.user_metadata?.username || user.email;
        }
      } catch (err) {}
    }
    next();
  });

  const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.adminId) {
      return res.status(401).json({ error: "Unauthorized. Please login first." });
    }
    next();
  };

  await initializeDb();
  await ensureSeeded();

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      console.log("Login attempt:", email);

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.session) {
        console.log("Login failed:", error?.message);
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = data.user;
      console.log("Login successful for:", email);
      res.json({
        success: true,
        sessionId: data.session.access_token,
        admin: { 
          id: user.id, 
          username: user.user_metadata?.username || email.split('@')[0], 
          email: user.email 
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed: " + String(error) });
    }
  });

  app.post("/api/auth/logout", requireAuth, (req: Request, res: Response) => {
    res.json({ message: "Logged out successfully" });
  });

  app.post("/api/auth/change-password", requireAuth, async (req: Request, res: Response) => {
    try {
      const { oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: "Old and new password required" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      const email = req.adminUsername;
      if (!email) {
        return res.status(400).json({ error: "User email not found" });
      }

      const { error: signInError } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password: oldPassword,
      });

      if (signInError) {
        return res.status(401).json({ error: "Invalid old password" });
      }

      const { error: updateError } = await supabaseAdmin.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        return res.status(500).json({ error: "Failed to change password" });
      }

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({ error: "Failed to change password" });
    }
  });

  app.get("/api/auth/me", requireAuth, async (req: Request, res: Response) => {
    try {
      res.json({
        id: req.adminId,
        username: req.adminUsername?.split('@')[0] || 'admin',
        email: req.adminUsername,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin info" });
    }
  });

  // PROJECTS
  app.get("/api/projects", async (req: Request, res: Response) => {
    try {
      const result = await query('SELECT * FROM projects ORDER BY id DESC');
      const projects = result.rows.map(p => ({
        ...p,
        tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
        demoUrl: p.demo_url,
        repoUrl: p.repo_url,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      }));
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.post("/api/admin/projects", requireAuth, async (req: Request, res: Response) => {
    try {
      const { title, description, image, tags, demoUrl, repoUrl } = req.body;
      if (!title || !description || !tags) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const tagsArray = Array.isArray(tags) ? tags : JSON.parse(tags);
      const result = await query(
        'INSERT INTO projects (title, description, image, tags, demo_url, repo_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, description, image || null, JSON.stringify(tagsArray), demoUrl || '#', repoUrl || '']
      );
      const p = result.rows[0];
      res.status(201).json({ ...p, tags: tagsArray, demoUrl: p.demo_url, repoUrl: p.repo_url });
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.put("/api/admin/projects/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const { title, description, image, tags, demoUrl, repoUrl } = req.body;
      const id = parseInt(req.params.id as string);
      
      const existing = await query('SELECT * FROM projects WHERE id = $1', [id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: "Project not found" });
      }

      const exp = existing.rows[0];
      const updatedTags = tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : JSON.parse(exp.tags);

      const result = await query(
        'UPDATE projects SET title=$1, description=$2, image=$3, tags=$4, demo_url=$5, repo_url=$6, updated_at=NOW() WHERE id=$7 RETURNING *',
        [title ?? exp.title, description ?? exp.description, image ?? exp.image, JSON.stringify(updatedTags), demoUrl ?? exp.demo_url, repoUrl ?? exp.repo_url, id]
      );
      const p = result.rows[0];
      res.json({ ...p, tags: updatedTags, demoUrl: p.demo_url, repoUrl: p.repo_url });
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/admin/projects/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const existing = await query('SELECT * FROM projects WHERE id = $1', [id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: "Project not found" });
      }

      await query('DELETE FROM projects WHERE id = $1', [id]);
      res.json({ message: "Project deleted successfully", id: req.params.id });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // EXPERIENCE
  app.get("/api/experience", async (req: Request, res: Response) => {
    try {
      const result = await query('SELECT * FROM experiences ORDER BY id DESC');
      const experiences = result.rows.map(e => ({
        ...e,
        technologies: typeof e.technologies === 'string' ? JSON.parse(e.technologies) : e.technologies,
        createdAt: e.created_at,
        updatedAt: e.updated_at,
      }));
      res.json(experiences);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch experience" });
    }
  });

  app.post("/api/admin/experience", requireAuth, async (req: Request, res: Response) => {
    try {
      const { role, company, period, description, technologies } = req.body;
      if (!role || !company || !period || !description) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const techArray = Array.isArray(technologies) ? technologies : JSON.parse(technologies || '[]');
      const result = await query(
        'INSERT INTO experiences (role, company, period, description, technologies) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [role, company, period, description, JSON.stringify(techArray)]
      );
      const e = result.rows[0];
      res.status(201).json({ ...e, technologies: techArray });
    } catch (error) {
      console.error("Error creating experience:", error);
      res.status(500).json({ error: "Failed to create experience" });
    }
  });

  app.put("/api/admin/experience/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const { role, company, period, description, technologies } = req.body;
      const id = parseInt(req.params.id as string);
      
      const existing = await query('SELECT * FROM experiences WHERE id = $1', [id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: "Experience not found" });
      }

      const exp = existing.rows[0];
      const techArray = technologies 
        ? (Array.isArray(technologies) ? technologies : JSON.parse(technologies)) 
        : JSON.parse(exp.technologies);

      const result = await query(
        'UPDATE experiences SET role=$1, company=$2, period=$3, description=$4, technologies=$5, updated_at=NOW() WHERE id=$6 RETURNING *',
        [role ?? exp.role, company ?? exp.company, period ?? exp.period, description ?? exp.description, JSON.stringify(techArray), id]
      );
      res.json({ ...result.rows[0], technologies: techArray });
    } catch (error) {
      console.error("Error updating experience:", error);
      res.status(500).json({ error: "Failed to update experience" });
    }
  });

  app.delete("/api/admin/experience/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const existing = await query('SELECT * FROM experiences WHERE id = $1', [id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: "Experience not found" });
      }

      await query('DELETE FROM experiences WHERE id = $1', [id]);
      res.json({ message: "Experience deleted successfully", id: req.params.id });
    } catch (error) {
      console.error("Error deleting experience:", error);
      res.status(500).json({ error: "Failed to delete experience" });
    }
  });

  // TECH STACKS
  app.get("/api/tech-stacks", async (req: Request, res: Response) => {
    try {
      const result = await query('SELECT * FROM tech_stacks ORDER BY name ASC');
      res.json(result.rows.map(s => ({ ...s, createdAt: s.created_at, updatedAt: s.updated_at })));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tech stacks" });
    }
  });

  app.post("/api/admin/tech-stacks", requireAuth, async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Tech stack name is required" });
      }

      const result = await query('INSERT INTO tech_stacks (name) VALUES ($1) RETURNING *', [name]);
      res.status(201).json(result.rows[0]);
    } catch (error: any) {
      console.error("Error creating tech stack:", error);
      if (error.code === '23505') {
        return res.status(409).json({ error: "Tech stack already exists" });
      }
      res.status(500).json({ error: "Failed to create tech stack" });
    }
  });

  app.delete("/api/admin/tech-stacks/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const existing = await query('SELECT * FROM tech_stacks WHERE id = $1', [id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: "Tech stack not found" });
      }

      await query('DELETE FROM tech_stacks WHERE id = $1', [id]);
      res.json({ message: "Tech stack deleted successfully", id: req.params.id });
    } catch (error) {
      console.error("Error deleting tech stack:", error);
      res.status(500).json({ error: "Failed to delete tech stack" });
    }
  });

  // BLOG
  app.get("/api/blog", async (req: Request, res: Response) => {
    try {
      const result = await query('SELECT * FROM blog_posts ORDER BY id DESC');
      res.json(result.rows.map(b => ({ ...b, readTime: b.read_time, createdAt: b.created_at, updatedAt: b.updated_at })));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req: Request, res: Response) => {
    try {
      const result = await query('SELECT * FROM blog_posts WHERE slug = $1', [req.params.slug]);
      if (result.rows.length > 0) {
        const b = result.rows[0];
        res.json({ ...b, readTime: b.read_time, createdAt: b.created_at, updatedAt: b.updated_at });
      } else {
        res.status(404).json({ error: "Post not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  app.post("/api/admin/blog", requireAuth, async (req: Request, res: Response) => {
    try {
      const { title, excerpt, date, readTime, slug, content } = req.body;
      if (!title || !excerpt || !slug) {
        return res.status(400).json({ error: "Missing required fields: title, excerpt, slug" });
      }

      const result = await query(
        'INSERT INTO blog_posts (title, excerpt, date, read_time, slug, content) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, excerpt, date || new Date().toLocaleDateString(), readTime || "5 min read", slug, content || ""]
      );
      const b = result.rows[0];
      res.status(201).json({ ...b, readTime: b.read_time });
    } catch (error: any) {
      console.error("Error creating post:", error);
      if (error.code === '23505') {
        return res.status(409).json({ error: "Slug already exists" });
      }
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });

  app.put("/api/admin/blog/:slug", requireAuth, async (req: Request, res: Response) => {
    try {
      const { title, excerpt, date, readTime, content } = req.body;
      const slug = req.params.slug;
      
      const existing = await query('SELECT * FROM blog_posts WHERE slug = $1', [slug]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      const b = existing.rows[0];
      const result = await query(
        'UPDATE blog_posts SET title=$1, excerpt=$2, date=$3, read_time=$4, content=$5, updated_at=NOW() WHERE slug=$6 RETURNING *',
        [title ?? b.title, excerpt ?? b.excerpt, date ?? b.date, readTime ?? b.read_time, content ?? b.content, slug]
      );
      const updated = result.rows[0];
      res.json({ ...updated, readTime: updated.read_time });
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ error: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog/:slug", requireAuth, async (req: Request, res: Response) => {
    try {
      const slug = req.params.slug;
      const existing = await query('SELECT * FROM blog_posts WHERE slug = $1', [slug]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      await query('DELETE FROM blog_posts WHERE slug = $1', [slug]);
      res.json({ message: "Post deleted successfully", slug });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  // RAG SYNC
  app.post("/api/admin/sync-rag", requireAuth, async (req: Request, res: Response) => {
    try {
      if (!hasRAGConfig()) {
        return res.status(500).json({ error: "RAG not configured" });
      }

      initializeRAG();

      const projects = (await query('SELECT * FROM projects')).rows;
      for (const project of projects) {
        const tags = typeof project.tags === 'string' ? JSON.parse(project.tags) : project.tags;
        const text = `Project: ${project.title}. ${project.description}. Technologies: ${tags.join(', ')}.`;
        await upsertToPinecone(`project-${project.id}`, text, { type: 'project', title: project.title });
      }

      const experiences = (await query('SELECT * FROM experiences')).rows;
      for (const exp of experiences) {
        const techs = typeof exp.technologies === 'string' ? JSON.parse(exp.technologies) : exp.technologies;
        const text = `Experience: ${exp.role} at ${exp.company}. ${exp.period}. ${exp.description}. Technologies: ${techs.join(', ')}.`;
        await upsertToPinecone(`experience-${exp.id}`, text, { type: 'experience', role: exp.role, company: exp.company });
      }

      const techStacks = (await query('SELECT * FROM tech_stacks')).rows;
      for (const tech of techStacks) {
        await upsertToPinecone(`tech-${tech.id}`, `Skill: ${tech.name}`, { type: 'skill', name: tech.name });
      }

      const blogPosts = (await query('SELECT * FROM blog_posts')).rows;
      for (const post of blogPosts) {
        const text = `Blog: ${post.title}. ${post.excerpt}. ${post.content || ''}`;
        await upsertToPinecone(`blog-${post.id}`, text, { type: 'blog', title: post.title, slug: post.slug });
      }

      res.json({ success: true, projects: projects.length, experiences: experiences.length, techStacks: techStacks.length, blogPosts: blogPosts.length });
    } catch (error) {
      console.error("Error syncing to RAG:", error);
      res.status(500).json({ error: "Failed to sync to RAG: " + String(error) });
    }
  });

  app.get("/api/admin/rag-content", async (req: Request, res: Response) => {
    try {
      const result = await query('SELECT * FROM rag_content ORDER BY "order" ASC');
      res.json(result.rows.map(r => ({ ...r, createdAt: r.created_at, updatedAt: r.updated_at })));
    } catch (error) {
      console.error("Error fetching RAG content:", error);
      res.status(500).json({ error: "Failed to fetch RAG content" });
    }
  });

  app.post("/api/admin/rag-sync", async (req: Request, res: Response) => {
    try {
      const projects = (await query('SELECT * FROM projects ORDER BY id DESC')).rows;
      const experiences = (await query('SELECT * FROM experiences ORDER BY id DESC')).rows;
      const techStacks = (await query('SELECT * FROM tech_stacks ORDER BY name ASC')).rows;
      const blogPosts = (await query('SELECT * FROM blog_posts ORDER BY id DESC')).rows;

      const sections = [
        { category: "projects", content: projects.map(p => {
          const tags = typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags;
          return `Project: ${p.title} - ${p.description} (${tags.join(", ")}). Demo: ${p.demo_url || 'N/A'}. GitHub: ${p.repo_url || 'N/A'}`;
        }).join("\n"), order: 1 },
        { category: "experience", content: experiences.map(e => {
          const techs = typeof e.technologies === 'string' ? JSON.parse(e.technologies) : e.technologies;
          return `Experience: ${e.role} at ${e.company} (${e.period}) - ${e.description} (${techs.join(", ")})`;
        }).join("\n"), order: 2 },
        { category: "skills", content: techStacks.map(s => `Skill: ${s.name}`).join("\n"), order: 3 },
        { category: "blogs", content: blogPosts.map(b => `Blog: ${b.title} - ${b.excerpt}`).join("\n"), order: 4 }
      ];

      for (const section of sections) {
        await query(
          'INSERT INTO rag_content (category, content, "order") VALUES ($1, $2, $3) ON CONFLICT (category) DO UPDATE SET content = $2, "order" = $3',
          [section.category, section.content, section.order]
        );
      }

      if (hasRAGConfig()) {
        try {
          initializeRAG();
          for (const section of sections) {
            if (section.content.trim()) {
              const lines = section.content.split("\n").filter(line => line.trim());
              for (let i = 0; i < lines.length; i++) {
                await upsertToPinecone(`${section.category}-${i}`, lines[i].trim(), { type: section.category, category: section.category });
              }
            }
          }
        } catch (ragError) {
          console.error("Error indexing to Pinecone:", ragError);
        }
      }

      res.json({ success: true, sections: sections.map(s => ({ category: s.category, lines: s.content.split("\n").filter(l => l.trim()).length })) });
    } catch (error) {
      console.error("Error syncing RAG:", error);
      res.status(500).json({ error: "Failed to sync RAG: " + String(error) });
    }
  });

  app.put("/api/admin/rag-content/:category", async (req: Request, res: Response) => {
    try {
      const category = String(req.params.category);
      const { content } = req.body;

      if (!content || typeof content !== "string") {
        return res.status(400).json({ error: "Content is required" });
      }

      await query(
        'INSERT INTO rag_content (category, content, "order") VALUES ($1, $2, 999) ON CONFLICT (category) DO UPDATE SET content = $2',
        [category, content]
      );

      if (hasRAGConfig()) {
        try {
          initializeRAG();
          for (let i = 0; i < 100; i++) {
            try { await deleteFromPinecone(`${category}-${i}`); } catch {}
          }
          const lines = content.split("\n").filter(line => line.trim());
          for (let i = 0; i < lines.length; i++) {
            await upsertToPinecone(`${category}-${i}`, lines[i].trim(), { type: category, category });
          }
          res.json({ success: true, lines: lines.length });
        } catch (ragError) {
          console.error("Error indexing to Pinecone:", ragError);
          res.json({ success: true, lines: 0 });
        }
      } else {
        res.json({ success: true, lines: content.split("\n").filter(l => l.trim()).length });
      }
    } catch (error) {
      console.error("Error updating RAG content:", error);
      res.status(500).json({ error: "Failed to update RAG content" });
    }
  });

  app.post("/api/admin/rag-content", async (req: Request, res: Response) => {
    try {
      const { category, content, order } = req.body;

      if (!category || typeof category !== "string") {
        return res.status(400).json({ error: "Category is required" });
      }

      await query(
        'INSERT INTO rag_content (category, content, "order") VALUES ($1, $2, $3) ON CONFLICT (category) DO UPDATE SET content = $2',
        [category, content || "", order || 999]
      );

      const result = await query('SELECT * FROM rag_content WHERE category = $1', [category]);

      if (hasRAGConfig() && content?.trim()) {
        try {
          initializeRAG();
          const lines = content.split("\n").filter(line => line.trim());
          for (let i = 0; i < lines.length; i++) {
            await upsertToPinecone(`${category}-${i}`, lines[i].trim(), { type: category, category });
          }
        } catch (ragError) {
          console.error("Error indexing to Pinecone:", ragError);
        }
      }

      res.json({ success: true, ragContent: result.rows[0] });
    } catch (error) {
      console.error("Error adding RAG content:", error);
      res.status(500).json({ error: "Failed to add RAG content" });
    }
  });

  app.delete("/api/admin/rag-content/:category", async (req: Request, res: Response) => {
    try {
      const category = String(req.params.category);
      await query('DELETE FROM rag_content WHERE category = $1', [category]).catch(() => {});

      if (hasRAGConfig()) {
        try {
          initializeRAG();
          for (let i = 0; i < 100; i++) {
            try { await deleteFromPinecone(`${category}-${i}`); } catch {}
          }
        } catch (ragError) {
          console.error("Error deleting from Pinecone:", ragError);
        }
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting RAG content:", error);
      res.status(500).json({ error: "Failed to delete RAG content" });
    }
  });

  app.delete("/api/admin/rag-pinecone/all", async (req: Request, res: Response) => {
    if (!hasRAGConfig()) {
      return res.status(500).json({ error: "RAG not configured" });
    }

    try {
      initializeRAG();
      const result = await deleteAllFromPinecone();
      if (result) {
        res.json({ success: true, message: "All Pinecone vectors deleted" });
      } else {
        res.status(500).json({ error: "Failed to delete Pinecone vectors" });
      }
    } catch (error) {
      console.error("Error deleting all Pinecone vectors:", error);
      res.status(500).json({ error: "Failed to delete Pinecone vectors: " + String(error) });
    }
  });

  app.get("/api/admin/custom-rag", async (req: Request, res: Response) => {
    try {
      const result = await query('SELECT * FROM rag_content ORDER BY "order" ASC');
      const content = result.rows.map(r => r.content).join("\n\n");
      res.json({ content, sections: result.rows });
    } catch (error) {
      res.json({ content: "", sections: [] });
    }
  });

  app.post("/api/admin/custom-rag", requireAuth, async (req: Request, res: Response) => {
    const projects = (await query('SELECT * FROM projects ORDER BY id DESC')).rows;
    const experiences = (await query('SELECT * FROM experiences ORDER BY id DESC')).rows;
    const techStacks = (await query('SELECT * FROM tech_stacks ORDER BY name ASC')).rows;
    const blogPosts = (await query('SELECT * FROM blog_posts ORDER BY id DESC')).rows;

    const sections = [
      { category: "projects", content: projects.map(p => {
        const tags = typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags;
        return `Project: ${p.title} - ${p.description} (${tags.join(", ")})`;
      }).join("\n"), order: 1 },
      { category: "experience", content: experiences.map(e => {
        const techs = typeof e.technologies === 'string' ? JSON.parse(e.technologies) : e.technologies;
        return `Experience: ${e.role} at ${e.company} (${e.period}) - ${e.description} (${techs.join(", ")})`;
      }).join("\n"), order: 2 },
      { category: "skills", content: techStacks.map(s => `Skill: ${s.name}`).join("\n"), order: 3 },
      { category: "blogs", content: blogPosts.map(b => `Blog: ${b.title} - ${b.excerpt}`).join("\n"), order: 4 }
    ];

    for (const section of sections) {
      await query(
        'INSERT INTO rag_content (category, content, "order") VALUES ($1, $2, $3) ON CONFLICT (category) DO UPDATE SET content = $2, "order" = $3',
        [section.category, section.content, section.order]
      );
    }

    if (hasRAGConfig()) {
      try {
        initializeRAG();
        for (const section of sections) {
          if (section.content.trim()) {
            const lines = section.content.split("\n").filter(line => line.trim());
            for (let i = 0; i < lines.length; i++) {
              await upsertToPinecone(`${section.category}-${i}`, lines[i].trim(), { type: section.category, category: section.category });
            }
          }
        }
      } catch {}
    }

    res.json({ success: true, lines: sections.reduce((acc, s) => acc + s.content.split("\n").filter(l => l.trim()).length, 0) });
  });

  // GROQ AI CHAT
  const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });

  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { message, history } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      if (!process.env.GROQ_API_KEY) {
        return res.status(500).json({ error: "Groq API key not configured" });
      }

      let contextText = "";

      if (hasRAGConfig()) {
        try {
          initializeRAG();
          const ragResults = await queryPinecone(message, 5);
          if (ragResults && ragResults.length > 0) {
            contextText = ragResults
              .map((match: any) => match.metadata?.text || "")
              .filter(Boolean)
              .map((text: string) => text.replace(/^#\s+\w+\s*$/gm, "").replace(/^#+\s*/gm, "").trim())
              .filter((text: string) => text.length > 0)
              .join("\n\n");
            contextText += "\n\nContact: saugat.dhungana@gmail.com";
          }
        } catch (ragError) {
          console.error("RAG query failed, falling back to default:", ragError);
        }
      }

      if (!contextText) {
        const projects = (await query('SELECT * FROM projects ORDER BY id DESC')).rows;
        const experiences = (await query('SELECT * FROM experiences ORDER BY id DESC')).rows;
        const techStacks = (await query('SELECT * FROM tech_stacks ORDER BY name ASC')).rows;

        const projectsList = projects.map((p) => {
          const tags = typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags;
          return `${p.title}: ${p.description} (${tags.join(", ")}). Demo: ${p.demo_url || 'N/A'}. GitHub: ${p.repo_url || 'N/A'}`;
        }).join(" | ");

        const experienceList = experiences.map((e) => {
          const techs = typeof e.technologies === 'string' ? JSON.parse(e.technologies) : e.technologies;
          return `${e.role} at ${e.company} (${e.period}) - ${techs.join(", ")}`;
        }).join(" | ");

        const skillsList = techStacks.map((s) => s.name).join(", ");

        contextText = `Experience: ${experienceList}\n\nProjects: ${projectsList}\n\nSkills: ${skillsList}\n\nContact: saugat.dhungana@gmail.com`;
      }

      const systemPrompt = `You are Saugat Dhungana. Answer questions about your own background based on the context below.

Context:
${contextText}

Rules:
- Answer as yourself (Saugat), not as an assistant
- Only talk about what's in the context above
- If asked about something not listed, say "I don't have information about that"
- Keep responses super short - 1-2 sentences max
- Casual, friendly tone
- Filter harmful content`;

      const pronounPattern = /\b(it|this|that|these|those|them|they|their|his|her|him|she|he|its|one|which|what)\b/i;
      const continuationIndicators = /\b(about|more|details|tell me|explain|describe|and|also|what about|how about|what's|whats)\b/i;
      const isContinuation = pronounPattern.test(message) || continuationIndicators.test(message);

      let conversationContext = "";
      if (isContinuation && history && Array.isArray(history)) {
        const recentHistory = history.slice(-3);
        for (const h of recentHistory) {
          if (h.role === "user" || h.role === "assistant") {
            const question = h.content || "";
            const response = h.response || "";
            const responsePreview = response.split(" ").slice(0, 20).join(" ");
            conversationContext += `Q: ${question}\nA: ${responsePreview}...\n\n`;
          }
        }
      }

      const systemPromptWithHistory = `You are Saugat Dhungana. Answer questions about your own background based on the context below.

Context:
${contextText}

${conversationContext ? `Recent conversation (use to resolve pronouns):\n${conversationContext}` : ""}

Rules:
- Answer as yourself (Saugat), not as an assistant
- When user asks for links, demos, GitHub, code - ALWAYS respond with "Check out my projects at [yourwebsite] or email me at saugat.dhungana@gmail.com"
- Keep responses super short - 1-2 sentences max
- Casual, friendly tone
- Filter harmful content`;

      const messagesArray = [{ role: "system", content: systemPromptWithHistory }];

      if (history && Array.isArray(history)) {
        for (const h of history.slice(-5)) {
          messagesArray.push({ role: h.role || "user", content: h.content || "" });
        }
      }

      messagesArray.push({ role: "user", content: message });

      const response = await groqClient.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: messagesArray as any,
        max_tokens: 512,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content || "";
      res.json({ response: content });
    } catch (error) {
      console.error("Groq chat error:", error);
      res.status(500).json({ error: "Failed to get response from AI" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
