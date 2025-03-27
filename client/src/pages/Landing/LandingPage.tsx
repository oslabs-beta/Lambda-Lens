import { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import lambda from '../../assets/lambda.png';

const LandingPage = () => {
  const [activePane, setActivePane] = useState(1);
  const rotationInterval = 5000; 

  const panes = [
    {
      id: 1,
      title: 'Connect Your AWS Account',
      description: 'Securely provide your AWS credentials and region. Lambda Lens uses this to access CloudWatch metrics and logs for your Lambda functions.',
      imagePlaceholder: 'bg-blue-200 dark:bg-blue-800',
    },
    {
      id: 2,
      title: 'Data Aggregation & Processing',
      description: 'Our backend fetches relevant metrics (like invocations, errors, duration) and log data (specifically looking for cold starts) directly from AWS CloudWatch.',
      imagePlaceholder: 'bg-green-200 dark:bg-green-800',
    },
    {
      id: 3,
      title: 'Intuitive Visualization',
      description: 'The processed data is presented in easy-to-understand charts and tables on your dashboard, highlighting key performance indicators like cold starts and billed duration.',
      imagePlaceholder: 'bg-purple-200 dark:bg-purple-800',
    },
  ];

  const currentPane = panes.find(pane => pane.id === activePane);

  // Effect for auto-rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePane((prevPane) => (prevPane % panes.length) + 1);
    }, rotationInterval);

    // Cleanup function to clear the interval
    return () => clearInterval(timer);
  }, [panes.length, rotationInterval]); 

  // Handler for clicking indicator dots
  const handleIndicatorClick = (paneId: number) => {
    setActivePane(paneId);
  };


  return (
    <div className="min-h-screen bg-light-cont-l dark:bg-dark-cont-l text-light-text-prim dark:text-dark-text-prim font-sans transition-colors">
      <nav className="p-4 flex justify-between items-center">
        <img src={lambda} alt="Lambda Lens Logo" className="h-10 dark:invert dark:brightness-0" />
        <Link
          to="/config" 
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
          to="/config" 
          className="px-8 py-3 bg-element-s hover:bg-element-h text-white rounded-lg transition-colors font-semibold text-lg"
        >
          Explore Dashboard
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-light-cont-m dark:bg-dark-cont-m px-4 transition-colors"> 
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-16">Key Features</h2> 
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto"> 
          {/* Feature 1 */}
          <div className="bg-light-cont-l dark:bg-dark-cont-l p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"> 
            <div className="text-element-h mb-4">
              <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-3">Performance Overview</h3>
            <p className="text-light-text-sec dark:text-dark-text-sec text-center">Visualize cold starts and average billed duration across all functions.</p>
          </div>
          {/* Feature 2 */}
          <div className="bg-light-cont-l dark:bg-dark-cont-l p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
             <div className="text-element-h mb-4">
               <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10l-2.5 2.5M14 14l2.5-2.5"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8l-4 4 4 4M17 8l4 4-4 4"></path></svg>
             </div>
            <h3 className="text-xl font-semibold text-center mb-3">Function Analytics</h3>
            <p className="text-light-text-sec dark:text-dark-text-sec text-center">Dive deep into individual function metrics like concurrency, throttles, and latency.</p>
          </div>
          {/* Feature 3 */}
          <div className="bg-light-cont-l dark:bg-dark-cont-l p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
             <div className="text-element-h mb-4">
               <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
             </div>
            <h3 className="text-xl font-semibold text-center mb-3">Easy Configuration</h3>
            <p className="text-light-text-sec dark:text-dark-text-sec text-center">Connect your AWS account and database quickly through a simple interface.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-16">How It Works</h2>
        <div className="max-w-5xl mx-auto">

          {/* Active Pane Content */}
          {currentPane && (
            <div className="grid md:grid-cols-2 gap-10 items-center bg-light-cont-l dark:bg-dark-cont-l p-8 rounded-lg shadow-lg mb-12"> {/* Added mb-12 */}
              {/* Text Content */}
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-element-h">{currentPane.title}</h3>
                <p className="text-light-text-sec dark:text-dark-text-sec leading-relaxed">{currentPane.description}</p>
              </div>
              {/* Image Placeholder */}
              <div className={`w-full h-64 rounded-lg flex items-center justify-center text-gray-500 ${currentPane.imagePlaceholder}`}>
                <span>Image Placeholder</span>
              </div>
            </div>
          )}

          {/* Pane Indicator Circles */}
          <div className="flex justify-center space-x-3"> 
            {panes.map((pane) => (
              <button
                key={pane.id}
                aria-label={`Go to step ${pane.id}`}
                onClick={() => handleIndicatorClick(pane.id)}
                className={`w-3 h-3 rounded-full transition-colors ${ 
                  activePane === pane.id
                    ? 'bg-element-s' 
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500' 
                }`}
              />
            ))}
          </div>

        </div>
      </section>

      <section className="text-center py-20 px-4">
        <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Lambdas?</h2>
        <p className="text-lg text-light-text-sec dark:text-dark-text-sec mb-8">
          Start monitoring your functions with Lambda Lens today.
        </p>
        <Link
          to="/config" 
          className="px-8 py-3 bg-element-s hover:bg-element-h text-white rounded-lg transition-colors font-semibold text-lg"
        >
          Configure Now
        </Link>
      </section>

      <footer className="text-center py-6 border-t border-light-cont-s dark:border-dark-cont-s text-light-text-sec dark:text-dark-text-sec transition-colors">
        © {new Date().getFullYear()} Lambda Lens. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;