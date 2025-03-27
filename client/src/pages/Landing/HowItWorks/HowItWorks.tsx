import { useState, useEffect } from 'react';

const panes = [
  {
    id: 1,
    title: '1. Connect Your AWS Account',
    description: 'Securely provide your AWS credentials and region. Lambda Lens uses this to access CloudWatch metrics and logs for your Lambda functions.',
    imagePlaceholder: 'bg-blue-200 dark:bg-blue-800',
  },
  {
    id: 2,
    title: '2. Data Aggregation & Processing',
    description: 'Our backend fetches relevant metrics (like invocations, errors, duration) and log data (specifically looking for cold starts) directly from AWS CloudWatch.',
    imagePlaceholder: 'bg-green-200 dark:bg-green-800',
  },
  {
    id: 3,
    title: '3. Intuitive Visualization',
    description: 'The processed data is presented in easy-to-understand charts and tables on your dashboard, highlighting key performance indicators like cold starts and billed duration.',
    imagePlaceholder: 'bg-purple-200 dark:bg-purple-800',
  },
];

const HowItWorks = () => {
  const [activePane, setActivePane] = useState(1);
  const rotationInterval = 5000;
  const currentPane = panes.find(pane => pane.id === activePane);

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePane((prevPane) => (prevPane % panes.length) + 1);
    }, rotationInterval);
    return () => clearInterval(timer);
  }, [panes.length, rotationInterval]);

  const handleIndicatorClick = (paneId: number) => {
    setActivePane(paneId);
  };

  return (
    <section className="py-24 px-4">
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-16">How It Works</h2>
      <div className="max-w-5xl mx-auto">
        {/* Active Pane Content */}
        {currentPane && (
          <div className="grid md:grid-cols-2 gap-10 items-center bg-light-cont-l dark:bg-dark-cont-l p-8 rounded-lg shadow-lg mb-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-element-h">{currentPane.title}</h3>
              <p className="text-light-text-sec dark:text-dark-text-sec leading-relaxed">{currentPane.description}</p>
            </div>
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
  );
};

export default HowItWorks;