/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import ThemeToggle from './ThemeToggle';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <ThemeToggle />
      <div className="content-wrapper">
        <Header />
        <Nav />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
