import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { BlogPost } from "../types";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AIChatbot from "./AIChatbot";

const BlogPostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setLoading(false);
        window.scrollTo(0, 0);
      })
      .catch((err) => {
        console.error("Failed to fetch blog post:", err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen text-foreground page-enter">
        <Navbar />
        <main className="pt-32 pb-24 container mx-auto px-6 md:px-12">
          <article className="max-w-4xl mx-auto">
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-border rounded w-32"></div>
              <div className="h-10 bg-border rounded w-3/4"></div>
              <div className="flex gap-4">
                <div className="h-4 bg-border rounded w-24"></div>
                <div className="h-4 bg-border rounded w-24"></div>
              </div>
              <div className="h-64 bg-border rounded w-full mt-8"></div>
              <div className="space-y-3 mt-8">
                <div className="h-4 bg-border rounded w-full"></div>
                <div className="h-4 bg-border rounded w-full"></div>
                <div className="h-4 bg-border rounded w-5/6"></div>
                <div className="h-4 bg-border rounded w-4/6"></div>
                <div className="h-4 bg-border rounded w-full"></div>
                <div className="h-4 bg-border rounded w-3/4"></div>
              </div>
            </div>
          </article>
        </main>
        <Footer />
        <AIChatbot />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-background min-h-screen text-foreground flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <Link to="/blog" className="text-primary hover:underline font-mono">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-foreground">
      <Navbar />
      <main className="pt-32 pb-24 container mx-auto px-6 md:px-12">
        <article className="max-w-3xl mx-auto">
          <nav className="mb-8 flex items-center gap-2 text-sm font-mono text-muted">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-primary transition-colors">
              Writings
            </Link>
            <span>/</span>
            <span className="text-foreground">{post.title}</span>
          </nav>
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-muted font-mono text-xs">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-muted leading-relaxed mb-8 italic">
              {post.excerpt}
            </p>
            <div className="text-foreground leading-relaxed space-y-6">
              {/* In a real app, we'd render markdown here */}
              <p>{post.content || "No content available for this post."}</p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
      <AIChatbot />
    </div>
  );
};

export default BlogPostDetail;
