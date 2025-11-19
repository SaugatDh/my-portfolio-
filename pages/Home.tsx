/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';

const Home = () => {
  return (
    <>
      <AnimatedSection id="about" className="mb-24 text-center max-w-4xl mx-auto">
        <h2 className="text-5xl font-medium mb-8">About Me</h2>
        <p className="mb-8 text-xl leading-relaxed text-[var(--text-secondary)]">
          Hello! I'm Saugat Dhungana, a versatile developer with a deep passion for
          creating innovative solutions across Web, AI/ML, and the Internet of Things.
          I thrive on turning complex problems into elegant, user-friendly applications.
          My journey in technology is driven by a relentless curiosity and a desire to build things that make a difference.
        </p>
        <p className="mb-10 text-xl leading-relaxed text-[var(--text-secondary)]">
          I specialize in building responsive front-end experiences with React and modern JavaScript,
          but I'm equally comfortable diving into the world of machine learning models or tinkering with IoT hardware.
          I'm a lifelong learner, constantly exploring new tools and paradigms to push the boundaries of what's possible.
        </p>
        <p>
          <a
            href="./Saugat-Dhungana-cv.pdf"
            download
            className="inline-block px-8 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-full text-base font-medium border border-[var(--text-primary)] hover:bg-transparent hover:text-[var(--text-primary)] transition-all"
          >
            Download CV
          </a>
        </p>
      </AnimatedSection>

      <AnimatedSection className="mb-24 text-center max-w-6xl mx-auto">
        <h2 className="text-4xl font-medium mb-12">My Skillset</h2>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto">
          <li className="bg-[var(--bg-secondary)] rounded-2xl p-10 text-center hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold uppercase tracking-wider mb-6 text-[var(--text-primary)]">Frontend Development</h3>
            <ul className="space-y-3 text-lg text-[var(--text-secondary)]">
              <li>HTML5 & CSS3</li>
              <li>JavaScript (ES6+)</li>
              <li>React</li>
              <li>TypeScript</li>
              <li>Responsive Design</li>
            </ul>
          </li>
          <li className="bg-[var(--bg-secondary)] rounded-2xl p-10 text-center hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold uppercase tracking-wider mb-6 text-[var(--text-primary)]">AI & Machine Learning</h3>
            <ul className="space-y-3 text-lg text-[var(--text-secondary)]">
              <li>Python</li>
              <li>Data Science</li>
              <li>YOLOv8</li>
              <li>Natural Language Processing</li>
              <li>Computer Vision</li>
            </ul>
          </li>
          <li className="bg-[var(--bg-secondary)] rounded-2xl p-10 text-center hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold uppercase tracking-wider mb-6 text-[var(--text-primary)]">IoT & Hardware</h3>
            <ul className="space-y-3 text-lg text-[var(--text-secondary)]">
              <li>Arduino</li>
              <li>Embedded Systems</li>
              <li>Sensor Integration</li>
              <li>C++</li>
              <li>Prototyping</li>
            </ul>
          </li>
        </ul>
      </AnimatedSection>

      <AnimatedSection className="mb-24 text-center">
        <h2 className="text-4xl font-medium mb-12">Experience</h2>
        <div className="space-y-6 max-w-4xl mx-auto text-left">
          <div className="group flex flex-col md:flex-row gap-4 md:gap-10 p-8 rounded-2xl hover:bg-[var(--bg-secondary)] transition-colors duration-300">
            <div className="md:w-1/4 flex-shrink-0">
              <span className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wider">2021 — Present</span>
            </div>
            <div className="md:w-3/4">
              <h3 className="text-2xl font-medium text-[var(--text-primary)] mb-2">Freelance Developer</h3>
              <p className="text-base text-[var(--text-secondary)] mb-4">Remote</p>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                Collaborating with clients globally to deliver tailored web solutions.
                Specializing in building responsive front-end interfaces with React and integrating
                robust back-end systems.
              </p>
            </div>
          </div>

          <div className="group flex flex-col md:flex-row gap-4 md:gap-10 p-8 rounded-2xl hover:bg-[var(--bg-secondary)] transition-colors duration-300">
            <div className="md:w-1/4 flex-shrink-0">
              <span className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wider">May — Nov 2020</span>
            </div>
            <div className="md:w-3/4">
              <h3 className="text-2xl font-medium text-[var(--text-primary)] mb-2">On The Job Training</h3>
              <p className="text-base text-[var(--text-secondary)] mb-4">Shree Janata Secondary School, Gauradaha</p>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                Assisted in IT infrastructure management and provided technical support.
                Gained hands-on experience in network troubleshooting and system administration
                within an educational environment.
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mb-24 max-w-6xl mx-auto">
        <h2 className="text-4xl font-medium mb-12 text-center">Recent Projects</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <li className="group">
            <img
              src="./placeholder-ecommerce.jpg"
              alt="MeroShop E-commerce Platform"
              className="w-full h-64 object-cover rounded-lg mb-4 bg-[var(--bg-secondary)] opacity-90 group-hover:opacity-100 transition-opacity"
              loading="lazy"
            />
            <h3 className="text-xl font-medium mb-2">
              <a
                href="https://github.com/SaugatDh/MeroShop"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                MeroShop E-commerce Platform
              </a>
            </h3>
            <p className="text-[var(--text-secondary)] text-base mb-2">E-commerce website with Laravel framework.</p>
            <p className="text-sm text-[var(--text-tertiary)]">Technologies: Laravel, PHP, MySQL</p>
          </li>
          <li className="group">
            <img
              src="./placeholder-chatbot.jpg"
              alt="NLP Chatbot"
              className="w-full h-64 object-cover rounded-lg mb-4 bg-[var(--bg-secondary)] opacity-90 group-hover:opacity-100 transition-opacity"
              loading="lazy"
            />
            <h3 className="text-xl font-medium mb-2">
              <a
                href="https://github.com/SaugatDh/chatbot"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                NLP Chatbot
              </a>
            </h3>
            <p className="text-[var(--text-secondary)] text-base mb-2">
              Simple chatbot app using machine learning and NLP application.
            </p>
            <p className="text-sm text-[var(--text-tertiary)]">
              Technologies: Python, NLTK, Machine Learning
            </p>
          </li>
          <li className="group">
            <img
              src="./placeholder-document.jpg"
              alt="AI Document Parser"
              className="w-full h-64 object-cover rounded-lg mb-4 bg-[var(--bg-secondary)] opacity-90 group-hover:opacity-100 transition-opacity"
              loading="lazy"
            />
            <h3 className="text-xl font-medium mb-2">
              <a
                href="https://github.com/SaugatDh/document-parser"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                AI Document Parser
              </a>
            </h3>
            <p className="text-[var(--text-secondary)] text-base mb-2">
              An AI-powered tool that uses a fine-tuned YOLOv8 model to detect
              layout components in documents.
            </p>
            <p className="text-sm text-[var(--text-tertiary)]">Technologies: Python, YOLOv8, AI</p>
          </li>
          <li className="group">
            <img
              src="./placeholder-medical.jpg"
              alt="Ausadhi AI: Medical Assistant"
              className="w-full h-64 object-cover rounded-lg mb-4 bg-[var(--bg-secondary)] opacity-90 group-hover:opacity-100 transition-opacity"
              loading="lazy"
            />
            <h3 className="text-xl font-medium mb-2">
              <a
                href="https://github.com/SaugatDh/Ausadhi-AI"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                Ausadhi AI: Medical Assistant
              </a>
            </h3>
            <p className="text-[var(--text-secondary)] text-base mb-2">An AI-powered project for medical applications.</p>
            <p className="text-sm text-[var(--text-tertiary)]">
              Technologies: AI, Machine Learning, Medical Data
            </p>
          </li>
        </ul>
        <p className="text-center mt-10">
          <Link to="/works" className="text-base font-medium border-b border-[var(--border-light)] hover:text-[var(--text-primary)] transition-colors">
            View all projects →
          </Link>
        </p>
      </AnimatedSection>

      <AnimatedSection className="mb-24 text-center">
        <h2 className="text-4xl font-medium mb-4">Ready to collaborate?</h2>
        <p className="text-[var(--text-secondary)] text-xl mb-8">Let's build something amazing together.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/contact" className="inline-block px-6 py-2 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-full text-base font-medium border border-[var(--text-primary)] hover:bg-transparent hover:text-[var(--text-primary)] transition-all">
            Hire Me
          </Link>
          <Link to="/works" className="inline-block px-6 py-2 bg-transparent text-[var(--text-primary)] rounded-full text-base font-medium border border-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all">
            Explore My Work
          </Link>
        </div>
      </AnimatedSection>

      <AnimatedSection className="text-center">
        <h2 className="text-3xl font-medium mb-8">Connect</h2>
        <ul className="flex justify-center gap-8">
          <li>
            <a
              href="mailto:saugatdhungana746@gmail.com"
              title="Email"
              aria-label="Email"
              className="text-3xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
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
              className="text-3xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
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
              className="text-3xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
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
              className="text-3xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
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
