import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const inputClasses = "w-full p-2 rounded-lg bg-[#e1e1e1] dark:bg-[#363636] text-[#161616] dark:text-[#a2a2a2] outline-none border border-light-cont-s dark:border-dark-cont-s focus:ring-2 focus:ring-[#447A90] dark:focus:ring-[#62ACCC] transition-colors";
  const buttonClasses = "w-full px-4 py-2 bg-[#447A90] hover:bg-[#62ACCC] text-white rounded-lg border-0 outline-none focus:ring-2 focus:ring-[#447A90] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium";
  const errorClasses = "text-red-500 text-sm mt-1";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dash'); 
    } catch (err: any) {
      console.error("Firebase Login Error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
         setError('Invalid email or password.');
      } else if (err.code === 'auth/invalid-email') {
         setError('Please enter a valid email address.');
      } else {
         setError('Failed to log in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-light-cont-l dark:bg-dark-cont-l p-4">
      <div className="w-full max-w-md bg-light-cont-m dark:bg-dark-cont-m p-8 rounded-lg shadow-md border border-light-cont-s dark:border-dark-cont-s">
        <h2 className="text-2xl font-bold text-center text-light-text-prim dark:text-dark-text-prim mb-6">
          Login to Lambda Lens
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-light-text-sec dark:text-dark-text-sec mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClasses}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-light-text-sec dark:text-dark-text-sec mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputClasses}
              placeholder="••••••••"
            />
          </div>
          {error && <p className={errorClasses}>{error}</p>}
          <button type="submit" className={buttonClasses} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-light-text-sec dark:text-dark-text-sec">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-[#447A90] hover:text-[#62ACCC] dark:text-[#62ACCC] dark:hover:text-[#82cceb]">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;