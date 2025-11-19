/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useState, FormEvent } from 'react';
import AnimatedSection from '../components/AnimatedSection';

const Contact = () => {
  const [status, setStatus] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    // In a real application, you would use a service like EmailJS,
    // Formspree, or a custom backend to handle the form submission.
    // For this example, we'll simulate a successful submission.

    setStatus('Thank you for your message! I will get back to you soon.');
    form.reset();
    setTimeout(() => setStatus(''), 5000);
  };

  return (
    <AnimatedSection className="max-w-3xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-medium mb-6">Get in Touch</h2>
        <p className="text-[var(--text-secondary)] text-xl leading-relaxed">
          I'm always interested in hearing about new opportunities and projects.
          Whether you have a question or just want to say hi, feel free to reach
          out.
        </p>
      </div>

      <form id="contact-form" className="space-y-8 mb-20" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3">
          <label htmlFor="name" className="text-base font-medium text-[var(--text-primary)]">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-5 py-4 bg-transparent border border-[var(--border-light)] rounded-lg focus:outline-none focus:border-[var(--text-primary)] transition-colors text-lg"
          />
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="email" className="text-base font-medium text-[var(--text-primary)]">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-5 py-4 bg-transparent border border-[var(--border-light)] rounded-lg focus:outline-none focus:border-[var(--text-primary)] transition-colors text-lg"
          />
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="message" className="text-base font-medium text-[var(--text-primary)]">Message</label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            className="w-full px-5 py-4 bg-transparent border border-[var(--border-light)] rounded-lg focus:outline-none focus:border-[var(--text-primary)] transition-colors resize-y min-h-[150px] text-lg"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-10 py-4 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-lg font-medium text-lg hover:opacity-90 transition-opacity"
        >
          Send Message
        </button>
        {status && (
          <div id="form-status" className="text-center text-green-600 dark:text-green-400 font-medium mt-6 text-lg" aria-live="polite">
            {status}
          </div>
        )}
      </form>

      <div className="text-center">
        <h3 className="text-xl font-medium mb-8">Or connect with me on</h3>
        <ul className="flex justify-center gap-10">
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
              href="https://www.linkedin.com/in/saugatdhungana/"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              aria-label="LinkedIn"
              className="text-3xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <i className="fab fa-linkedin"></i>
            </a>
          </li>
          <li>
            <a
              href="./Saugat-Dhungana-cv.pdf"
              download
              title="Download CV"
              aria-label="Download CV"
              className="text-3xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <i className="fas fa-download"></i>
            </a>
          </li>
        </ul>
      </div>
    </AnimatedSection>
  );
};

export default Contact;
