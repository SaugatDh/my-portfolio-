import React from 'react';
import { cn } from '../../lib/utils';

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ id, children, className }) => {
  return (
    <section 
      id={id} 
      className={cn('py-24 bg-background relative z-10', className)}
    >
      <div className="container mx-auto px-6 md:px-12">
        {children}
      </div>
    </section>
  );
};

export default Section;