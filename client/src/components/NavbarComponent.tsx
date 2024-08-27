import { Link } from 'react-router-dom';
import '../NavbarComponent.css'
import logo from '../logo.png'

// const NavbarComponent = () => {
//   return (
//     <nav className='navbar'>
//       <ul id='navbarLinks'>
//         {/* <li id='dashboard'><Link to='/'>Dashboard</Link></li>
//         <li id='cloudwatch'><Link to='/cloudwatchmetrics'>Cloudwatch Metrics</Link></li> */}
//         <li><a href='/'>Dashboard</a></li>
//         <li><a href='/cloudwatchmetrics'>Cloudwatch Metrics</a></li>
//         <li><a href="/configuration">Configuration</a></li>
//       </ul>
//     </nav>
//   );
// };


// Refactor of above code to take advantage of react router
const NavbarComponent = () => {
  return (
    <nav className='navbar'>
      <div className='logo-container'>
        <img src={logo} alt='Logo' className='logo' />
      </div>
      <ul id='navbarLinks'>
        <li>
          <Link to='/'>Dashboard</Link>
        </li>
        <li>
          <Link to='/cloudwatchmetrics'>Cloudwatch Metrics</Link>
        </li>
        <li>
          <Link to='/configuration'>Configuration</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavbarComponent;
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import '../NavbarComponent.css';
// import logo from '../logo.png';

// const NavbarComponent = () => {
//   const [darkMode, setDarkMode] = useState(false);

//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme === 'dark') {
//       setDarkMode(true);
//       document.body.classList.add('darkmode');
//     }
//   }, []);

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//     if (!darkMode) {
//       document.body.classList.add('darkmode');
//       localStorage.setItem('theme', 'dark');
//     } else {
//       document.body.classList.remove('darkmode');
//       localStorage.removeItem('theme');
//     }
//   };

//   return (
//     <nav className='navbar'>
//       <div className='logo-container'>
//         <img src={logo} alt='Logo' className='logo' />
//       </div>
//       <ul id='navbarLinks'>
//         <li>
//           <Link to='/'>Dashboard</Link>
//         </li>
//         <li>
//           <Link to='/cloudwatchmetrics'>Cloudwatch Metrics</Link>
//         </li>
//         <li>
//           <Link to='/configuration'>Configuration</Link>
//         </li>
//       </ul>
//       <div id='theme-switch' onClick={toggleDarkMode}>
//         {darkMode ? (
//           <svg /* Dark mode icon SVG */>
//             {/* SVG path data for dark mode */}
//           </svg>
//         ) : (
//           <svg /* Light mode icon SVG */>
//             {/* SVG path data for light mode */}
//           </svg>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default NavbarComponent;