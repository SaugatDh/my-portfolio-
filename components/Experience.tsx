import React, { useState, useEffect } from "react";
import { Experience as ExperienceType } from "../types";

interface TechStack {
  id: number;
  name: string;
}

const Experience: React.FC = () => {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/experience")
        .then((res) => res.json())
        .catch((err) => {
          console.error("Failed to fetch experience:", err);
          return [];
        }),
      fetch("/api/tech-stacks")
        .then((res) => res.json())
        .catch((err) => {
          console.error("Failed to fetch tech stacks:", err);
          return [];
        }),
    ]).then(([exps, stacks]) => {
      setExperiences(exps);
      setTechStacks(stacks);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section id="experience" className="py-24 bg-background relative z-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Timeline Skeleton */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-12">
                <span className="text-primary font-mono text-xl">02.</span>
                <h2 className="text-3xl font-bold text-foreground">
                  Where I've Worked
                </h2>
              </div>

              <div className="relative border-l border-border ml-3 space-y-12">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="relative pl-10 animate-pulse">
                    <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-border"></span>

                    <div className="mb-2">
                      <div className="h-6 bg-border rounded mb-2 w-3/4"></div>
                      <div className="h-4 bg-border rounded w-1/3"></div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="h-4 bg-border rounded w-full"></div>
                      <div className="h-4 bg-border rounded w-5/6"></div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <div className="h-3 bg-border rounded w-16"></div>
                      <div className="h-3 bg-border rounded w-20"></div>
                      <div className="h-3 bg-border rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Skeleton */}
            <div className="lg:w-1/3">
              <h3 className="text-xl font-bold text-foreground mb-8 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                  <polyline points="2 17 12 22 22 17"></polyline>
                  <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <div
                    key={index}
                    className="h-10 bg-border border border-border rounded animate-pulse w-24"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-24 bg-background relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Timeline */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-12">
              <span className="text-primary font-mono text-xl">02.</span>
              <h2 className="text-3xl font-bold text-foreground">
                Where I've Worked
              </h2>
            </div>

            <div className="relative border-l border-border ml-3 space-y-12">
              {experiences.map((job) => (
                <div key={job.id} className="relative pl-10 group">
                  <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background transition-all duration-300 group-hover:scale-125"></span>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h3 className="text-xl font-bold text-foreground">
                      {job.role}{" "}
                      <span className="text-primary">@ {job.company}</span>
                    </h3>
                    <span className="font-mono text-sm text-muted">
                      {job.period}
                    </span>
                  </div>

                  <p className="text-muted mb-4 max-w-2xl leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {job.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-mono text-muted before:content-['▹'] before:mr-1 before:text-primary"
                      >
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {techStacks.map((skill) => (
                <div
                  key={skill.id}
                  className="px-3 py-2 bg-surface border border-border rounded text-sm text-muted font-mono hover:border-primary hover:text-primary transition-colors cursor-default"
                >
                  {skill.name}
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
