import React from 'react';
import { cn } from '../../lib/utils';

interface IconLinkProps {
  href: string;
  ariaLabel: string;
  children: React.ReactNode;
  className?: string;
}

const IconLink: React.FC<IconLinkProps> = ({ href, ariaLabel, children, className }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('hover:text-primary transition-colors', className)}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
};

export default IconLink;