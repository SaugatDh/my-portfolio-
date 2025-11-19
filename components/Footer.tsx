/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
const Footer = () => {
  return (
    <footer className="mt-24 pt-8 border-t border-[var(--border-light)] text-center">
      <blockquote className="mb-4">
        <p className="font-heading italic text-lg text-[var(--text-secondary)] mb-2">
          "The only way to do great work is to love what you do."
        </p>
        <footer className="text-sm text-[var(--text-tertiary)]">— Steve Jobs</footer>
      </blockquote>
      <p className="text-xs text-[var(--text-tertiary)] mt-8">
        &copy; {new Date().getFullYear()} Saugat Dhungana. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
