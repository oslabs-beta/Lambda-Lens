import React from 'react';
import { Link } from 'react-router-dom';
import lambda from '../../assets/lambda.png'; // Assuming you might want the logo

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-light-cont-l dark:bg-dark-cont-l text-light-text-prim dark:text-dark-text-prim font-sans transition-colors">
      {/* Optional: Simple Navbar for Landing Page */}
      <nav className="p-4 flex justify-between items-center">
        <img src={lambda} alt="Lambda Lens Logo" className="h-10 dark:invert dark:brightness-0" />
        <Link
          to="/config" // Changed from /dash to /config
          className="px-6 py-2 bg-element-s hover:bg-element-h text-white rounded-lg transition-colors font-medium"
        >
          Get Started
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Monitor Your AWS Lambda Functions Intuitively
        </h1>
        <p className="text-lg md:text-xl text-light-text-sec dark:text-dark-text-sec mb-8 max-w-2xl mx-auto">
          Lambda Lens aggregates key performance metrics like Cold Starts, providing a clear view of your serverless performance.
        </p>
        <Link
          to="/config" // Changed from /dash to /config
          className="px-8 py-3 bg-element-s hover:bg-element-h text-white rounded-lg transition-colors font-semibold text-lg"
        >
          Explore Dashboard
        </Link>
        {/* Optional: Add an image or graphic here */}
      </section>

      {/* Features Section Placeholder */}
      <section className="py-16 bg-light-cont-m dark:bg-dark-cont-m px-4 transition-colors">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-light-cont-l dark:bg-dark-cont-l p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Performance Overview</h3>
            <p className="text-light-text-sec dark:text-dark-text-sec">Visualize cold starts and average billed duration across all functions.</p>
          </div>
          {/* Feature 2 */}
          <div className="bg-light-cont-l dark:bg-dark-cont-l p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Function Analytics</h3>
            <p className="text-light-text-sec dark:text-dark-text-sec">Dive deep into individual function metrics like concurrency, throttles, and latency.</p>
          </div>
          {/* Feature 3 */}
          <div className="bg-light-cont-l dark:bg-dark-cont-l p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Easy Configuration</h3>
            <p className="text-light-text-sec dark:text-dark-text-sec">Connect your AWS account and database quickly through a simple interface.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section Placeholder */}
      <section className="text-center py-20 px-4">
        <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Lambdas?</h2>
        <p className="text-lg text-light-text-sec dark:text-dark-text-sec mb-8">
          Start monitoring your functions with Lambda Lens today.
        </p>
        <Link
          to="/config" // Changed from /dash to /config
          className="px-8 py-3 bg-element-s hover:bg-element-h text-white rounded-lg transition-colors font-semibold text-lg"
        >
          Configure Now
        </Link>
      </section>

      {/* Footer Placeholder */}
      <footer className="text-center py-6 border-t border-light-cont-s dark:border-dark-cont-s text-light-text-sec dark:text-dark-text-sec transition-colors">
        © {new Date().getFullYear()} Lambda Lens. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;