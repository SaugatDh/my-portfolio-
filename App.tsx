import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';

function App() {
  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Experience />
        <Blog />
        <Contact />
      </main>
      <Footer />
      <AIChatbot />
    </div>
  );
}

export default App;