import { Link } from 'react-router-dom';
import lambda from '../../../assets/lambda.png'; 

const Navbar = () => {
  return (
    <nav className="p-4 flex justify-between items-center">
      <img src={lambda} alt="Lambda Lens Logo" className="h-10 dark:invert dark:brightness-0" />
      <Link
        to="/config"
        className="px-6 py-2 bg-element-s hover:bg-element-h text-white rounded-lg transition-colors font-medium"
      >
        Get Started
      </Link>
    </nav>
  );
};

export default Navbar;