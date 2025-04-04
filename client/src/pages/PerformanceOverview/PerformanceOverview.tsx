import { useState, useEffect } from "react";
import ColdStartsGraphComponent from "./ColdStart/ColdStart";
import ColdStartsMetricsContainer from "./ColdStartMetrics/ColdStartMetrics";
import AvgBilledDurGraph from "./AverageBilledDuration/AverageBilledDuration";
import ChatContainer from "./Chat/Chat";
import { useAuth } from "../../context/AuthContext";
import { RefreshIcon, DownloadIcon, FilterIcon } from "../../components/icons";

interface FunctionData {
  functionName: string;
  avgBilledDur: number;
  numColdStarts: number;
  percentColdStarts: number;
}

const DashboardContainer = () => {
  const { currentUser } = useAuth(); 
  const [data, setData] = useState<FunctionData[]>([]);
  const [isClicked, setClicked] = useState(false);
  const [error, setError] = useState<string | null>(null); 

  const fetchData = async () => { 
    if (!currentUser) {
        setError("Please log in to view performance data.");
        setData([]); 
        return;
    }
    setError(null); 

    try {
      const token = await currentUser.getIdToken(); 
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/data/req`, {
          headers: { 
              'Authorization': `Bearer ${token}` 
          }
      });

      if (!response.ok) {
          let errorMsg = `Failed to fetch data: ${response.status} ${response.statusText}`;
          try {
              const errorData = await response.json();
              errorMsg = errorData.message?.err || errorData.err || errorMsg;
          } catch (parseError) {
          }
          throw new Error(errorMsg);
      }

      const resultData = await response.json();
      if (Array.isArray(resultData)) {
          setData(resultData);
      } else {
          console.error("API did not return an array:", resultData);
          setData([]); 
          throw new Error("Received invalid data format from server.");
      }

    } catch (err) {
        console.error("Fetch data error:", err); 
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setData([]); 
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]); 

  const handleRefresh = () => {
    setClicked(true);
    fetchData(); 
    setTimeout(() => setClicked(false), 1000);
  };

  const sortedData = Array.isArray(data)
    ? [...data] 
        .sort((a, b) => b.percentColdStarts - a.percentColdStarts)
        .slice(0, 5)
    : [];

  return (
    <div className="p-6 transition-colors min-h-screen">
      <div className="pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-dark-text-prim">
            Performance Overview
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-dark-text-sec">
            Monitor cold starts and billed duration across all your Lambda functions.
          </p>
        </div>

        <div className="flex items-center gap-3"> 
          {error && (
            <div className="text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700/50 rounded-md px-3 py-2 max-w-xs">
              Error: {error}
            </div>
          )}
          <button
            className="flex items-center justify-center h-9 px-4 bg-white dark:bg-dark-cont-s border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark-cont-m text-gray-700 dark:text-gray-300 rounded-md transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-1 dark:focus:ring-offset-dark-bg"
            disabled={!currentUser || data.length === 0} 
          >
            <FilterIcon />
            Filter
          </button>
          <button
            className={`flex items-center justify-center h-9 px-4 bg-white dark:bg-dark-cont-s border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark-cont-m text-gray-700 dark:text-gray-300 rounded-md transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-1 dark:focus:ring-offset-dark-bg ${
              isClicked ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""
            }`}
            onClick={handleRefresh}
            aria-label="Refresh data"
            disabled={!currentUser} 
          >
            <RefreshIcon />
            Refresh
          </button>
          <button
            className="flex items-center justify-center h-9 px-4 bg-white dark:bg-dark-cont-s border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark-cont-m text-gray-700 dark:text-gray-300 rounded-md transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-1 dark:focus:ring-offset-dark-bg"
            disabled={!currentUser || data.length === 0} 
          >
            <DownloadIcon />
            Export Data
          </button>
        </div>
      </div>

      {!error && data.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 auto-rows-fr">
            <div className="flex-1 bg-white dark:bg-dark-cont-l rounded-lg p-5 border border-gray-200 dark:border-gray-700 transition-colors">
              <AvgBilledDurGraph data={sortedData} />
            </div>
            <div className="flex-1 bg-white dark:bg-dark-cont-l rounded-lg p-5 border border-gray-200 dark:border-gray-700 transition-colors">
              <ColdStartsMetricsContainer data={sortedData} />
            </div>
            <div className="flex-1 bg-white dark:bg-dark-cont-l rounded-lg p-5 border border-gray-200 dark:border-gray-700 transition-colors">
              <ColdStartsGraphComponent data={sortedData} />
            </div>
            <div className="flex-1 bg-white dark:bg-dark-cont-l rounded-lg p-5 border border-gray-200 dark:border-gray-700 transition-colors">
              <ChatContainer />
            </div>
          </div>
      ) : !error ? (
          <div className="text-center text-gray-500 dark:text-dark-text-sec py-10">Loading performance data...</div>
      ) : null }
    </div>
  );
};

export default DashboardContainer;
