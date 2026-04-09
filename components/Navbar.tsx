import React, { useState, useEffect } from 'react';
import { useScrollTo } from '../hooks/useScrollTo';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollTo } = useScrollTo();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (id: string) => {
    scrollTo(id);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Projects', id: 'projects' },
    { label: 'Experience', id: 'experience' },
    { label: 'Writings', id: 'blog' },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-md border-b border-border py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <a href="#" className="font-mono text-xl font-bold tracking-tighter hover:text-muted transition-colors text-foreground">
            saugat<span className="text-primary">.dev</span>
          </a>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-muted">
              <button onClick={() => scrollTo('projects')} className="hover:text-primary transition-colors">Projects</button>
              <button onClick={() => scrollTo('experience')} className="hover:text-primary transition-colors">Experience</button>
              <button onClick={() => scrollTo('blog')} className="hover:text-primary transition-colors">Writings</button>
              <a 
                href="/files/Saugat_Dhungana.pdf" 
                download="Saugat_Dhungana_CV.pdf"
                title="Download CV"
                className="text-muted hover:text-primary transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </a>
              <button 
                onClick={() => scrollTo('contact')} 
                className="px-4 py-2 bg-foreground text-background rounded hover:bg-primary hover:text-foreground transition-all duration-300 font-mono text-xs"
              >
                Let's Talk
              </button>
            </div>
            
            <button 
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-background/95 backdrop-blur-md"
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Menu Content */}
        <div className={`relative h-full flex flex-col justify-center items-center transition-all duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <button 
            className="absolute top-6 right-6 p-2 text-foreground"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div className="flex flex-col items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="text-2xl font-bold text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </button>
            ))}
            
            <a 
              href="/files/Saugat_Dhungana.pdf" 
              download="Saugat_Dhungana_CV.pdf"
              className="text-xl text-muted hover:text-primary transition-colors"
            >
              Download CV
            </a>

            <button 
              onClick={() => handleNavClick('contact')}
              className="mt-4 px-6 py-3 bg-foreground text-background rounded hover:bg-primary hover:text-foreground transition-all duration-300 font-mono text-sm"
            >
              Let's Talk
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;