/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
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
];

const Blog = () => {
  return (
    <AnimatedSection>
      <h2>My Writings</h2>
      <p>
        A collection of my thoughts, tutorials, and explorations in the world of
        technology.
      </p>

      <ul className="blog-list">
        {blogPosts.map((post) => (
          <li key={post.title} className="blog-post-card">
            <a href="#">
              <h3>{post.title}</h3>
            </a>
            <p className="blog-post-meta">{post.date}</p>
            <p>{post.excerpt}</p>
            <div className="blog-post-tags">
              {post.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </AnimatedSection>
  );
};

export default Blog;
