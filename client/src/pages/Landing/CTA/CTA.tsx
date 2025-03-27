import { Link } from 'react-router-dom';

const CTA = () => {
  return (
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
  );
};

export default CTA;