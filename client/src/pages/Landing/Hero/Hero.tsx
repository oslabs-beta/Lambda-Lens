import { Link } from 'react-router-dom';

const Hero = () => {
  return (
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
  );
};

export default Hero;