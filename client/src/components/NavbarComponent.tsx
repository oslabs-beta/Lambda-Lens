import { Link } from 'react-router-dom';

const NavbarComponent = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to='/'>Dashboard</Link>
        </li>
        <li>
          <Link to='/cloudwatchmetrics'>Cloudwatch Metrics</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavbarComponent;