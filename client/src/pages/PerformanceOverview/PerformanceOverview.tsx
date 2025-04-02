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

const FilterIcon = () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>;
const ExportIcon = () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const RefreshIcon = () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m-15.357-2a8.001 8.001 0 0115.357-2m0 0H15" /></svg>;

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
    <div className="p-6 bg-white dark:bg-dark-bg transition-colors min-h-screen">
      {/* Target: No bottom border here, adjust spacing */}
      <div className="pb-4 mb-6">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center"> {/* Target: Align items center */}
            <div>
              {/* Target: Larger heading */}
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-dark-text-prim">
                Performance Overview
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-dark-text-sec">
                Monitor cold starts and billed duration across all your Lambda functions.
              </p>
            </div>
            {/* Target: Add Export Data button */}
            <button
              className="flex items-center justify-center h-9 px-4 bg-white dark:bg-dark-cont-s border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark-cont-m text-gray-700 dark:text-gray-300 rounded-md transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-1 dark:focus:ring-offset-dark-bg"
              // onClick={handleExport} // Add export handler
            >
              <ExportIcon />
              Export Data
            </button>
          </div>
          {/* Target: Add Filter and Refresh buttons below */}
          <div className="flex gap-2 mt-4">
             <button
              className="flex items-center justify-center h-9 px-4 bg-white dark:bg-dark-cont-s border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark-cont-m text-gray-700 dark:text-gray-300 rounded-md transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-1 dark:focus:ring-offset-dark-bg"
              // onClick={handleFilter} // Add filter handler
            >
              <FilterIcon />
              Filter
            </button>
             <button
              // Target: Updated refresh button style
              className={`flex items-center justify-center h-9 px-4 bg-white dark:bg-dark-cont-s border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark-cont-m text-gray-700 dark:text-gray-300 rounded-md transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-1 dark:focus:ring-offset-dark-bg ${
                isClicked ? "ring-2 ring-blue-500 dark:ring-blue-400" : "" // Simplified click feedback
              }`}
              onClick={handleRefresh}
              aria-label="Refresh data"
            >
              <RefreshIcon />
              Refresh
            </button>
          </div>
          {error && (
            // Target: Consistent error styling
            <div className="mt-4 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700/50 rounded-md px-3 py-2">
              Error: {error}
            </div>
          )}
        </div>
      </div>
      {/* Only render charts if data is loaded and valid */}
      {!error && data.length > 0 ? (
          // Target: Adjusted gap
          <div className="grid grid-cols-2 gap-6 auto-rows-fr"> {/* Target: Increased gap */}
            {/* Target: White background, border, no shadow */}
            <div className="flex-1 bg-white dark:bg-dark-cont-l rounded-lg p-5 border border-gray-200 dark:border-gray-700 transition-colors">
              <AvgBilledDurGraph data={sortedData} />
            </div>
            {/* Target: White background, border, no shadow */}
            <div className="flex-1 bg-white dark:bg-dark-cont-l rounded-lg p-5 border border-gray-200 dark:border-gray-700 transition-colors">
              <ColdStartsMetricsContainer data={sortedData} />
            </div>
            {/* Target: White background, border, no shadow */}
            <div className="flex-1 bg-white dark:bg-dark-cont-l rounded-lg p-5 border border-gray-200 dark:border-gray-700 transition-colors">
              <ColdStartsGraphComponent data={sortedData} />
            </div>
            {/* Target: White background, border, no shadow */}
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
