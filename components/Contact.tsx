import React from 'react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-background flex flex-col items-center text-center relative z-10">
      <div className="container mx-auto px-6 md:px-12 max-w-2xl">
        <span className="text-primary font-mono mb-4 block">04. What's Next?</span>
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Get In Touch</h2>
        <p className="text-muted text-lg mb-12 leading-relaxed">
          I'm currently looking for new opportunities in AI and Software Engineering. Whether you have a question about my work or just want to say hi, I'll try my best to get back to you!
        </p>
        
        <a 
          href="mailto:saugatdhungana746@gmail.com" 
          className="inline-block px-8 py-4 bg-transparent border border-foreground text-foreground font-mono text-sm hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 rounded-sm"
        >
          Say Hello
        </a>
      </div>
    </section>
  );
};

export default Contact;