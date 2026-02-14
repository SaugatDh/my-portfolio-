import React, { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-md border-b border-border py-3' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <a href="#" className="font-mono text-xl font-bold tracking-tighter hover:text-muted transition-colors text-foreground">
          saugat<span className="text-primary">.dev</span>
        </a>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-muted">
            <button onClick={() => scrollToSection('projects')} className="hover:text-primary transition-colors">Projects</button>
            <button onClick={() => scrollToSection('experience')} className="hover:text-primary transition-colors">Experience</button>
            <button onClick={() => scrollToSection('blog')} className="hover:text-primary transition-colors">Writings</button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="px-4 py-2 bg-foreground text-background rounded hover:bg-primary hover:text-foreground transition-all duration-300 font-mono text-xs"
            >
              Let's Talk
            </button>
          </div>
          
          <ThemeToggle />

          {/* Mobile Menu Icon Placeholder */}
          <button className="md:hidden p-2 text-foreground" onClick={() => scrollToSection('contact')}>
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;