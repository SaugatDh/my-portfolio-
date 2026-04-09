import React from 'react';
import { EXPERIENCE, SKILLS } from '../constants';
import Section from './ui/Section';
import SectionHeading from './ui/SectionHeading';
import Tag from './ui/Tag';

const Experience: React.FC = () => {
  return (
    <Section id="experience">
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="flex-1">
          <SectionHeading number="02." title="Where I've Worked" />
          
          <div className="relative border-l border-border ml-3 space-y-12">
            {EXPERIENCE.map((job) => (
              <div key={job.id} className="relative pl-10 group">
                <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background transition-all duration-300 group-hover:scale-125"></span>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 className="text-xl font-bold text-foreground">{job.role} <span className="text-primary">@ {job.company}</span></h3>
                  <div className="flex flex-col sm:items-end">
                    <span className="font-mono text-sm text-muted">{job.period}</span>
                    {job.location && <span className="font-mono text-xs text-muted">{job.location}</span>}
                  </div>
                </div>
                
                <p className="text-muted mb-4 max-w-2xl leading-relaxed">
                  {job.description}
                </p>
                
                <div className="flex flex-wrap gap-3">
                  {job.technologies.map(tech => (
                    <Tag key={tech} variant="skill">
                      ▹{tech}
                    </Tag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-1/3">
          <h3 className="text-xl font-bold text-foreground mb-8 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            Tech Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map((skill, index) => (
              <Tag key={index} variant="skill">{skill}</Tag>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Experience;