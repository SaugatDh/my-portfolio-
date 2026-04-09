import React from 'react';
import Section from './ui/Section';
import Button from './ui/Button';

const Contact: React.FC = () => {
  return (
    <Section id="contact" className="flex flex-col items-center text-center">
      <span className="text-primary font-mono mb-4 block">04. What's Next?</span>
      <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Get In Touch</h2>
      <p className="text-muted text-lg mb-12 leading-relaxed max-w-2xl text-center">
        I'm currently looking for new opportunities in AI and Software Engineering. Whether you have a question about my work or just want to say hi, I'll try my best to get back to you!
      </p>
      
      <a href="mailto:saugatdhungana746@gmail.com">
        <Button variant="outline">
          Say Hello
        </Button>
      </a>
    </Section>
  );
};

export default Contact;