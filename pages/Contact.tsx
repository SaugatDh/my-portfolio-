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
    <AnimatedSection>
      <h2>Get in Touch</h2>
      <p>
        I'm always interested in hearing about new opportunities and projects.
        Whether you have a question or just want to say hi, feel free to reach
        out. The best way to contact me is via email or the form below.
      </p>

      <form id="contact-form" className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows={5} required></textarea>
        </div>
        <button type="submit" className="button">
          Send Message
        </button>
        {status && (
          <div id="form-status" className="form-status" aria-live="polite">
            {status}
          </div>
        )}
      </form>

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
            href="https://www.linkedin.com/in/saugatdhungana/"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin"></i>
          </a>
        </li>
        <li>
          <a
            href="./files/Saugat-Dhungana-cv.pdf"
            download
            title="Download CV"
            aria-label="Download CV"
          >
            <i className="fas fa-download"></i>
          </a>
        </li>
      </ul>
    </AnimatedSection>
  );
};

export default Contact;
