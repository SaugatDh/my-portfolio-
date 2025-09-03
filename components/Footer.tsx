/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useLocation } from 'react-router-dom';

const quotes: { [key: string]: { text: string; author: string } } = {
  '/': {
    text: 'The best way to predict the future is to create it.',
    author: 'Peter Drucker',
  },
  '/works': {
    text: 'Creativity is intelligence having fun.',
    author: 'Albert Einstein',
  },
  '/blog': {
    text: 'The journey of a thousand miles begins with a single step.',
    author: 'Lao Tzu',
  },
  '/contact': {
    text: 'Stay curious. Stay foolish.',
    author: 'Steve Jobs',
  },
};

const Footer = () => {
  const location = useLocation();
  const quote = quotes[location.pathname] || quotes['/'];

  return (
    <footer>
      <p className="quote">"{quote.text}"</p>
      <p className="quote-author">- {quote.author}</p>
    </footer>
  );
};

export default Footer;
