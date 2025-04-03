import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import lambda from "../../assets/lambda.png";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

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

const NavbarComponent = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navLinkBaseClasses = "px-3 py-2 rounded-md transition-colors text-sm font-medium no-underline";
  const getNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `${navLinkBaseClasses} ${
      isActive
        ? 'bg-blue-600 text-white' 
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700' 
    }`;

  return (
    <nav className="flex items-center justify-between bg-white dark:bg-dark-cont-l font-sans px-4 py-5 border-b border-gray-200 dark:border-gray-700 transition-colors relative z-10">
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0">
          <NavLink to="/dash">
            <img src={lambda} alt="Logo" className="h-8 max-w-none transition-all duration-300 dark:invert dark:brightness-0" />
          </NavLink>
        </div>
        <ul className="flex items-center gap-1 list-none m-0 p-0"> 
          <li>
            <NavLink to="/dash" className={getNavLinkClasses}>
              Performance Overview
            </NavLink>
          </li>
          <li>
            <NavLink to="/cloudwatchmetrics" className={getNavLinkClasses}>
              Function Analytics
            </NavLink>
          </li>
          <li>
            <NavLink to="/config" className={getNavLinkClasses}>
              Configuration
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0"> 
        {currentUser ? (
          <>
            <span className="text-sm text-gray-600 dark:text-gray-400 hidden md:inline"> 
              {currentUser.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center h-8 px-3 bg-white dark:bg-dark-cont-s border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark-cont-m text-gray-700 dark:text-gray-300 rounded-md transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-1 dark:focus:ring-offset-dark-cont-l"
            >
              Logout
            </button>
          </>
        ) : (
           null
        )}
        <button
          id="theme-switch"
          aria-label="theme switch"
          onClick={toggleDarkMode}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-dark-cont-s border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark-cont-m transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-1 dark:focus:ring-offset-dark-cont-l"
        >
          {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
        </button>
      </div>
    </nav>
  );
};

export default NavbarComponent;
