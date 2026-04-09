import React from 'react';
import { SOCIALS } from '../constants';
import SocialButton from './ui/SocialButton';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 bg-background text-center border-t border-border relative z-10">
      <div className="flex justify-center gap-8 mb-6">
        {SOCIALS.map((social) => (
          <SocialButton key={social.platform} platform={social.platform} url={social.url} />
        ))}
      </div>
      <a 
        href="https://github.com/SaugatDh" 
        target="_blank" 
        rel="noopener noreferrer"
        className="font-mono text-xs text-muted hover:text-primary transition-colors"
      >
        Designed & Built by Saugat Dhungana
      </a>
    </footer>
  );
};

export default Footer;