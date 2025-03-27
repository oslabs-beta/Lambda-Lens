import { useState } from 'react';

const faqData = [
  {
    question: 'How does Lambda Lens connect to my AWS account?',
    answer: 'Lambda Lens requires AWS credentials (Access Key ID and Secret Access Key) and your AWS region. These are securely passed to our backend during configuration and used solely to interact with the AWS CloudWatch API for fetching metrics and logs. We recommend using IAM credentials with the minimum required permissions.',
  },
  {
    question: 'Is it secure to provide my AWS credentials?',
    answer: 'Security is our priority. Your credentials are sent directly to our backend over HTTPS and are used only for API calls to AWS. They are not stored client-side. For enhanced security, consider creating dedicated IAM credentials with limited permissions specifically for Lambda Lens.',
  },
  {
    question: 'What AWS permissions does Lambda Lens need?',
    answer: 'Lambda Lens primarily needs read-only access to CloudWatch Logs (DescribeLogStreams, GetLogEvents) and CloudWatch Metrics (GetMetricData, ListMetrics) for your Lambda functions. It also needs permission to list Lambda functions (ListFunctions).',
  },
  {
    question: 'Where is the monitoring data stored?',
    answer: 'Processed metrics and log insights (like cold start occurrences) are stored in a MongoDB database that you provide the connection URI for during configuration. Raw log data is not persistently stored by Lambda Lens itself.',
  },
  {
    question: 'Is Lambda Lens free?',
    answer: 'Yes, Lambda Lens is currently offered as an open-source project under the MIT License. You can use it freely.',
  },
  {
    question: 'How long does the setup process take?',
    answer: 'Setup is designed to be quick. Once you have your AWS credentials and MongoDB URI ready, configuring Lambda Lens through the UI typically takes less than a minute.',
  },
];

const FAQItem = ({ item, isOpen, onClick }: { item: typeof faqData[0], isOpen: boolean, onClick: () => void }) => {
  return (
    <div className="border-b border-light-cont-s/50 dark:border-dark-cont-s/50 last:border-b-0"> 
      <button
        className="flex justify-between items-center w-full py-5 px-6 text-left text-lg font-medium hover:bg-light-cont-m/50 dark:hover:bg-dark-cont-m/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-element-s" // Added focus styles
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className={`${isOpen ? 'text-element-h dark:text-element-h' : 'text-light-text-prim dark:text-dark-text-prim'} transition-colors`}>
          {item.question}
        </span>
        <span className="text-element-s dark:text-element-h flex-shrink-0 ml-4">
          <svg className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /> 
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /> 
            )}
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ease-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="px-6 pb-5 pt-1 text-light-text-sec dark:text-dark-text-sec leading-relaxed"> 
          {item.answer}
        </p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleItemClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-light-cont-m dark:bg-dark-cont-m px-4 transition-colors">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Frequently Asked Questions</h2>
        <div className="bg-light-cont-l dark:bg-dark-cont-l rounded-lg shadow-lg overflow-hidden border border-light-cont-s/50 dark:border-dark-cont-s/50">
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onClick={() => handleItemClick(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;