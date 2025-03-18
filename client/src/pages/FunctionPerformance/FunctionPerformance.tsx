import { useState, useEffect } from "react";
import ColdStartsGraphComponent from "./ColdStart/ColdStart";
import ColdStartsMetricsContainer from "./ColdStartMetrics/ColdStartMetrics";
import AvgBilledDurGraph from "./AverageBilledDuration/AverageBilledDuration";
import ChatContainer from "./Chat/Chat";
import "../../styles/Graphs.css";

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Function Performance</h1>
        <button
          className={`w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors ${
            isClicked ? "bg-blue-500 text-white border-blue-500" : ""
          }`}
          onClick={handleRefresh}
          aria-label="Refresh"
        >
          &#x21bb;
        </button>
      </div>
      <div className="grid grid-cols-2 gap-5 auto-rows-fr">
        <div className="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
          <AvgBilledDurGraph data={sortedData} />
        </div>
        <div className="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
          <ColdStartsMetricsContainer data={sortedData} />
        </div>
        <div className="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
          <ColdStartsGraphComponent data={sortedData} />
        </div>
        <div className="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Bedrock Analysis</h2>
          <div className="h-[calc(100%-2rem)]">
            <ChatContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContainer;
