import matter from 'gray-matter';

export interface BlogPost {
    title: string;
    date: string;
    excerpt: string;
    tags: string[];
    content: string;
    slug: string;
}

// Format date to readable format (e.g., "January 15, 2024")
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Import all markdown files from the blog directory
const blogModules = import.meta.glob('/content/blog/*.md', { query: '?raw', import: 'default', eager: true });

export function getAllBlogPosts(): BlogPost[] {
    const posts: BlogPost[] = [];

    for (const path in blogModules) {
        // Skip README.md
        if (path.includes('README.md')) {
            continue;
        }

        const rawContent = blogModules[path] as string;
        const { data, content } = matter(rawContent);

        // Extract slug from filename
        const slug = path.replace('/content/blog/', '').replace('.md', '');

        posts.push({
            title: data.title || 'Untitled',
            date: data.date ? formatDate(data.date) : formatDate(new Date().toISOString()),
            excerpt: data.excerpt || '',
            tags: data.tags || [],
            content,
            slug,
        });
    }

    // Sort by date (newest first) - parse the formatted date back for comparison
    return posts.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
    });
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
    const posts = getAllBlogPosts();
    return posts.find(post => post.slug === slug);
}
