# Blog System - How to Add New Posts

Your portfolio now has a markdown-based blog system! Here's how to use it:

## Adding a New Blog Post

1. **Create a new `.md` file** in the `content/blog/` directory
2. **Add frontmatter** at the top of the file with metadata:

```markdown
---
title: "Your Post Title"
date: "2024-01-15"
excerpt: "A brief description of your post (shown on the blog list page)"
tags: ["Tag1", "Tag2", "Tag3"]
---

# Your Post Content

Write your blog post content here using markdown...
```

3. **Save the file** - the website will automatically detect and display it!

## Example

See the example posts in `content/blog/`:
- `getting-started-with-react-hooks.md`
- `building-scalable-web-applications.md`

## Frontmatter Fields

- **title** (required): The title of your blog post
- **date** (required): Publication date in YYYY-MM-DD format
- **excerpt** (required): Short description for the blog list page
- **tags** (required): Array of tags/categories

## Markdown Support

You can use all standard markdown features:
- Headers (`#`, `##`, `###`)
- **Bold** and *italic* text
- Lists (ordered and unordered)
- Code blocks with syntax highlighting
- Links and images
- Blockquotes
- And more!

## File Naming

- Use lowercase with hyphens: `my-blog-post.md`
- The filename becomes the URL slug
- Avoid spaces and special characters

## Sorting

Posts are automatically sorted by date (newest first) on the blog page.

## Pagination

The blog page shows 5 posts per page with automatic pagination controls.

## That's it!

Just add markdown files to `content/blog/` and they'll appear on your website automatically. No code changes needed!
