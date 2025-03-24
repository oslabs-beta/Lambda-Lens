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
    <div className="p-6 bg-[#ffffff] dark:bg-[#1e1e1e] transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#161616] dark:text-white">Function Performance</h1>
        <button
          className={`flex items-center justify-center w-10 h-10 rounded-lg bg-[#f3f3f3] dark:bg-[#363636] hover:bg-[#e1e1e1] dark:hover:bg-[#404040] text-[#161616] dark:text-[#a2a2a2] focus:outline-none focus:ring-2 focus:ring-[#447A90] dark:focus:ring-[#62ACCC] shadow-sm transition-all ${
            isClicked ? "bg-[#447A90] dark:bg-[#447A90] hover:bg-[#447A90] dark:hover:bg-[#447A90] text-white dark:text-white transform scale-95" : ""
          }`}
          onClick={handleRefresh}
          aria-label="Refresh data"
        >
          <span className="text-xl leading-none select-none">↻</span>
        </button>
      </div>
      <div className="grid grid-cols-2 gap-5 auto-rows-fr">
        <div className="flex-1 bg-[#f3f3f3] dark:bg-[#363636] border border-[#e1e1e1] dark:border-[#404040] rounded-lg p-4 shadow-sm transition-colors">
          <AvgBilledDurGraph data={sortedData} />
        </div>
        <div className="flex-1 bg-[#f3f3f3] dark:bg-[#363636] border border-[#e1e1e1] dark:border-[#404040] rounded-lg p-4 shadow-sm transition-colors">
          <ColdStartsMetricsContainer data={sortedData} />
        </div>
        <div className="flex-1 bg-[#f3f3f3] dark:bg-[#363636] border border-[#e1e1e1] dark:border-[#404040] rounded-lg p-4 shadow-sm transition-colors">
          <ColdStartsGraphComponent data={sortedData} />
        </div>
        <div className="flex-1 bg-[#f3f3f3] dark:bg-[#363636] border border-[#e1e1e1] dark:border-[#404040] rounded-lg p-4 shadow-sm transition-colors">
          <ChatContainer />
        </div>
      </div>
    </div>
  );
};

export default DashboardContainer;
