import React from 'react';
import { EDUCATION, AWARDS, CERTIFICATIONS } from '../constants';

const EducationSection: React.FC = () => {
  return (
    <section id="education" className="py-24 bg-background relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="flex items-center gap-4 mb-12">
          <span className="text-primary font-mono text-xl">03.</span>
          <h2 className="text-3xl font-bold text-foreground">Education & Certifications</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Education */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
              Education
            </h3>
            <div className="space-y-4">
              {EDUCATION.map((edu) => (
                <div key={edu.id} className="p-5 bg-surface border border-border rounded-sm hover:border-primary transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                    <h4 className="text-lg font-bold text-foreground">{edu.institution}</h4>
                    <span className="font-mono text-sm text-muted">{edu.period}</span>
                  </div>
                  <p className="text-primary font-medium">{edu.degree}</p>
                  <p className="text-muted text-sm">{edu.location}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Awards & Certifications */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
              Awards & Certifications
            </h3>
            <div className="space-y-3">
              {AWARDS.map((award) => (
                <div key={award.id} className="p-4 bg-surface border border-border rounded-sm hover:border-primary transition-colors">
                  <h4 className="text-foreground font-semibold">{award.title}</h4>
                  <p className="text-muted text-sm">{award.organization} • {award.year} • {award.location}</p>
                  {award.project && <p className="text-primary text-sm">Project: {award.project}</p>}
                </div>
              ))}
              {CERTIFICATIONS.map((cert) => (
                <div key={cert.id} className="p-4 bg-surface border border-border rounded-sm hover:border-primary transition-colors">
                  <h4 className="text-foreground font-semibold">{cert.title}</h4>
                  <p className="text-muted text-sm">{cert.organization} • {cert.year}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EducationSection;
