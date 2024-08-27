import { Link } from 'react-router-dom';

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
