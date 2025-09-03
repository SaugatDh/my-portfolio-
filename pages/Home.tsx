/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';

const Home = () => {
  return (
    <>
      <AnimatedSection id="about">
        <h2>About Me</h2>
        <p>
          Hello! I'm Saugat Dhungana, a versatile developer with a deep passion for
          creating innovative solutions across Web, AI/ML, and the Internet of Things.
          I thrive on turning complex problems into elegant, user-friendly applications.
          My journey in technology is driven by a relentless curiosity and a desire to build things that make a difference.
        </p>
        <p>
          I specialize in building responsive front-end experiences with React and modern JavaScript,
          but I'm equally comfortable diving into the world of machine learning models or tinkering with IoT hardware.
          I'm a lifelong learner, constantly exploring new tools and paradigms to push the boundaries of what's possible.
        </p>
        <p>
          <a
            href="./Saugat-Dhungana-cv.pdf"
            download
            className="button"
          >
            Download CV
          </a>
        </p>
      </AnimatedSection>

      <AnimatedSection className="skills-section">
        <h2>My Skillset</h2>
        <ul className="skill-grid">
          <li className="skill-category">
            <h3>Frontend Development</h3>
            <ul>
              <li>HTML5 & CSS3</li>
              <li>JavaScript (ES6+)</li>
              <li>React</li>
              <li>TypeScript</li>
              <li>Responsive Design</li>
            </ul>
          </li>
          <li className="skill-category">
            <h3>AI & Machine Learning</h3>
            <ul>
              <li>Python</li>
              <li>Data Science</li>
              <li>YOLOv8</li>
              <li>Natural Language Processing</li>
              <li>Computer Vision</li>
            </ul>
          </li>
          <li className="skill-category">
            <h3>IoT & Hardware</h3>
            <ul>
              <li>Arduino</li>
              <li>Embedded Systems</li>
              <li>Sensor Integration</li>
              <li>C++</li>
              <li>Prototyping</li>
            </ul>
          </li>
        </ul>
      </AnimatedSection>

      <AnimatedSection>
        <h2>Experience</h2>
        <ul className="experience-list">
          <li>
            <h3>Freelance Developer</h3>
            <p>Remote</p>
            <p><em>2021 - Present</em></p>
          </li>
          <li>
            <h3>On The Job Training</h3>
            <p>Shree Janata Secondary School, Gauradaha</p>
            <p><em>May 2020 - Nov 2020</em></p>
          </li>
        </ul>
      </AnimatedSection>

      <AnimatedSection>
        <h2>Recent Projects</h2>
        <ul className="project-list">
          <li>
            <img
              src="./placeholder-ecommerce.jpg"
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
            <p>E-commerce website with Laravel framework.</p>
            <p className="project-tech">Technologies: Laravel, PHP, MySQL</p>
          </li>
          <li>
            <img
              src="./placeholder-chatbot.jpg"
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
              Simple chatbot app using machine learning and NLP application.
            </p>
            <p className="project-tech">
              Technologies: Python, NLTK, Machine Learning
            </p>
          </li>
          <li>
            <img
              src="./placeholder-document.jpg"
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
              An AI-powered tool that uses a fine-tuned YOLOv8 model to detect
              layout components in documents.
            </p>
            <p className="project-tech">Technologies: Python, YOLOv8, AI</p>
          </li>
          <li>
            <img
              src="./placeholder-medical.jpg"
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
        </ul>
        <p>
          <Link to="/works" className="view-all-link">
            View all projects →
          </Link>
        </p>
      </AnimatedSection>

      <AnimatedSection className="cta-section">
        <h2>Ready to collaborate?</h2>
        <p>Let's build something amazing together.</p>
        <div className="cta-buttons">
          <Link to="/contact" className="button">
            Hire Me
          </Link>
          <Link to="/works" className="button">
            Explore My Work
          </Link>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <h2>Connect</h2>
        <ul className="connect-list">
          <li>
            <a
              href="mailto:saugatdhungana746@gmail.com"
              title="Email"
              aria-label="Email"
            >
              <i className="fas fa-envelope"></i>
            </a>
          </li>
          <li>
            <a
              href="https://github.com/SaugatDh"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              aria-label="GitHub"
            >
              <i className="fab fa-github"></i>
            </a>
          </li>
          <li>
            <a
              href="https://www.saugat-dhungana.com.np"
              target="_blank"
              rel="noopener noreferrer"
              title="Portfolio"
              aria-label="Portfolio"
            >
              <i className="fas fa-globe"></i>
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </li>
        </ul>
      </AnimatedSection>
    </>
  );
};

export default Home;
