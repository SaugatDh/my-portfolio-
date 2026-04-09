import React from 'react';
import { PROJECTS } from '../constants';
import Section from './ui/Section';
import SectionHeading from './ui/SectionHeading';
import Tag from './ui/Tag';
import IconLink from './ui/IconLink';

const Projects: React.FC = () => {
  return (
    <Section id="projects">
      <SectionHeading number="01." title="Some Things I've Built" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROJECTS.map((project) => (
          <div key={project.id} className="group relative bg-surface p-8 rounded-lg border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg flex flex-col h-full">
            <div className="flex justify-between items-center mb-8">
              <div className="text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <div className="flex gap-4 text-muted">
                {project.repoUrl && (
                  <IconLink href={project.repoUrl} ariaLabel="GitHub Repo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </IconLink>
                )}
                {project.demoUrl && project.demoUrl !== '#' && (
                  <IconLink href={project.demoUrl} ariaLabel="Live Demo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </IconLink>
                )}
              </div>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            
            <p className="text-muted mb-8 leading-relaxed text-sm flex-1">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-auto">
              {project.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Projects;