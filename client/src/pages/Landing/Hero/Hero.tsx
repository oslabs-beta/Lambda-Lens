import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    // Increased vertical padding
    <section className="text-center py-28 px-4">
      {/* Added gradient text classes */}
      <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-element-s to-element-h bg-clip-text text-transparent">
        Monitor Your AWS Lambda Functions Intuitively
      </h1>
      {/* Added leading-relaxed for better readability */}
      <p className="text-lg md:text-xl text-light-text-sec dark:text-dark-text-sec mb-8 max-w-2xl mx-auto leading-relaxed">
        Lambda Lens aggregates key performance metrics like Cold Starts, providing a clear view of your serverless performance.
      </p>
      <Link
        to="/config"
        className="px-8 py-3 bg-element-s hover:bg-element-h text-white rounded-lg transition-colors font-semibold text-lg"
      >
        Explore Dashboard
      </Link>
    </section>
  );
};

export default Hero;