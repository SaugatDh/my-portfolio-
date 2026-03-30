import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BlogPost, Project, Experience as ExperienceType } from "../types";
import { apiFetch } from "../lib/api";

interface BlogFormData {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  slug: string;
  content: string;
}

interface ProjectFormData {
  title: string;
  description: string;
  image: string;
  tags: string;
  demoUrl: string;
  repoUrl: string;
}

interface ExperienceFormData {
  role: string;
  company: string;
  period: string;
  description: string;
  technologies: string;
}

interface TechStackFormData {
  name: string;
}

interface TechStack {
  id: number;
  name: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "blogs" | "projects" | "experience" | "techstacks" | "custom-rag"
  >("blogs");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<any>(null);
  const [ragSyncing, setRagSyncing] = useState(false);
  const [ragApplying, setRagApplying] = useState(false);
  const [ragStatus, setRagStatus] = useState<string>("");
  const [ragSections, setRagSections] = useState<{category: string; content: string; order: number; originalContent: string; applying?: boolean}[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [globalApplying, setGlobalApplying] = useState(false);

  // Blog form state
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [blogFormData, setBlogFormData] = useState<BlogFormData>({
    title: "",
    excerpt: "",
    date: "",
    readTime: "",
    slug: "",
    content: "",
  });

  // Project form state
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectFormData, setProjectFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    image: "",
    tags: "",
    demoUrl: "",
    repoUrl: "",
  });

  // Experience form state
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [editingExperience, setEditingExperience] =
    useState<ExperienceType | null>(null);
  const [experienceFormData, setExperienceFormData] =
    useState<ExperienceFormData>({
      role: "",
      company: "",
      period: "",
      description: "",
      technologies: "",
    });

  // Tech stack form state
  const [showTechStackForm, setShowTechStackForm] = useState(false);
  const [techStackFormData, setTechStackFormData] = useState<TechStackFormData>(
    {
      name: "",
    },
  );

  useEffect(() => {
    const sessionId = localStorage.getItem("adminSessionId");
    const adminData = localStorage.getItem("adminUser");

    if (!sessionId) {
      navigate("/admin/login");
      return;
    }

    setAdmin(adminData ? JSON.parse(adminData) : null);
    fetchPosts();
    fetchProjects();
    fetchExperiences();
    fetchTechStacks();
    
    // Load saved train content from localStorage
    const savedContent = localStorage.getItem("trainContent");
    if (savedContent) {
      try {
        setRagSections(JSON.parse(savedContent));
      } catch (e) {
        console.error("Error loading saved content:", e);
      }
    }
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      const response = await apiFetch("/api/blog");
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await apiFetch("/api/projects");
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  const fetchExperiences = async () => {
    try {
      const response = await apiFetch("/api/experience");
      const data = await response.json();
      setExperiences(data);
    } catch (err) {
      console.error("Failed to fetch experiences:", err);
    }
  };

  const fetchTechStacks = async () => {
    try {
      const response = await apiFetch("/api/tech-stacks");
      const data = await response.json();
      setTechStacks(data);
    } catch (err) {
      console.error("Failed to fetch tech stacks:", err);
    }
  };

  const handleBlogInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setBlogFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProjectInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProjectFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExperienceInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setExperienceFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTechStackInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setTechStackFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sessionId = localStorage.getItem("adminSessionId");

    try {
      const url = editingPost
        ? `/api/admin/blog/${editingPost.slug}`
        : "/api/admin/blog";
      const method = editingPost ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
        body: JSON.stringify(blogFormData),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to save post");
        return;
      }

      setBlogFormData({
        title: "",
        excerpt: "",
        date: "",
        readTime: "",
        slug: "",
        content: "",
      });
      setEditingPost(null);
      setShowBlogForm(false);
      fetchPosts();
    } catch (err) {
      console.error("Error saving post:", err);
      alert("Failed to save post");
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sessionId = localStorage.getItem("adminSessionId");

    try {
      const tagsArray = projectFormData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const payload = {
        ...projectFormData,
        tags: tagsArray,
      };

      const url = editingProject
        ? `/api/admin/projects/${editingProject.id}`
        : "/api/admin/projects";
      const method = editingProject ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to save project");
        return;
      }

      setProjectFormData({
        title: "",
        description: "",
        image: "",
        tags: "",
        demoUrl: "",
        repoUrl: "",
      });
      setEditingProject(null);
      setShowProjectForm(false);
      fetchProjects();
    } catch (err) {
      console.error("Error saving project:", err);
      alert("Failed to save project");
    }
  };

  const handleEditBlog = (post: BlogPost) => {
    setEditingPost(post);
    setBlogFormData({
      title: post.title || "",
      excerpt: post.excerpt || "",
      date: post.date || "",
      readTime: post.readTime || "",
      slug: post.slug || "",
      content: post.content || "",
    });
    setShowBlogForm(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      tags: Array.isArray(project.tags) ? project.tags.join(", ") : "",
      demoUrl: project.demoUrl || "",
      repoUrl: project.repoUrl || "",
    });
    setShowProjectForm(true);
  };

  const handleDeleteBlog = async (slug: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    const sessionId = localStorage.getItem("adminSessionId");

    try {
      const response = await fetch(`/api/admin/blog/${slug}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      });

      if (!response.ok) {
        alert("Failed to delete post");
        return;
      }

      fetchPosts();
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post");
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    const sessionId = localStorage.getItem("adminSessionId");

    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      });

      if (!response.ok) {
        alert("Failed to delete project");
        return;
      }

      fetchProjects();
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Failed to delete project");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminSessionId");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const handleLoadRAGSections = async () => {
    setRagSyncing(true);
    try {
      const response = await apiFetch("/api/admin/rag-content");
      const data = await response.json();
      const newSections = (data || []).map((s: any) => ({ ...s, originalContent: s.content }));
      setRagSections(newSections);
      // Save to localStorage
      localStorage.setItem("trainContent", JSON.stringify(newSections));
    } catch (err) {
      console.error("Error loading RAG sections:", err);
    } finally {
      setRagSyncing(false);
    }
  };

  const handleSyncFromDB = async () => {
    setRagSyncing(true);
    try {
      const response = await apiFetch("/api/admin/rag-sync", {
        method: "POST"
      });
      const data = await response.json();
      
      if (response.ok) {
        // Reload sections with original content tracking
        const loadResponse = await apiFetch("/api/admin/rag-content");
        const sectionsData = await loadResponse.json();
        const newSections = (sectionsData || []).map((s: any) => ({ ...s, originalContent: s.content }));
        setRagSections(newSections);
        // Save to localStorage
        localStorage.setItem("trainContent", JSON.stringify(newSections));
        alert(`Synced ${data.sections?.length || 0} sections from database!`);
      } else {
        alert(data.error || "Failed to sync");
      }
    } catch (err) {
      console.error("Error syncing RAG:", err);
      alert("Failed to sync from database");
    } finally {
      setRagSyncing(false);
    }
  };

  const handleUpdateSection = async (category: string, content: string) => {
    setRagSections(prev => prev.map(s => 
      s.category === category ? { ...s, applying: true } : s
    ));

    try {
      const response = await fetch(`/api/admin/rag-content/${category}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content })
      });
      
      if (response.ok) {
        const updatedSections = prev => prev.map(s => 
          s.category === category ? { ...s, originalContent: content, applying: false } : s
        );
        setRagSections(updatedSections);
        // Save to localStorage
        localStorage.setItem("trainContent", JSON.stringify(updatedSections));
        const data = await response.json();
        alert(`Trained "${category}" (${data.lines} lines)`);
      }
    } catch (err) {
      console.error("Error updating section:", err);
      setRagSections(prev => prev.map(s => 
        s.category === category ? { ...s, applying: false } : s
      ));
    }
  };

  const handleAddCategory = async () => {
    const sessionId = localStorage.getItem("adminSessionId");
    if (!sessionId || !newCategoryName.trim()) {
      return;
    }

    try {
      const response = await apiFetch("/api/admin/rag-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`
        },
        body: JSON.stringify({ category: newCategoryName.trim(), content: "" })
      });
      
      if (response.ok) {
        const newSection = { category: newCategoryName.trim(), content: "", originalContent: "", order: 999 };
        setRagSections(prev => [...prev, newSection]);
        localStorage.setItem("trainContent", JSON.stringify([...ragSections, newSection]));
        setNewCategoryName("");
      }
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  const handleDeleteCategory = async (category: string) => {
    if (!window.confirm(`Delete "${category}" section?`)) return;
    
    const sessionId = localStorage.getItem("adminSessionId");
    if (!sessionId) return;

    try {
      await fetch(`/api/admin/rag-content/${category}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${sessionId}` }
      });
      const newSections = ragSections.filter(s => s.category !== category);
      setRagSections(newSections);
      localStorage.setItem("trainContent", JSON.stringify(newSections));
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  const handleDeleteAllPinecone = async () => {
    if (!window.confirm("Delete ALL Pinecone vectors? This cannot be undone.")) return;
    
    try {
      const response = await apiFetch("/api/admin/rag-pinecone/all", {
        method: "DELETE"
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message || "All Pinecone vectors deleted!");
      } else {
        alert(data.error || "Failed to delete vectors");
      }
    } catch (err) {
      console.error("Error deleting all Pinecone vectors:", err);
      alert("Failed to delete vectors");
    }
  };

  const handleCancelBlog = () => {
    setBlogFormData({
      title: "",
      excerpt: "",
      date: "",
      readTime: "",
      slug: "",
      content: "",
    });
    setEditingPost(null);
    setShowBlogForm(false);
  };

  const handleCancelProject = () => {
    setProjectFormData({
      title: "",
      description: "",
      image: "",
      tags: "",
      demoUrl: "",
      repoUrl: "",
    });
    setEditingProject(null);
    setShowProjectForm(false);
  };

  const handleExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sessionId = localStorage.getItem("adminSessionId");

    try {
      const technologiesArray = experienceFormData.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech.length > 0);

      const payload = {
        ...experienceFormData,
        technologies: technologiesArray,
      };

      const url = editingExperience
        ? `/api/admin/experience/${editingExperience.id}`
        : "/api/admin/experience";
      const method = editingExperience ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to save experience");
        return;
      }

      setExperienceFormData({
        role: "",
        company: "",
        period: "",
        description: "",
        technologies: "",
      });
      setEditingExperience(null);
      setShowExperienceForm(false);
      fetchExperiences();
    } catch (err) {
      console.error("Error saving experience:", err);
      alert("Failed to save experience");
    }
  };

  const handleTechStackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sessionId = localStorage.getItem("adminSessionId");

    try {
      const response = await apiFetch("/api/admin/tech-stacks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
        body: JSON.stringify(techStackFormData),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to add tech stack");
        return;
      }

      setTechStackFormData({ name: "" });
      setShowTechStackForm(false);
      fetchTechStacks();
    } catch (err) {
      console.error("Error adding tech stack:", err);
      alert("Failed to add tech stack");
    }
  };

  const handleDeleteExperience = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this experience?"))
      return;

    const sessionId = localStorage.getItem("adminSessionId");

    try {
      const response = await fetch(`/api/admin/experience/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      });

      if (!response.ok) {
        alert("Failed to delete experience");
        return;
      }

      fetchExperiences();
    } catch (err) {
      console.error("Error deleting experience:", err);
      alert("Failed to delete experience");
    }
  };

  const handleDeleteTechStack = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this tech stack?"))
      return;

    const sessionId = localStorage.getItem("adminSessionId");

    try {
      const response = await fetch(`/api/admin/tech-stacks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      });

      if (!response.ok) {
        alert("Failed to delete tech stack");
        return;
      }

      fetchTechStacks();
    } catch (err) {
      console.error("Error deleting tech stack:", err);
      alert("Failed to delete tech stack");
    }
  };

  const handleCancelExperience = () => {
    setExperienceFormData({
      role: "",
      company: "",
      period: "",
      description: "",
      technologies: "",
    });
    setEditingExperience(null);
    setShowExperienceForm(false);
  };

  const handleEditExperience = (exp: ExperienceType) => {
    setEditingExperience(exp);
    setExperienceFormData({
      role: exp.role,
      company: exp.company,
      period: exp.period,
      description: exp.description,
      technologies: Array.isArray(exp.technologies)
        ? exp.technologies.join(", ")
        : "",
    });
    setShowExperienceForm(true);
  };

  const handleCancelTechStack = () => {
    setTechStackFormData({ name: "" });
    setShowTechStackForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted text-sm">Welcome, {admin?.username}</p>
            {ragStatus && (
              <p className="text-primary text-sm mt-1 font-mono">{ragStatus}</p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-mono text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border flex-wrap">
          <button
            onClick={() => setActiveTab("blogs")}
            className={`px-6 py-3 font-bold font-mono transition-colors ${
              activeTab === "blogs"
                ? "text-primary border-b-2 border-primary"
                : "text-muted hover:text-foreground"
            }`}
          >
            Blog Posts
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-6 py-3 font-bold font-mono transition-colors ${
              activeTab === "projects"
                ? "text-primary border-b-2 border-primary"
                : "text-muted hover:text-foreground"
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab("experience")}
            className={`px-6 py-3 font-bold font-mono transition-colors ${
              activeTab === "experience"
                ? "text-primary border-b-2 border-primary"
                : "text-muted hover:text-foreground"
            }`}
          >
            Experience
          </button>
          <button
            onClick={() => setActiveTab("techstacks")}
            className={`px-6 py-3 font-bold font-mono transition-colors ${
              activeTab === "techstacks"
                ? "text-primary border-b-2 border-primary"
                : "text-muted hover:text-foreground"
            }`}
          >
            Tech Stacks
          </button>
          <button
            onClick={() => setActiveTab("custom-rag")}
            className={`px-6 py-3 font-bold font-mono transition-colors ${
              activeTab === "custom-rag"
                ? "text-primary border-b-2 border-primary"
                : "text-muted hover:text-foreground"
            }`}
          >
            Train
          </button>
        </div>

        {/* Blogs Tab */}
        {activeTab === "blogs" && (
          <div>
            {/* Blog Form */}
            <div className="mb-12">
              {!showBlogForm ? (
                <button
                  onClick={() => setShowBlogForm(true)}
                  className="px-6 py-2 bg-primary text-foreground rounded font-mono font-bold hover:bg-primary-hover transition-colors"
                >
                  + Add New Blog Post
                </button>
              ) : (
                <div className="bg-surface border border-border rounded-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">
                    {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
                  </h2>

                  <form onSubmit={handleBlogSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={blogFormData.title}
                          onChange={handleBlogInputChange}
                          placeholder="Blog post title"
                          className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Slug *
                        </label>
                        <input
                          type="text"
                          name="slug"
                          value={blogFormData.slug}
                          onChange={handleBlogInputChange}
                          placeholder="blog-post-slug"
                          className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                          disabled={!!editingPost}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Excerpt *
                      </label>
                      <textarea
                        name="excerpt"
                        value={blogFormData.excerpt}
                        onChange={handleBlogInputChange}
                        placeholder="Brief description of the post"
                        rows={3}
                        className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Date
                        </label>
                        <input
                          type="text"
                          name="date"
                          value={blogFormData.date}
                          onChange={handleBlogInputChange}
                          placeholder="Dec 20, 2025"
                          className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Read Time
                        </label>
                        <input
                          type="text"
                          name="readTime"
                          value={blogFormData.readTime}
                          onChange={handleBlogInputChange}
                          placeholder="10 min read"
                          className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Content
                      </label>
                      <textarea
                        name="content"
                        value={blogFormData.content}
                        onChange={handleBlogInputChange}
                        placeholder="Full blog post content..."
                        rows={8}
                        className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-foreground text-background rounded font-mono font-bold hover:bg-primary transition-colors"
                      >
                        {editingPost ? "Update Post" : "Create Post"}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelBlog}
                        className="px-6 py-2 border border-border rounded font-mono font-bold hover:border-foreground transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Blog Posts List */}
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Blog Posts ({posts.length})
              </h2>

              {posts.length === 0 ? (
                <p className="text-muted">
                  No blog posts yet. Create one to get started!
                </p>
              ) : (
                <div className="grid gap-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-surface border border-border rounded-lg p-6 flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                        <p className="text-muted text-sm mb-2">
                          {post.excerpt}
                        </p>
                        <div className="flex gap-4 text-xs font-mono text-muted">
                          <span>{post.date}</span>
                          <span>{post.readTime}</span>
                          <code className="px-2 py-1 bg-background rounded">
                            {post.slug}
                          </code>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEditBlog(post)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(post.slug)}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div>
            {/* Project Form */}
            <div className="mb-12">
              {!showProjectForm ? (
                <button
                  onClick={() => setShowProjectForm(true)}
                  className="px-6 py-2 bg-primary text-foreground rounded font-mono font-bold hover:bg-primary-hover transition-colors"
                >
                  + Add New Project
                </button>
              ) : (
                <div className="bg-surface border border-border rounded-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">
                    {editingProject ? "Edit Project" : "Create New Project"}
                  </h2>

                  <form onSubmit={handleProjectSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={projectFormData.title}
                          onChange={handleProjectInputChange}
                          placeholder="Project title"
                          className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Image URL *
                        </label>
                        <input
                          type="text"
                          name="image"
                          value={projectFormData.image}
                          onChange={handleProjectInputChange}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={projectFormData.description}
                        onChange={handleProjectInputChange}
                        placeholder="Project description"
                        rows={4}
                        className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Tech Stack (comma-separated) *
                        </label>
                        <input
                          type="text"
                          name="tags"
                          value={projectFormData.tags}
                          onChange={handleProjectInputChange}
                          placeholder="React, TypeScript, Tailwind CSS"
                          className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Demo URL
                        </label>
                        <input
                          type="text"
                          name="demoUrl"
                          value={projectFormData.demoUrl}
                          onChange={handleProjectInputChange}
                          placeholder="https://demo.example.com"
                          className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Repository URL
                      </label>
                      <input
                        type="text"
                        name="repoUrl"
                        value={projectFormData.repoUrl}
                        onChange={handleProjectInputChange}
                        placeholder="https://github.com/user/project"
                        className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-foreground text-background rounded font-mono font-bold hover:bg-primary transition-colors"
                      >
                        {editingProject ? "Update Project" : "Create Project"}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelProject}
                        className="px-6 py-2 border border-border rounded font-mono font-bold hover:border-foreground transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Projects List */}
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Projects ({projects.length})
              </h2>

              {projects.length === 0 ? (
                <p className="text-muted">
                  No projects yet. Create one to get started!
                </p>
              ) : (
                <div className="grid gap-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-surface border border-border rounded-lg p-6"
                    >
                      <div className="flex gap-4">
                        {project.image && (
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-32 h-32 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">
                            {project.title}
                          </h3>
                          <p className="text-muted text-sm mb-3">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {Array.isArray(project.tags) &&
                              project.tags.map((tag, idx) => (
                                <code
                                  key={idx}
                                  className="px-2 py-1 bg-background rounded text-xs"
                                >
                                  {tag}
                                </code>
                              ))}
                          </div>
                          <div className="flex gap-4 text-xs font-mono text-muted">
                            {project.demoUrl && (
                              <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                Demo
                              </a>
                            )}
                            {project.repoUrl && (
                              <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                Repo
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleEditProject(project)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === "experience" && (
          <div>
            {/* Experience Form */}
            <div className="mb-12">
              {!showExperienceForm ? (
                <button
                  onClick={() => setShowExperienceForm(true)}
                  className="px-6 py-2 bg-primary text-foreground rounded font-mono font-bold hover:bg-primary-hover transition-colors"
                >
                  + Add New Experience
                </button>
              ) : (
                <div className="bg-surface border border-border rounded-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">
                    {editingExperience
                      ? "Edit Experience"
                      : "Create New Experience"}
                  </h2>

                  <form onSubmit={handleExperienceSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Role *
                        </label>
                        <input
                          type="text"
                          name="role"
                          value={experienceFormData.role}
                          onChange={handleExperienceInputChange}
                          placeholder="Job title"
                          className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Company *
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={experienceFormData.company}
                          onChange={handleExperienceInputChange}
                          placeholder="Company name"
                          className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Period *
                      </label>
                      <input
                        type="text"
                        name="period"
                        value={experienceFormData.period}
                        onChange={handleExperienceInputChange}
                        placeholder="Jan 2023 - Jul 2023"
                        className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={experienceFormData.description}
                        onChange={handleExperienceInputChange}
                        placeholder="Job description"
                        rows={4}
                        className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Technologies (comma-separated) *
                      </label>
                      <input
                        type="text"
                        name="technologies"
                        value={experienceFormData.technologies}
                        onChange={handleExperienceInputChange}
                        placeholder="Python, React, Django"
                        className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-foreground text-background rounded font-mono font-bold hover:bg-primary transition-colors"
                      >
                        {editingExperience
                          ? "Update Experience"
                          : "Create Experience"}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelExperience}
                        className="px-6 py-2 border border-border rounded font-mono font-bold hover:border-foreground transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Experience List */}
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Experience ({experiences.length})
              </h2>

              {experiences.length === 0 ? (
                <p className="text-muted">
                  No experience entries yet. Create one to get started!
                </p>
              ) : (
                <div className="grid gap-4">
                  {experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="bg-surface border border-border rounded-lg p-6"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-foreground">
                            {exp.role}{" "}
                            <span className="text-primary">
                              @ {exp.company}
                            </span>
                          </h3>
                          <span className="font-mono text-sm text-muted">
                            {exp.period}
                          </span>
                        </div>
                      </div>
                      <p className="text-muted text-sm mb-3 max-w-2xl">
                        {exp.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {Array.isArray(exp.technologies) &&
                          exp.technologies.map((tech, idx) => (
                            <code
                              key={idx}
                              className="px-2 py-1 bg-background rounded text-xs"
                            >
                              {tech}
                            </code>
                          ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditExperience(exp)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteExperience(exp.id as any)}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tech Stacks Tab */}
        {activeTab === "techstacks" && (
          <div>
            {/* Tech Stack Form */}
            <div className="mb-12">
              {!showTechStackForm ? (
                <button
                  onClick={() => setShowTechStackForm(true)}
                  className="px-6 py-2 bg-primary text-foreground rounded font-mono font-bold hover:bg-primary-hover transition-colors"
                >
                  + Add New Tech Stack
                </button>
              ) : (
                <div className="bg-surface border border-border rounded-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">
                    Add New Tech Stack
                  </h2>

                  <form onSubmit={handleTechStackSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Tech Stack Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={techStackFormData.name}
                        onChange={handleTechStackInputChange}
                        placeholder="e.g., React, Python, Docker"
                        className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-foreground text-background rounded font-mono font-bold hover:bg-primary transition-colors"
                      >
                        Add Tech Stack
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelTechStack}
                        className="px-6 py-2 border border-border rounded font-mono font-bold hover:border-foreground transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Tech Stacks List */}
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Tech Stacks ({techStacks.length})
              </h2>

              {techStacks.length === 0 ? (
                <p className="text-muted">
                  No tech stacks yet. Add one to get started!
                </p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {techStacks.map((stack) => (
                    <div
                      key={stack.id}
                      className="px-4 py-3 bg-surface border border-border rounded flex items-center justify-between gap-4"
                    >
                      <span className="font-mono text-sm">{stack.name}</span>
                      <button
                        onClick={() => handleDeleteTechStack(stack.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* RAG Tab */}
        {activeTab === "custom-rag" && (
          <div>
            <div className="bg-surface border border-border rounded-lg p-8 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Train Content</h2>
                  <p className="text-muted text-sm">
                    Manage content sections for the AI chatbot. Sync from DB or edit each section.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleLoadRAGSections}
                    disabled={ragSyncing}
                    className="px-4 py-2 border border-border rounded font-mono text-sm hover:border-foreground transition-colors disabled:opacity-50"
                  >
                    {ragSyncing ? "Loading..." : "Load"}
                  </button>
                  <button
                    onClick={handleSyncFromDB}
                    disabled={ragSyncing}
                    className="px-4 py-2 bg-blue-600 text-white rounded font-mono text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {ragSyncing ? "Syncing..." : "Sync from DB"}
                  </button>
                  <button
                    onClick={async () => {
                      setGlobalApplying(true);
                      for (const section of ragSections) {
                        if (section.content !== section.originalContent) {
                          await handleUpdateSection(section.category, section.content);
                        }
                      }
                      setGlobalApplying(false);
                      alert("All changes trained!");
                    }}
                    disabled={ragSyncing || ragSections.length === 0 || globalApplying}
                    className="px-4 py-2 bg-purple-600 text-white rounded font-mono text-sm hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    {globalApplying ? "Training..." : "Train All"}
                  </button>
                  <button
                    onClick={handleDeleteAllPinecone}
                    className="px-4 py-2 bg-red-600 text-white rounded font-mono text-sm hover:bg-red-700 transition-colors"
                  >
                    Clear Pinecone
                  </button>
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-6">
              {ragSections.length === 0 ? (
                <div className="text-center py-12 text-muted">
                  <p>No sections yet.</p>
                  <p className="text-sm">Click "Sync from DB" to load from database or add a new category below.</p>
                </div>
              ) : (
                ragSections.map((section) => {
                  const hasChanges = section.content !== section.originalContent;
                  return (
                  <div key={section.category} className="bg-surface border border-border rounded-lg p-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-bold capitalize">{section.category}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateSection(section.category, section.content)}
                          disabled={section.applying}
                          className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {section.applying ? "Training..." : "Train"}
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(section.category)}
                          className="px-3 py-1 text-red-500 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={section.content}
                      onChange={(e) => {
                        setRagSections(prev => prev.map(s => 
                          s.category === section.category ? { ...s, content: e.target.value } : s
                        ));
                      }}
                      onBlur={(e) => {
                        if (e.target.value !== section.originalContent) {
                          handleUpdateSection(section.category, e.target.value);
                        }
                      }}
                      placeholder={`Enter content for ${section.category}...`}
                      rows={6}
                      className="w-full px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                    />
                    <p className="text-xs text-muted mt-2">
                      {hasChanges ? "Changes pending - click Train to save" : "No changes"}
                    </p>
                  </div>
                );})
              )}
            </div>

            <div className="mt-6 bg-surface border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold mb-3">Add New Category</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Category name (e.g., awards, publications)"
                  className="flex-1 px-4 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim()}
                  className="px-6 py-2 bg-purple-600 text-white rounded font-mono font-bold hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
