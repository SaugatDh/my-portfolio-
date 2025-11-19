import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import * as prismStyles from 'react-syntax-highlighter/dist/esm/styles/prism';

// Normalize different export shapes (named export or default)
const atomOneDark = (prismStyles as any).atomOneDark ?? (prismStyles as any).default ?? prismStyles;
import { BlogPost, getBlogPostBySlug } from '../src/utils/blogLoader';
import { Link } from 'react-router-dom';

const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      const foundPost = getBlogPostBySlug(slug);
      if (foundPost) {
        setPost(foundPost);
      } else {
        setError('Blog post not found.');
      }
    } else {
      setError('No blog post slug provided.');
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading blog post...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>;
  }

  if (!post) {
    return <div className="container mx-auto px-4 py-8">Blog post not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link to="/blog" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to Blog
      </Link>
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 text-sm mb-6">
        Published on {new Date(post.date).toLocaleDateString()}
        {post.tags && (
          <span className="ml-2">
            Tags: {post.tags.map((tag) => (
              <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #{tag}
              </span>
            ))}
          </span>
        )}
      </p>
      <article className="prose lg:prose-xl">
        <ReactMarkdown
          components={{
            // Use `any` for props to avoid react-markdown typing mismatches
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            code(props: any) {
              const { node, inline, className, children, ...rest } = props as any;
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  style={atomOneDark}
                  language={match[1]}
                  PreTag="div"
                  {...rest}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...rest}>
                  {children}
                </code>
              );
            },
          }}
        >
          {post.content}
        </ReactMarkdown>
      </article>
    </div>
  );
};

export default BlogDetailPage;
