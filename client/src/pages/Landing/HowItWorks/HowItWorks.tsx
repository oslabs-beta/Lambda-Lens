import { useState, useEffect } from 'react';

const panes = [
  {
    id: 1,
    title: 'Connect Your AWS Account',
    description: 'Securely provide your AWS credentials and region. Lambda Lens uses this to access CloudWatch metrics and logs for your Lambda functions.',
    imageSrc: '/connect.png',
  },
  {
    id: 2,
    title: 'Data Aggregation & Processing',
    description: 'Our backend fetches relevant metrics (like invocations, errors, duration) and log data (specifically looking for cold starts) directly from AWS CloudWatch.',
    imageSrc: '/aggregate.png', 
  },
  {
    id: 3,
    title: 'Intuitive Visualization',
    description: 'The processed data is presented in easy-to-understand charts and tables on your dashboard, highlighting key performance indicators like cold starts and billed duration.',
    imageSrc: '/visualization.png', 
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
    <section id="how-it-works" className="py-24 px-4">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">How It Works</h2>
      <div className="max-w-5xl mx-auto">
        {currentPane && (
          <div className="grid md:grid-cols-2 gap-10 items-center bg-light-cont-l dark:bg-dark-cont-l p-10 rounded-lg shadow-lg mb-12 border border-light-cont-s/50 dark:border-dark-cont-s/50 transition-all duration-300 hover:scale-[1.03]">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-element-h">{currentPane.title}</h3>
              <p className="text-light-text-sec dark:text-dark-text-sec leading-relaxed">{currentPane.description}</p>
            </div>
            <div className="w-full h-64 rounded-lg flex items-center justify-center overflow-hidden">
                <img src={currentPane.imageSrc} alt={currentPane.title} className='w-full h-full object-contain'/>
            </div>
          </div>
        )}
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