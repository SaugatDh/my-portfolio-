import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ThemeToggle from './ThemeToggle';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col px-4 sm:px-6 py-8 sm:py-12">
      <ThemeToggle />
      <div className="w-full max-w-[95%] mx-auto flex-grow flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
