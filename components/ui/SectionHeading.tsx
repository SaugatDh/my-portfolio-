import React from 'react';
import { cn } from '../../lib/utils';

interface SectionHeadingProps {
  number: string;
  title: string;
  className?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ number, title, className }) => {
  return (
    <div className={cn('flex items-center gap-4 mb-12', className)}>
      <span className="text-primary font-mono text-xl">{number}</span>
      <h2 className="text-3xl font-bold text-foreground">{title}</h2>
      <div className="h-px bg-border flex-1 max-w-xs"></div>
    </div>
  );
};

export default SectionHeading;