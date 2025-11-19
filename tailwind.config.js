/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./content/**/*.md",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            h1: {
              color: 'var(--text-primary)',
            },
            h2: {
              color: 'var(--text-primary)',
            },
            h3: {
              color: 'var(--text-primary)',
            },
            h4: {
              color: 'var(--text-primary)',
            },
            h5: {
              color: 'var(--text-primary)',
            },
            h6: {
              color: 'var(--text-primary)',
            },
            p: {
              color: 'var(--text-secondary)',
            },
            img: {
              marginTop: '1.25rem',
              marginBottom: '1.25rem',
              borderRadius: '0.5rem',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            },
            pre: {
              backgroundColor: 'var(--code-bg)',
              color: 'var(--text-primary)',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflowX: 'auto',
            },
            'pre code': {
              background: 'transparent',
              padding: '0',
            },
            table: {
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '1rem',
              marginBottom: '1rem',
            },
            thead: {
              borderBottomColor: 'var(--border-light)',
            },
            'th, td': {
              padding: '0.5rem 0.75rem',
              borderBottomColor: 'var(--border-light)',
            },
            hr: {
              borderColor: 'var(--border-light)',
              marginTop: '2rem',
              marginBottom: '2rem',
            },
            a: {
              color: 'var(--text-link)',
              textDecoration: 'underline',
              '&:hover': {
                color: 'var(--text-link-hover)',
              },
            },
            strong: {
              color: 'var(--text-primary)',
            },
            code: {
              backgroundColor: 'var(--code-bg)',
              color: 'var(--text-primary)',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            blockquote: {
              color: 'var(--text-secondary)',
              borderLeftColor: 'var(--border-light)',
            },
            ul: {
              listStyleType: 'disc',
            },
            ol: {
              listStyleType: 'decimal',
            },
            'ul > li::marker': {
              color: 'var(--text-tertiary)',
            },
            'ol > li::marker': {
              color: 'var(--text-tertiary)',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}