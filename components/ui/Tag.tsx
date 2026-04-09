import React from 'react';
import { cn } from '../../lib/utils';

interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'skill';
  className?: string;
}

const Tag: React.FC<TagProps> = ({ children, variant = 'default', className }) => {
  const baseClasses = 'text-xs font-mono text-muted';
  const variantClasses = {
    default: '',
    skill: 'px-3 py-2 bg-surface border border-border rounded text-sm hover:border-primary hover:text-primary transition-colors cursor-default'
  };

  return (
    <span className={cn(baseClasses, variantClasses[variant], className)}>
      {children}
    </span>
  );
};

export default Tag;