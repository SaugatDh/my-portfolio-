/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import AnimatedSection from '../components/AnimatedSection';

const Works = () => {
  return (
    <AnimatedSection>
      <h2>My Works</h2>
      <p>
        A curated selection of my projects. Each one represents a challenge I
        was excited to solve and a story of growth.
      </p>

      <ul className="project-list">
        <li>
          <img
            src="./files/placeholder-ecommerce.jpg"
            alt="MeroShop E-commerce Platform"
            className="project-image"
            loading="lazy"
          />
          <h3>
            <a
              href="https://github.com/SaugatDh/MeroShop"
              target="_blank"
              rel="noopener noreferrer"
            >
              MeroShop E-commerce Platform
            </a>
          </h3>
          <p>
            A full-featured e-commerce platform built with the Laravel
            framework, demonstrating backend capabilities and database
            management.
          </p>
          <p className="project-tech">Technologies: Laravel, PHP, MySQL</p>
        </li>
        <li>
          <img
            src="./files/placeholder-document.jpg"
            alt="AI Document Parser"
            className="project-image"
            loading="lazy"
          />
          <h3>
            <a
              href="https://github.com/SaugatDh/document-parser"
              target="_blank"
              rel="noopener noreferrer"
            >
              AI Document Parser
            </a>
          </h3>
          <p>
            An AI-powered tool that uses a fine-tuned YOLOv8 model to detect and
            extract layout components from documents.
          </p>
          <p className="project-tech">Technologies: Python, YOLOv8, AI</p>
        </li>
        <li>
          <img
            src="./files/placeholder-medical.jpg"
            alt="Ausadhi AI: Medical Assistant"
            className="project-image"
            loading="lazy"
          />
          <h3>
            <a
              href="https://github.com/SaugatDh/Ausadhi-AI"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ausadhi AI: Medical Assistant
            </a>
          </h3>
          <p>An AI-powered project for medical applications.</p>
          <p className="project-tech">
            Technologies: AI, Machine Learning, Medical Data
          </p>
        </li>
        <li>
          <img
            src="./files/placeholder-chatbot.jpg"
            alt="NLP Chatbot"
            className="project-image"
            loading="lazy"
          />
          <h3>
            <a
              href="https://github.com/SaugatDh/chatbot"
              target="_blank"
              rel="noopener noreferrer"
            >
              NLP Chatbot
            </a>
          </h3>
          <p>
            A chatbot leveraging natural language processing to understand
            and respond to user queries.
          </p>
          <p className="project-tech">
            Technologies: Python, NLTK, Machine Learning
          </p>
        </li>
        <li>
          <img
            src="./files/placeholder-lms.jpg"
            alt="Learning Management System"
            className="project-image"
            loading="lazy"
          />
          <h3>
            <a
              href="https://github.com/SaugatDh/LMS"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learning Management System
            </a>
          </h3>
          <p>A comprehensive platform for online learning and course management.</p>
          <p className="project-tech">Technologies: React, Node.js, MongoDB</p>
        </li>
  
        <li>
          <img
            src="./files/placeholder-resume.jpg"
            alt="Resume Information Extractor"
            className="project-image"
            loading="lazy"
          />
          <h3>
            <a
              href="https://github.com/SaugatDh/Resume-Info-Extraction"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume Information Extractor
            </a>
          </h3>
          <p>An intelligent tool for parsing and extracting key information from resumes.</p>
          <p className="project-tech">Technologies: Python, NLP, AI</p>
        </li>
        <li>
          <img
            src="./files/placeholder-iot-farm.jpg"
            alt="Smart Farm IoT Solution"
            className="project-image"
            loading="lazy"
          />
          <h3>
            <a
              href="https://github.com/SaugatDh/smart-farm-"
              target="_blank"
              rel="noopener noreferrer"
            >
              Smart Farm IoT Solution
            </a>
          </h3>
          <p>An IoT-based system for monitoring and automating farm activities.</p>
          <p className="project-tech">Technologies: IoT, Arduino, Sensors</p>
        </li>
        <li>
          <img
            src="./files/placeholder-iot-home.jpg"
            alt="Smart Home Automation"
            className="project-image"
            loading="lazy"
          />
          <h3>
            <a
              href="https://github.com/SaugatDh/Smarthome"
              target="_blank"
              rel="noopener noreferrer"
            >
              Smart Home Automation
            </a>
          </h3>
          <p>A project to automate and control home appliances remotely.</p>
          <p className="project-tech">Technologies: IoT, Embedded Systems</p>
        </li>
      </ul>
    </AnimatedSection>
  );
};

export default Works;
