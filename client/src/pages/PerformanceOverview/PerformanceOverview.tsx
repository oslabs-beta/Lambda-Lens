import { useState, useEffect } from "react";
import ColdStartsGraphComponent from "./ColdStart/ColdStart";
import ColdStartsMetricsContainer from "./ColdStartMetrics/ColdStartMetrics";
import AvgBilledDurGraph from "./AverageBilledDuration/AverageBilledDuration";
import ChatContainer from "./Chat/Chat";

interface FunctionData {
  functionName: string;
  avgBilledDur: number;
  numColdStarts: number;
  percentColdStarts: number;
}

const DashboardContainer = () => {
  const [data, setData] = useState<FunctionData[]>([]);
  const [isClicked, setClicked] = useState(false);

  const fetchData = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/data/req`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setClicked(true);
    fetchData();
    setTimeout(() => setClicked(false), 1000);
  };

  const sortedData = data
    .sort((a, b) => b.percentColdStarts - a.percentColdStarts)
    .slice(0, 5);

  return (
    <div className="p-6 bg-light-cont-l dark:bg-dark-cont-l transition-colors">
      <div className="border-b border-light-cont-s dark:border-dark-cont-s pb-5 mb-6">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-medium tracking-tight text-light-text-prim dark:text-dark-text-prim">
                Performance Overview
              </h1>
              <p className="mt-1 text-sm text-light-text-sec dark:text-dark-text-sec">
                Monitor cold starts and billed duration, across all your Lambda functions.
              </p>
            </div>
            <button
              className={`flex items-center justify-center w-10 h-10 rounded-lg bg-light-cont-s dark:bg-dark-cont-s hover:bg-light-cont-m dark:hover:bg-dark-cont-m text-light-text-prim dark:text-dark-text-sec focus:outline-none focus:ring-2 focus:ring-element-s dark:focus:ring-element-h shadow-sm transition-all ${
                isClicked ? "bg-element-s dark:bg-element-s hover:bg-element-s dark:hover:bg-element-s text-white dark:text-white transform scale-95" : ""
              }`}
              onClick={handleRefresh}
              aria-label="Refresh data"
            >
              <span className="text-xl leading-none select-none">↻</span>
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5 auto-rows-fr">
        <div className="flex-1 bg-light-cont-m dark:bg-dark-cont-m border border-light-cont-s dark:border-dark-cont-s rounded-lg p-4 shadow-sm transition-colors">
          <AvgBilledDurGraph data={sortedData} />
        </div>
        <div className="flex-1 bg-light-cont-m dark:bg-dark-cont-m border border-light-cont-s dark:border-dark-cont-s rounded-lg p-4 shadow-sm transition-colors">
          <ColdStartsMetricsContainer data={sortedData} />
        </div>
        <div className="flex-1 bg-light-cont-m dark:bg-dark-cont-m border border-light-cont-s dark:border-dark-cont-s rounded-lg p-4 shadow-sm transition-colors">
          <ColdStartsGraphComponent data={sortedData} />
        </div>
        <div className="flex-1 bg-light-cont-m dark:bg-dark-cont-m border border-light-cont-s dark:border-dark-cont-s rounded-lg p-4 shadow-sm transition-colors">
          <ChatContainer />
        </div>
      </div>
    </div>
  );
};

export default DashboardContainer;
