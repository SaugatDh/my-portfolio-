/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import AnimatedSection from '../components/AnimatedSection';

const Works = () => {
  return (
    <AnimatedSection className="max-w-[95%] mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium mb-6">My Works</h2>
        <p className="text-base sm:text-lg text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
          A curated selection of my projects. Each one represents a challenge I
          was excited to solve and a story of growth.
        </p>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {[
          {
            title: "MeroShop E-commerce Platform",
            img: "./placeholder-ecommerce.jpg",
            link: "https://github.com/SaugatDh/MeroShop",
            desc: "A full-featured e-commerce platform built with the Laravel framework, demonstrating backend capabilities and database management.",
            tech: "Laravel, PHP, MySQL"
          },
          {
            title: "AI Document Parser",
            img: "./placeholder-document.jpg",
            link: "https://github.com/SaugatDh/document-parser",
            desc: "An AI-powered tool that uses a fine-tuned YOLOv8 model to detect and extract layout components from documents.",
            tech: "Python, YOLOv8, AI"
          },
          {
            title: "Ausadhi AI: Medical Assistant",
            img: "./placeholder-medical.jpg",
            link: "https://github.com/SaugatDh/Ausadhi-AI",
            desc: "An AI-powered project for medical applications.",
            tech: "AI, Machine Learning, Medical Data"
          },
          {
            title: "NLP Chatbot",
            img: "./placeholder-chatbot.jpg",
            link: "https://github.com/SaugatDh/chatbot",
            desc: "A chatbot leveraging natural language processing to understand and respond to user queries.",
            tech: "Python, NLTK, Machine Learning"
          },
          {
            title: "Learning Management System",
            img: "./placeholder-lms.jpg",
            link: "https://github.com/SaugatDh/LMS",
            desc: "A comprehensive platform for online learning and course management.",
            tech: "React, Node.js, MongoDB"
          },
          {
            title: "Resume Information Extractor",
            img: "./placeholder-resume.jpg",
            link: "https://github.com/SaugatDh/Resume-Info-Extraction",
            desc: "An intelligent tool for parsing and extracting key information from resumes.",
            tech: "Python, NLP, AI"
          },
          {
            title: "Smart Farm IoT Solution",
            img: "./placeholder-iot-farm.jpg",
            link: "https://github.com/SaugatDh/smart-farm-",
            desc: "An IoT-based system for monitoring and automating farm activities.",
            tech: "IoT, Arduino, Sensors"
          },
          {
            title: "Smart Home Automation",
            img: "./placeholder-iot-home.jpg",
            link: "https://github.com/SaugatDh/Smarthome",
            desc: "A project to automate and control home appliances remotely.",
            tech: "IoT, Embedded Systems"
          }
        ].map((project, index) => (
          <li key={index} className="group flex flex-col">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-lg mb-5 bg-[var(--bg-secondary)]"
            >
              <img
                src={project.img}
                alt={project.title}
                className="w-full h-64 object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                loading="lazy"
              />
            </a>
            <h3 className="text-lg sm:text-xl font-medium mb-3">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--text-secondary)] transition-colors"
              >
                {project.title}
              </a>
            </h3>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] mb-4 flex-grow leading-relaxed">
              {project.desc}
            </p>
            <p className="text-sm text-[var(--text-tertiary)] font-medium">
              {project.tech}
            </p>
          </li>
        ))}
      </ul>
    </AnimatedSection>
  );
};

export default Works;
