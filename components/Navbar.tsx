import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    if (location.pathname === "/") {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-md border-b border-border py-3" : "bg-transparent py-6"}`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <button
          onClick={() => navigate("/")}
          className="font-mono text-xl font-bold tracking-tighter hover:text-muted transition-colors text-foreground cursor-pointer"
        >
          saugat<span className="text-primary">.dev</span>
        </button>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-muted">
            <button
              onClick={() => handleNavClick("hero")}
              className="hover:text-primary transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick("projects")}
              className="hover:text-primary transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => handleNavClick("experience")}
              className="hover:text-primary transition-colors"
            >
              Experience
            </button>
            <button
              onClick={() => handleNavClick("contact")}
              className="hover:text-primary transition-colors"
            >
              Contact
            </button>
            <button
              onClick={() => navigate("/blog")}
              className="hover:text-primary transition-colors border-b-2 border-primary pb-0.5"
            >
              Blogs
            </button>
            <div className="flex items-center gap-3">
              <a
                href="/cv.pdf"
                download
                className="flex items-center gap-2 px-4 py-2 border border-border rounded hover:border-primary hover:text-primary transition-all duration-300 font-mono text-xs"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                CV
              </a>
              <button
                onClick={() => handleNavClick("contact")}
                className="px-4 py-2 bg-foreground text-background rounded hover:bg-primary hover:text-foreground transition-all duration-300 font-mono text-xs"
              >
                Let's Talk
              </button>
            </div>
          </div>

          <ThemeToggle />

          {/* Mobile Menu Icon Placeholder */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => handleNavClick("contact")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
