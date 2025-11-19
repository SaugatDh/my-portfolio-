/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import { getAllBlogPosts } from '../src/utils/blogLoader';

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Load blog posts from markdown files
  const blogPosts = getAllBlogPosts();

  const totalPages = Math.ceil(blogPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPosts = blogPosts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <AnimatedSection className="max-w-4xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium mb-6">My Writings</h2>
        <p className="text-base sm:text-lg text-[var(--text-secondary)]">
          A collection of my thoughts, tutorials, and explorations in the world of
          technology.
        </p>
      </div>

      <ul className="space-y-16 mb-20">
        {currentPosts.map((post) => (
          <li key={post.title} className="flex flex-col border-b border-[var(--border-light)] pb-16 last:border-0">
            <p className="text-sm text-[var(--text-tertiary)] mb-3">{post.date}</p>
            <Link to={`/blog/${post.slug}`} className="group">
              <h3 className="text-lg sm:text-xl font-medium mb-4 group-hover:text-[var(--text-secondary)] transition-colors">
                {post.title}
              </h3>
            </Link>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] mb-6 leading-relaxed">{post.excerpt}</p>
            <div className="flex flex-wrap gap-3 mt-auto">
              {post.tags.map((tag) => (
                <span key={tag} className="text-sm font-medium px-3 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded">
                  {tag}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="flex justify-center gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-6 py-2 rounded-full border border-[var(--border-light)] text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--bg-secondary)] transition-colors"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentPage === page
                ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-6 py-2 rounded-full border border-[var(--border-light)] text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--bg-secondary)] transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </AnimatedSection>
  );
};

export default Blog;
