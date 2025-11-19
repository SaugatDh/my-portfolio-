/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useState } from 'react';
import AnimatedSection from '../components/AnimatedSection';

const blogPosts = [
  {
    title: 'Diving into React Hooks: A Beginner’s Guide',
    date: 'October 26, 2023',
    excerpt:
      'React Hooks have changed the way we write functional components. In this post, we explore the most common hooks like useState, useEffect, and useContext with practical examples.',
    tags: ['React', 'JavaScript', 'Web Development'],
  },
  {
    title: 'Getting Started with YOLOv8 for Object Detection',
    date: 'September 15, 2023',
    excerpt:
      'YOLOv8 is a powerful, state-of-the-art model for object detection. This guide will walk you through setting up your environment and training your first custom object detection model.',
    tags: ['AI', 'Machine Learning', 'Python'],
  },
  {
    title: 'Building a Simple IoT Weather Station with Arduino',
    date: 'August 02, 2023',
    excerpt:
      'Learn how to build your own weather station using an Arduino and a few common sensors. We will cover the hardware setup, coding, and how to send data to the cloud.',
    tags: ['IoT', 'Arduino', 'Hardware'],
  },
  {
    title: 'The Importance of UI/UX in Modern Web Design',
    date: 'July 21, 2023',
    excerpt:
      'A great user interface is more than just aesthetics. It’s about creating an intuitive and enjoyable experience for your users. We discuss key principles and best practices for effective UI/UX design.',
    tags: ['UI/UX', 'Design', 'Web Development'],
  },
  {
    title: 'Understanding TypeScript Generics',
    date: 'June 10, 2023',
    excerpt:
      'Generics allow you to write reusable, adaptable code. In this article, we break down the concept of generics in TypeScript and how to use them effectively in your projects.',
    tags: ['TypeScript', 'Web Development', 'Coding'],
  },
  {
    title: 'Introduction to Docker for Developers',
    date: 'May 05, 2023',
    excerpt:
      'Docker has revolutionized how we build, ship, and run applications. Learn the basics of containers, images, and how to containerize a simple Node.js application.',
    tags: ['DevOps', 'Docker', 'Containers'],
  },
  {
    title: 'CSS Grid vs. Flexbox: When to Use Which?',
    date: 'April 18, 2023',
    excerpt:
      'CSS Grid and Flexbox are powerful layout systems. We compare the two and provide guidelines on when to choose one over the other for your web layouts.',
    tags: ['CSS', 'Web Design', 'Frontend'],
  },
  {
    title: 'Optimizing React Performance',
    date: 'March 22, 2023',
    excerpt:
      'Is your React app feeling sluggish? Discover techniques to optimize performance, including memoization, code splitting, and efficient state management.',
    tags: ['React', 'Performance', 'JavaScript'],
  },
];

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(blogPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPosts = blogPosts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <AnimatedSection className="max-w-4xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-5xl font-medium mb-6">My Writings</h2>
        <p className="text-[var(--text-secondary)] text-xl">
          A collection of my thoughts, tutorials, and explorations in the world of
          technology.
        </p>
      </div>

      <ul className="space-y-16 mb-20">
        {currentPosts.map((post) => (
          <li key={post.title} className="flex flex-col border-b border-[var(--border-light)] pb-16 last:border-0">
            <p className="text-sm text-[var(--text-tertiary)] mb-3">{post.date}</p>
            <a href="#" className="group">
              <h3 className="text-2xl font-medium mb-4 group-hover:text-[var(--text-secondary)] transition-colors">
                {post.title}
              </h3>
            </a>
            <p className="text-[var(--text-secondary)] text-lg mb-6 leading-relaxed">{post.excerpt}</p>
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
