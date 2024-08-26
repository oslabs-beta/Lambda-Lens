import { Link } from 'react-router-dom';

const NavbarComponent = () => {
  return (
    <nav className='navbar'>
      <ul id='navbarLinks'>
        {/* <li id='dashboard'><Link to='/'>Dashboard</Link></li>
        <li id='cloudwatch'><Link to='/cloudwatchmetrics'>Cloudwatch Metrics</Link></li> */}
        <li><a href='/'>Dashboard</a></li>
        <li><a href='/cloudwatchmetrics'>Cloudwatch Metrics</a></li>
      </ul>
    </nav>
  );
};

export default NavbarComponent;


// <nav id={id} className='navbar'> 
// <div>
//   <div id={'navbarLinks'}> 
//     <Link to='/'>Dashboard</Link>
//     <Link to='/cloudwatchmetrics'>Cloudwatch Metrics</Link>
//   </div>
// </div>
// </nav>