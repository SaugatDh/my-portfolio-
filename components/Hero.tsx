import React from 'react';

const Hero: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center pt-20 relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl">
          <span className="font-mono text-primary text-sm md:text-base mb-4 block animate-fade-in-up">
            Hi, my name is
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Saugat Dhungana.
          </h1>
          <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-muted mb-8 animate-fade-in-up whitespace-nowrap" style={{ animationDelay: '200ms' }}>
            Aspiring AI Engineer | Developer
          </h2>
          <p className="text-lg md:text-xl text-muted max-w-xl mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            I'm an AI Engineer skilled in Machine Learning, NLP, and modern web development. I focus on building scalable AI systems, RAG pipelines, and integrating unstructured data to solve real-world problems.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <button 
              onClick={() => scrollTo('projects')}
              className="px-8 py-4 bg-foreground text-background text-sm font-mono hover:bg-primary hover:text-foreground transition-all duration-300 rounded-sm"
            >
              Check out my work
            </button>
            <button 
              onClick={() => scrollTo('contact')}
              className="px-8 py-4 border border-foreground text-foreground text-sm font-mono hover:bg-surface transition-all duration-300 rounded-sm"
            >
              Get in touch
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;