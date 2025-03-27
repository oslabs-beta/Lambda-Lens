const Features = () => {
  const cardBaseClasses = "bg-light-cont-l dark:bg-dark-cont-l p-10 rounded-lg shadow-lg hover:shadow-xl border border-light-cont-s/50 dark:border-dark-cont-s/50 transition-all duration-300 hover:scale-[1.03]";

  return (
    <section id="features" className="py-24 bg-light-cont-m dark:bg-dark-cont-m px-4 transition-colors">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Key Features</h2>
      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {/* Feature 1 */}
        <div className={cardBaseClasses}>
          <div className="text-element-h mb-4">
            <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          </div>
          <h3 className="text-xl font-semibold text-center mb-3">Performance Overview</h3>
          <p className="text-light-text-sec dark:text-dark-text-sec text-center leading-relaxed">Visualize cold starts and average billed duration across all functions.</p>
        </div>
        {/* Feature 2 */}
        <div className={cardBaseClasses}>
           <div className="text-element-h mb-4">
             <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10l-2.5 2.5M14 14l2.5-2.5"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8l-4 4 4 4M17 8l4 4-4 4"></path></svg>
           </div>
          <h3 className="text-xl font-semibold text-center mb-3">Function Analytics</h3>
          <p className="text-light-text-sec dark:text-dark-text-sec text-center leading-relaxed">Dive deep into individual function metrics like concurrency, throttles, and latency.</p>
        </div>
        {/* Feature 3 */}
        <div className={cardBaseClasses}>
           <div className="text-element-h mb-4">
             <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
           </div>
          <h3 className="text-xl font-semibold text-center mb-3">Easy Configuration</h3>
          <p className="text-light-text-sec dark:text-dark-text-sec text-center leading-relaxed">Connect your AWS account and database quickly through a simple interface.</p>
        </div>
      </div>
    </section>
  );
};

export default Features;