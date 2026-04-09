import React from 'react';
import { BLOG_POSTS } from '../constants';
import Section from './ui/Section';
import SectionHeading from './ui/SectionHeading';

const Blog: React.FC = () => {
  return (
    <Section id="blog">
      <SectionHeading number="03." title="Writings" />

      <div className="grid gap-6 max-w-3xl">
        {BLOG_POSTS.map((post) => (
          <div key={post.id} className="group flex flex-col md:flex-row md:items-baseline md:justify-between p-6 -mx-6 rounded-lg hover:bg-surface transition-colors cursor-pointer border border-transparent hover:border-border">
            <div className="flex-1 pr-8">
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                {post.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-3">
                {post.excerpt}
              </p>
              <span className="inline-block text-xs font-mono font-bold text-muted group-hover:text-foreground transition-colors border-b border-transparent group-hover:border-foreground">
                Read Article &rarr;
              </span>
            </div>
            <div className="mt-2 md:mt-0 font-mono text-xs text-muted shrink-0 text-right">
              <div className="mb-1">{post.date}</div>
              <div>{post.readTime}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12">
        <a href="#" className="inline-flex items-center text-sm font-mono font-bold text-foreground hover:text-primary transition-colors">
          View all articles <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </a>
      </div>
    </Section>
  );
};

export default Blog;