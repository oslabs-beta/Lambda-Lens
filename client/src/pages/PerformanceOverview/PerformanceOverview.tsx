import { useState, useEffect } from "react";
import ColdStartsGraphComponent from "./ColdStart/ColdStart";
import ColdStartsMetricsContainer from "./ColdStartMetrics/ColdStartMetrics";
import AvgBilledDurGraph from "./AverageBilledDuration/AverageBilledDuration";
import ChatContainer from "./Chat/Chat";
import { useAuth } from "../../context/AuthContext"; 

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
          {error && ( 
            <div className="mt-2 text-sm text-[#dc3545] bg-light-cont-s dark:bg-dark-cont-s border border-[#f5c6cb] dark:border-[#472a2d] rounded-md px-3 py-2">
              Error: {error}
            </div>
          )}
        </div>
      </div>
      {/* Only render charts if data is loaded and valid */}
      {!error && data.length > 0 ? (
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
      ) : !error ? (
          <div className="text-center text-light-text-sec dark:text-dark-text-sec">Loading performance data...</div>
      ) : null }
    </div>
  );
};

export default DashboardContainer;
