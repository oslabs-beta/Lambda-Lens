import { Link } from 'react-router-dom';
import lambda from '../../../assets/lambda.png';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Style for the navigation links
  const navLinkClasses = "text-sm font-medium text-light-text-sec dark:text-dark-text-sec hover:text-element-h dark:hover:text-element-h transition-colors";

  return (
    <nav
      className={`sticky top-0 z-20 border-b border-light-cont-s/50 dark:border-dark-cont-s/50 transition-colors duration-300 ${
        isScrolled
          ? 'bg-light-cont-l/80 dark:bg-dark-cont-l/80 backdrop-blur-md'
          : 'bg-light-cont-l dark:bg-dark-cont-l'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
        <Link to="/">
          <img
            src={lambda}
            alt="Lambda Lens Logo"
            className="h-10 dark:invert dark:brightness-0 transition-opacity duration-200 hover:opacity-80"
          />
        </Link>

        {/* Added Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#features" className={navLinkClasses}>Features</a>
          <a href="#how-it-works" className={navLinkClasses}>How It Works</a>
          <a href="#faq" className={navLinkClasses}>FAQ</a>
        </div>

        <Link
          to="/config"
          className="px-6 py-2 bg-element-s hover:bg-element-h text-white rounded-lg transition-all duration-200 font-medium hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-element-h focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-cont-l"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;