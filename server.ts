import express, { Request, Response, NextFunction } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Groq from "groq";
import { prisma, ensureSeeded } from "./database";
import { supabaseAdmin } from "./supabase";
import { initializeRAG, upsertToPinecone, hasRAGConfig, queryPinecone, deleteFromPinecone, deleteAllFromPinecone } from "./services/ragService";

// Extend Express Request to include user info
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

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Supabase Auth middleware
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
      } catch (err) {
        // Token invalid, ignore
      }
    }
    next();
  });

  // Auth middleware to protect admin routes
  const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.adminId) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Please login first." });
    }
    next();
  };

  // Ensure database is seeded
  await ensureSeeded();

  // ============ AUTHENTICATION ROUTES ============

  // Admin Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      console.log("Login attempt:", email);

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password required" });
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

  // Admin Logout
  app.post("/api/auth/logout", requireAuth, (req: Request, res: Response) => {
    // Supabase JWTs cannot be invalidated server-side without additional logic.
    // Frontend should delete the token from localStorage.
    res.json({ message: "Logged out successfully" });
  });

  // Admin Change Password
  app.post(
    "/api/auth/change-password",
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
          return res
            .status(400)
            .json({ error: "Old and new password required" });
        }

        if (newPassword.length < 6) {
          return res
            .status(400)
            .json({ error: "Password must be at least 6 characters" });
        }

        // Verify old password by attempting sign-in
        const email = req.adminUsername; // we stored email as username
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

        // Update password
        const { error: updateError } = await supabaseAdmin.auth.updateUser({
          password: newPassword,
        });

        if (updateError) {
          console.error("Password update error:", updateError);
          return res.status(500).json({ error: "Failed to change password" });
        }

        res.json({ message: "Password changed successfully" });
      } catch (error) {
        console.error("Password change error:", error);
        res.status(500).json({ error: "Failed to change password" });
      }
    },
  );

  // Get current admin info
  app.get("/api/auth/me", requireAuth, async (req: Request, res: Response) => {
    try {
      // req.adminId is UUID, req.adminUsername is email
      res.json({
        id: req.adminId,
        username: req.adminUsername?.split('@')[0] || 'admin',
        email: req.adminUsername,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin info" });
    }
  });

  // ============ PROJECTS REST API ============

  // GET all projects (public)
  app.get("/api/projects", async (req: Request, res: Response) => {
    try {
      const projects = await prisma.project.findMany({
        orderBy: { id: 'desc' },
      });
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // POST - Create new project (admin only)
  app.post(
    "/api/admin/projects",
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        const { title, description, image, tags, demoUrl, repoUrl } = req.body;

        if (!title || !description || !tags) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const tagsArray = Array.isArray(tags) ? tags : JSON.parse(tags);
        const newProject = await prisma.project.create({
          data: {
            title,
            description,
            image: image || null,
            tags: tagsArray,
            demoUrl: demoUrl || "#",
            repoUrl: repoUrl || "",
          },
        });

        res.status(201).json(newProject);
      } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ error: "Failed to create project" });
      }
    },
  );

  // PUT - Update project (admin only)
  app.put(
    "/api/admin/projects/:id",
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        const { title, description, image, tags, demoUrl, repoUrl } = req.body;
        const id = parseInt(req.params.id as string);
        
        // Check if project exists
        const existingProject = await prisma.project.findUnique({ where: { id } });
        if (!existingProject) {
          return res.status(404).json({ error: "Project not found" });
        }

        const updatedProject = await prisma.project.update({
          where: { id },
          data: {
            title: title !== undefined ? title : existingProject.title,
            description: description !== undefined ? description : existingProject.description,
            image: image !== undefined ? image : existingProject.image,
            tags: tags !== undefined ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : existingProject.tags,
            demoUrl: demoUrl !== undefined ? demoUrl : existingProject.demoUrl,
            repoUrl: repoUrl !== undefined ? repoUrl : existingProject.repoUrl,
          },
        });

        res.json(updatedProject);
      } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ error: "Failed to update project" });
      }
    },
  );

  // DELETE - Remove project (admin only)
  app.delete(
    "/api/admin/projects/:id",
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        const id = parseInt(req.params.id as string);
        const project = await prisma.project.findUnique({ where: { id } });
        if (!project) {
          return res.status(404).json({ error: "Project not found" });
        }

        await prisma.project.delete({ where: { id } });
        res.json({
          message: "Project deleted successfully",
          id: req.params.id,
        });
      } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ error: "Failed to delete project" });
      }
    },
  );

  // ============ EXPERIENCE REST API ============

  // GET all experience (public)
  app.get("/api/experience", async (req: Request, res: Response) => {
    try {
      const experiences = await prisma.experience.findMany({
        orderBy: { id: 'desc' },
      });
      res.json(experiences);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch experience" });
    }
  });

  // POST - Create new experience (admin only)
  app.post(
    "/api/admin/experience",
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        const { role, company, period, description, technologies } = req.body;

        if (!role || !company || !period || !description) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const technologiesArray = Array.isArray(technologies) ? technologies : JSON.parse(technologies || '[]');
        const newExp = await prisma.experience.create({
          data: {
            role,
            company,
            period,
            description,
            technologies: technologiesArray,
          },
        });

        res.status(201).json(newExp);
      } catch (error) {
        console.error("Error creating experience:", error);
        res.status(500).json({ error: "Failed to create experience" });
      }
    },
  );

  // PUT - Update experience (admin only)
  app.put(
    "/api/admin/experience/:id",
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        const { role, company, period, description, technologies } = req.body;
        const id = parseInt(req.params.id as string);
        
        const existingExp = await prisma.experience.findUnique({ where: { id } });
        if (!existingExp) {
          return res.status(404).json({ error: "Experience not found" });
        }

        const updatedExp = await prisma.experience.update({
          where: { id },
          data: {
            role: role !== undefined ? role : existingExp.role,
            company: company !== undefined ? company : existingExp.company,
            period: period !== undefined ? period : existingExp.period,
            description: description !== undefined ? description : existingExp.description,
            technologies: technologies !== undefined 
              ? (Array.isArray(technologies) ? technologies : JSON.parse(technologies))
              : existingExp.technologies,
          },
        });

        res.json(updatedExp);
      } catch (error) {
        console.error("Error updating experience:", error);
        res.status(500).json({ error: "Failed to update experience" });
      }
    },
  );

  // DELETE - Remove experience (admin only)
  app.delete(
    "/api/admin/experience/:id",
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        const id = parseInt(req.params.id as string);
        const exp = await prisma.experience.findUnique({ where: { id } });
        if (!exp) {
          return res.status(404).json({ error: "Experience not found" });
        }

        await prisma.experience.delete({ where: { id } });
        res.json({
          message: "Experience deleted successfully",
          id: req.params.id,
        });
      } catch (error) {
        console.error("Error deleting experience:", error);
        res.status(500).json({ error: "Failed to delete experience" });
      }
    },
  );

  // ============ TECH STACKS REST API ============

  // GET all tech stacks (public)
  app.get("/api/tech-stacks", async (req: Request, res: Response) => {
    try {
      const stacks = await prisma.techStack.findMany({
        orderBy: { name: 'asc' },
      });
      res.json(stacks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tech stacks" });
    }
  });

  // POST - Create new tech stack (admin only)
  app.post(
    "/api/admin/tech-stacks",
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        const { name } = req.body;

        if (!name) {
          return res.status(400).json({ error: "Tech stack name is required" });
        }

        const newStack = await prisma.techStack.create({
          data: { name },
        });
        res.status(201).json(newStack);
      } catch (error: any) {
        console.error("Error creating tech stack:", error);
        if (error.code === 'P2002') { // Unique constraint violation
          return res.status(409).json({ error: "Tech stack already exists" });
        }
        res.status(500).json({ error: "Failed to create tech stack" });
      }
    },
  );

  // DELETE - Remove tech stack (admin only)
  app.delete(
    "/api/admin/tech-stacks/:id",
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        const id = parseInt(req.params.id as string);
        const stack = await prisma.techStack.findUnique({ where: { id } });
        if (!stack) {
          return res.status(404).json({ error: "Tech stack not found" });
        }

        await prisma.techStack.delete({ where: { id } });
        res.json({
          message: "Tech stack deleted successfully",
          id: req.params.id,
        });
      } catch (error) {
        console.error("Error deleting tech stack:", error);
        res.status(500).json({ error: "Failed to delete tech stack" });
      }
    },
  );

  // GET all blog posts (public)
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await prisma.blogPost.findMany({
        orderBy: { id: 'desc' },
      });
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  // GET blog post by slug (public)
  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await prisma.blogPost.findUnique({
        where: { slug: req.params.slug as string },
      });
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ error: "Post not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  // POST - Create new blog post (admin only)
  app.post(
    "/api/admin/blog",
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        const { title, excerpt, date, readTime, slug, content } = req.body;

        if (!title || !excerpt || !slug) {
          return res
            .status(400)
            .json({ error: "Missing required fields: title, excerpt, slug" });
        }

        const newPost = await prisma.blogPost.create({
          data: {
            title,
            excerpt,
            date: date || new Date().toLocaleDateString(),
            readTime: readTime || "5 min read",
            slug,
            content: content || "",
          },
        });
        res.status(201).json(newPost);
      } catch (error: any) {
        console.error("Error creating post:", error);
        if (error.code === 'P2002') {
          return res.status(409).json({ error: "Slug already exists" });
        }
        res.status(500).json({ error: "Failed to create blog post" });
      }
    },
  );

  // PUT - Update blog post (admin only)
  app.put(
    "/api/admin/blog/:slug",
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        const { title, excerpt, date, readTime, content } = req.body;
        const existingPost = await prisma.blogPost.findUnique({
          where: { slug: req.params.slug as string },
        });
        if (!existingPost) {
          return res.status(404).json({ error: "Post not found" });
        }

        const updatedPost = await prisma.blogPost.update({
          where: { slug: req.params.slug as string },
          data: {
            title: title !== undefined ? title : existingPost.title,
            excerpt: excerpt !== undefined ? excerpt : existingPost.excerpt,
            date: date !== undefined ? date : existingPost.date,
            readTime: readTime !== undefined ? readTime : existingPost.readTime,
            content: content !== undefined ? content : existingPost.content,
          },
        });
        res.json(updatedPost);
      } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ error: "Failed to update blog post" });
      }
    },
  );

  // DELETE - Remove blog post (admin only)
  app.delete(
    "/api/admin/blog/:slug",
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        const post = await prisma.blogPost.findUnique({
          where: { slug: req.params.slug as string },
        });
        if (!post) {
          return res.status(404).json({ error: "Post not found" });
        }

        await prisma.blogPost.delete({
          where: { slug: req.params.slug as string },
        });
        res.json({
          message: "Post deleted successfully",
          slug: req.params.slug as string,
        });
      } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: "Failed to delete blog post" });
      }
    },
  );

  // ============ RAG SYNC ============
  app.post("/api/admin/sync-rag", requireAuth, async (req: Request, res: Response) => {
    try {
      if (!hasRAGConfig()) {
        return res.status(500).json({ error: "RAG not configured. Check PINECONE_API_KEY and GEMINI_API_KEY" });
      }

      initializeRAG();

      // Index Projects
      const projects = await prisma.project.findMany();
      for (const project of projects) {
        const text = `Project: ${project.title}. ${project.description}. Technologies: ${(project.tags as string[]).join(', ')}.`;
        await upsertToPinecone(`project-${project.id}`, text, { type: 'project', title: project.title });
      }

      // Index Experience
      const experiences = await prisma.experience.findMany();
      for (const exp of experiences) {
        const text = `Experience: ${exp.role} at ${exp.company}. ${exp.period}. ${exp.description}. Technologies: ${(exp.technologies as string[]).join(', ')}.`;
        await upsertToPinecone(`experience-${exp.id}`, text, { type: 'experience', role: exp.role, company: exp.company });
      }

      // Index Tech Stacks
      const techStacks = await prisma.techStack.findMany();
      for (const tech of techStacks) {
        await upsertToPinecone(`tech-${tech.id}`, `Skill: ${tech.name}`, { type: 'skill', name: tech.name });
      }

      // Index Blog Posts
      const blogPosts = await prisma.blogPost.findMany();
      for (const post of blogPosts) {
        const text = `Blog: ${post.title}. ${post.excerpt}. ${post.content || ''}`;
        await upsertToPinecone(`blog-${post.id}`, text, { type: 'blog', title: post.title, slug: post.slug });
      }

      console.log('RAG sync completed');
      res.json({
        success: true,
        projects: projects.length,
        experiences: experiences.length,
        techStacks: techStacks.length,
        blogPosts: blogPosts.length,
      });
    } catch (error) {
      console.error("Error syncing to RAG:", error);
      res.status(500).json({ error: "Failed to sync to RAG: " + String(error) });
    }
  });

  // GET all RAG content from DB (public)
  app.get("/api/admin/rag-content", async (req: Request, res: Response) => {
    try {
      const ragContents = await prisma.ragContent.findMany({
        orderBy: { order: 'asc' }
      });
      res.json(ragContents);
    } catch (error) {
      console.error("Error fetching RAG content:", error);
      res.status(500).json({ error: "Failed to fetch RAG content" });
    }
  });

  // Sync RAG content from database sections to DB and Pinecone (public)
  app.post("/api/admin/rag-sync", async (req: Request, res: Response) => {
    try {
      // Fetch all data from database
      const projects = await prisma.project.findMany({ orderBy: { id: 'desc' } });
      const experiences = await prisma.experience.findMany({ orderBy: { id: 'desc' } });
      const techStacks = await prisma.techStack.findMany({ orderBy: { name: 'asc' } });
      const blogPosts = await prisma.blogPost.findMany({ orderBy: { id: 'desc' } });

      // Build content for each category
      const sections = [
        {
          category: "projects",
          content: projects.map(p => 
            `Project: ${p.title} - ${p.description} (${(p.tags as string[]).join(", ")}). Demo: ${p.demoUrl || 'N/A'}. GitHub: ${p.repoUrl || 'N/A'}`
          ).join("\n"),
          order: 1
        },
        {
          category: "experience",
          content: experiences.map(e => 
            `Experience: ${e.role} at ${e.company} (${e.period}) - ${e.description} (${(e.technologies as string[]).join(", ")})`
          ).join("\n"),
          order: 2
        },
        {
          category: "skills",
          content: techStacks.map(s => `Skill: ${s.name}`).join("\n"),
          order: 3
        },
        {
          category: "blogs",
          content: blogPosts.map(b => `Blog: ${b.title} - ${b.excerpt}`).join("\n"),
          order: 4
        }
      ];

      // Save to database
      for (const section of sections) {
        await prisma.ragContent.upsert({
          where: { category: section.category },
          update: { content: section.content, order: section.order },
          create: { category: section.category, content: section.content, order: section.order }
        });
      }

      // Index to Pinecone if configured
      if (hasRAGConfig()) {
        try {
          initializeRAG();
          // Clear existing vectors and re-index
          for (const section of sections) {
            if (section.content.trim()) {
              const lines = section.content.split("\n").filter(line => line.trim());
              for (let i = 0; i < lines.length; i++) {
                await upsertToPinecone(`${section.category}-${i}`, lines[i].trim(), { 
                  type: section.category,
                  category: section.category
                });
              }
            }
          }
        } catch (ragError) {
          console.error("Error indexing to Pinecone:", ragError);
        }
      }

      res.json({ 
        success: true, 
        sections: sections.map(s => ({ category: s.category, lines: s.content.split("\n").filter(l => l.trim()).length }))
      });
    } catch (error) {
      console.error("Error syncing RAG:", error);
      res.status(500).json({ error: "Failed to sync RAG: " + String(error) });
    }
  });

  // UPDATE single RAG content section (public)
  app.put("/api/admin/rag-content/:category", async (req: Request, res: Response) => {
    try {
      const category = String(req.params.category);
      const { content } = req.body;

      if (!content || typeof content !== "string") {
        return res.status(400).json({ error: "Content is required" });
      }

      // Upsert to database
      const contentStr = String(content || "");
      const ragContent = await prisma.ragContent.upsert({
        where: { category },
        update: { content: contentStr },
        create: { category, content: contentStr, order: 999 }
      });

      // Index to Pinecone if configured
      if (hasRAGConfig()) {
        try {
          initializeRAG();
          const lines = contentStr.split("\n").filter(line => line.trim());
          // Delete old vectors for this category
          for (let i = 0; i < 100; i++) {
            try {
              const id = `${category}-${i}`;
              await deleteFromPinecone(id);
            } catch (err) {
              // Silently continue on individual delete errors
            }
          }
          // Add new vectors
          for (let i = 0; i < lines.length; i++) {
            await upsertToPinecone(`${category}-${i}`, lines[i].trim(), { 
              type: category,
              category 
            });
          }
          res.json({ success: true, lines: lines.length });
        } catch (ragError) {
          console.error("Error indexing to Pinecone:", ragError);
          res.json({ success: true, lines: 0 });
        }
      } else {
        res.json({ success: true, lines: contentStr.split("\n").filter(l => l.trim()).length });
      }
    } catch (error) {
      console.error("Error updating RAG content:", error);
      res.status(500).json({ error: "Failed to update RAG content" });
    }
  });

  // ADD new custom RAG section (public)
  app.post("/api/admin/rag-content", async (req: Request, res: Response) => {
    try {
      const { category, content, order } = req.body;

      if (!category || typeof category !== "string") {
        return res.status(400).json({ error: "Category is required" });
      }

      const ragContent = await prisma.ragContent.upsert({
        where: { category },
        update: { content: content || "" },
        create: { category, content: content || "", order: order || 999 }
      });

      // Index to Pinecone if configured and has content
      if (hasRAGConfig() && content?.trim()) {
        try {
          initializeRAG();
          const lines = content.split("\n").filter(line => line.trim());
          for (let i = 0; i < lines.length; i++) {
            await upsertToPinecone(`${category}-${i}`, lines[i].trim(), { 
              type: category,
              category 
            });
          }
        } catch (ragError) {
          console.error("Error indexing to Pinecone:", ragError);
        }
      }

      res.json({ success: true, ragContent });
    } catch (error) {
      console.error("Error adding RAG content:", error);
      res.status(500).json({ error: "Failed to add RAG content" });
    }
  });

  // DELETE RAG content section (public)
  app.delete("/api/admin/rag-content/:category", async (req: Request, res: Response) => {
    try {
      const category = String(req.params.category);

      await prisma.ragContent.delete({
        where: { category }
      }).catch(() => {});

      // Delete vectors from Pinecone
      if (hasRAGConfig()) {
        try {
          initializeRAG();
          for (let i = 0; i < 100; i++) {
            try {
              await deleteFromPinecone(`${category}-${i}`);
            } catch {}
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

  // Delete all Pinecone vectors (public)
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

  // Legacy endpoint - redirect to new
  app.get("/api/admin/custom-rag", async (req: Request, res: Response) => {
    try {
      const ragContents = await prisma.ragContent.findMany({ orderBy: { order: 'asc' } });
      const content = ragContents.map(r => r.content).join("\n\n");
      res.json({ content, sections: ragContents });
    } catch (error) {
      res.json({ content: "", sections: [] });
    }
  });

  // Legacy endpoint - redirect to sync
  app.post("/api/admin/custom-rag", requireAuth, async (req: Request, res: Response) => {
    // Redirect to the sync endpoint
    const projects = await prisma.project.findMany({ orderBy: { id: 'desc' } });
    const experiences = await prisma.experience.findMany({ orderBy: { id: 'desc' } });
    const techStacks = await prisma.techStack.findMany({ orderBy: { name: 'asc' } });
    const blogPosts = await prisma.blogPost.findMany({ orderBy: { id: 'desc' } });

    const sections = [
      { category: "projects", content: projects.map(p => `Project: ${p.title} - ${p.description} (${(p.tags as string[]).join(", ")})`).join("\n"), order: 1 },
      { category: "experience", content: experiences.map(e => `Experience: ${e.role} at ${e.company} (${e.period}) - ${e.description} (${(e.technologies as string[]).join(", ")})`).join("\n"), order: 2 },
      { category: "skills", content: techStacks.map(s => `Skill: ${s.name}`).join("\n"), order: 3 },
      { category: "blogs", content: blogPosts.map(b => `Blog: ${b.title} - ${b.excerpt}`).join("\n"), order: 4 }
    ];

    for (const section of sections) {
      await prisma.ragContent.upsert({
        where: { category: section.category },
        update: { content: section.content, order: section.order },
        create: { category: section.category, content: section.content, order: section.order }
      });
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

  // ============ GROQ AI CHAT (Server-side with RAG) ============

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

      // Try to use Pinecone RAG if configured
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
            
            // Always add contact info
            contextText += "\n\nContact: saugat.dhungana@gmail.com";
          }
        } catch (ragError) {
          console.error("RAG query failed, falling back to default:", ragError);
        }
      }

      // If no RAG context, use database directly
      if (!contextText) {
        const projects = await prisma.project.findMany({ orderBy: { id: 'desc' } });
        const experiences = await prisma.experience.findMany({ orderBy: { id: 'desc' } });
        const techStacks = await prisma.techStack.findMany({ orderBy: { name: 'asc' } });

        const projectsList = projects.map((p) => 
          `${p.title}: ${p.description} (${(p.tags as string[]).join(", ")}). Demo: ${p.demoUrl || 'N/A'}. GitHub: ${p.repoUrl || 'N/A'}`
        ).join(" | ");

        const experienceList = experiences.map((e) => 
          `${e.role} at ${e.company} (${e.period}) - ${(e.technologies as string[]).join(", ")}`
        ).join(" | ");

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

      // Check if current message uses pronouns or references to previous conversation
      const pronounPattern = /\b(it|this|that|these|those|them|they|their|his|her|him|she|he|its|one|which|what)\b/i;
      const continuationIndicators = /\b(about|more|details|tell me|explain|describe|and|also|what about|how about|what's|whats)\b/i;
      const isContinuation = pronounPattern.test(message) || continuationIndicators.test(message);

      // Build context from history only if related to previous conversation
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

      // Build messages array with history
      const messagesArray = [
        {
          role: "system",
          content: systemPromptWithHistory,
        },
      ];

      // Add conversation history (last 5 user messages only)
      if (history && Array.isArray(history)) {
        for (const h of history.slice(-5)) {
          messagesArray.push({
            role: h.role || "user",
            content: h.content || "",
          });
        }
      }

      // Add current message
      messagesArray.push({
        role: "user",
        content: message,
      });

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

  // Vite middleware for development
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
