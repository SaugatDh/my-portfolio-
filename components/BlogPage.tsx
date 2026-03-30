import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BlogPost } from "../types";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AIChatbot from "./AIChatbot";

const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch blog posts:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="bg-background min-h-screen text-foreground page-enter">
        <Navbar />
        <main className="pt-32 pb-24 container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <nav className="mb-8 flex items-center gap-2 text-sm font-mono text-muted">
              <a href="/" className="hover:text-primary transition-colors">
                Home
              </a>
              <span>/</span>
              <span className="text-foreground">Blog</span>
            </nav>
            <h1 className="text-5xl font-bold mb-4">Blog</h1>
            <p className="text-muted mb-12 font-mono">
              A collection of my thoughts on AI, Engineering, and more.
            </p>

            <div className="grid gap-12">
              {[1, 2, 3].map((index) => (
                <article key={index} className="group">
                  <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-2">
                    <div className="h-3 bg-border rounded w-24 animate-pulse"></div>
                    <div className="h-7 bg-border rounded w-3/4 animate-pulse"></div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-border rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-border rounded w-5/6 animate-pulse"></div>
                    <div className="h-4 bg-border rounded w-4/6 animate-pulse"></div>
                  </div>
                  <div className="h-4 bg-border rounded w-20 animate-pulse"></div>
                </article>
              ))}
            </div>
          </div>
        </main>
        <Footer />
        <AIChatbot />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-foreground page-enter">
      <Navbar />
      <main className="pt-32 pb-24 container mx-auto px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <nav className="mb-8 flex items-center gap-2 text-sm font-mono text-muted">
            <a href="/" className="hover:text-primary transition-colors">
              Home
            </a>
            <span>/</span>
            <span className="text-foreground">Blog</span>
          </nav>
          <h1 className="text-5xl font-bold mb-4">Blog</h1>
          <p className="text-muted mb-12 font-mono">
            A collection of my thoughts on AI, Engineering, and more.
          </p>

          <div className="grid gap-12">
            {posts.map((post) => (
              <article key={post.id} className="group">
                <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-2">
                  <span className="font-mono text-xs text-primary">
                    {post.date}
                  </span>
                  <h2
                    onClick={() => navigate(`/blog/${post.slug}`)}
                    className="text-2xl font-bold group-hover:text-primary transition-colors cursor-pointer"
                  >
                    {post.title}
                  </h2>
                </div>
                <p className="text-muted leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                <button
                  onClick={() => navigate(`/blog/${post.slug}`)}
                  className="text-sm font-mono font-bold hover:text-primary transition-colors cursor-pointer bg-none border-none"
                >
                  Read more &rarr;
                </button>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <AIChatbot />
    </div>
  );
};

export default BlogPage;
