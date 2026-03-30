import React from 'react';
import { EXPERIENCE, SKILLS } from '../constants';

const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-24 bg-background relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Timeline */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-12">
              <span className="text-primary font-mono text-xl">02.</span>
              <h2 className="text-3xl font-bold text-foreground">Where I've Worked</h2>
            </div>
            
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
                      <span key={tech} className="text-xs font-mono text-muted before:content-['▹'] before:mr-1 before:text-primary">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="lg:w-1/3">
            <h3 className="text-xl font-bold text-foreground mb-8 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill, index) => (
                <div 
                  key={index}
                  className="px-3 py-2 bg-surface border border-border rounded text-sm text-muted font-mono hover:border-primary hover:text-primary transition-colors cursor-default"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Experience;