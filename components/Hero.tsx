import React from 'react';
import Button from './ui/Button';
import { useScrollTo } from '../hooks/useScrollTo';

const Hero: React.FC = () => {
  const { scrollTo } = useScrollTo();

  return (
    <section className="min-h-screen flex items-center pt-20 relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          <div className="flex-1 text-center lg:text-left max-w-3xl">
            <span className="font-mono text-primary text-sm md:text-base mb-4 block animate-fade-in-up">
              Hi, my name is
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Saugat Dhungana.
            </h1>
            <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-muted mb-8 animate-fade-in-up whitespace-nowrap" style={{ animationDelay: '200ms' }}>
              Aspiring AI Engineer | Developer
            </h2>
            <p className="text-lg md:text-xl text-muted max-w-xl mx-auto lg:mx-0 mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              I'm an AI Engineer skilled in Machine Learning, NLP, and modern web development. I focus on building scalable AI systems, RAG pipelines, and integrating unstructured data to solve real-world problems.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <Button onClick={() => scrollTo('projects')}>
                Check out my work
              </Button>
              <Button variant="outline" onClick={() => scrollTo('contact')}>
                Get in touch
              </Button>
            </div>
          </div>

          <div className="flex-shrink-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="relative">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-primary/20 border-4 border-primary/50 flex items-center justify-center shadow-2xl backdrop-blur-sm">
                <span className="text-5xl md:text-6xl font-bold text-primary font-mono">
                  SD
                </span>
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;