import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import lambda from "../../assets/lambda.png";

const LightModeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill="currentColor"
    className="text-light-text-sec dark:text-dark-text-sec"
  >
    <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Z" />
  </svg>
);

const DarkModeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill="currentColor"
    className="text-light-text-sec dark:text-dark-text-sec"
  >
    <path d="M480-280q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Z" />
  </svg>
);

const NavbarComponent: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Initialize from localStorage and system preference
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  useEffect(() => {
    // Apply dark mode class to html element for Tailwind
    if (darkMode) {
      document.documentElement.classList.add("dark");
      // Keep body.darkmode for backwards compatibility during migration
      document.body.classList.add("darkmode");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("darkmode");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      if (newMode) {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.removeItem("theme");
      }
      return newMode;
    });
  };

  return (
    <nav className="flex items-center justify-between rounded-lg bg-light-cont-m dark:bg-dark-cont-m font-sans shadow-mui-2 px-5 py-2.5 transition-colors relative z-10">
      {/* Logo container with better sizing */}
      <div className="flex-none">
        <img src={lambda} alt="Logo" className="h-11 max-w-none transition-all duration-300 dark:invert dark:brightness-0" />
      </div>
      
      {/* Navigation section with flex-grow to take available space */}
      <div className="flex-grow flex justify-end">
        <ul className="flex items-center gap-5 list-none m-0 p-0">
          <li>
            <Link to="/dash" className="text-light-text-sec dark:text-dark-text-sec hover:text-light-text-prim dark:hover:text-dark-text-prim px-4 py-2.5 rounded-md transition-colors text-sm font-light no-underline">Function Performance</Link>
          </li>
          <li>
            <Link to="/cloudwatchmetrics" className="text-light-text-sec dark:text-dark-text-sec hover:text-light-text-prim dark:hover:text-dark-text-prim px-4 py-2.5 rounded-md transition-colors text-sm font-light no-underline">CloudWatch Metrics</Link>
          </li>
          <li>
            <Link to="/" className="text-light-text-sec dark:text-dark-text-sec hover:text-light-text-prim dark:hover:text-dark-text-prim px-4 py-2.5 rounded-md transition-colors text-sm font-light no-underline">Configuration</Link>
          </li>
        </ul>
      </div>
      
      {/* Fixed-width container for theme toggle */}
      <div className="w-8 flex-none ml-5">
        <button
          id="theme-switch"
          aria-label="theme switch"
          onClick={toggleDarkMode}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-light-cont-s dark:bg-dark-cont-s hover:bg-light-cont-m dark:hover:bg-dark-cont-m transition-colors"
        >
          {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
        </button>
      </div>
    </nav>
  );
};

export default NavbarComponent;
