import ConcurrExecComponent from "./ConcurrentExecutions/ConcurrentExecutions";
import ThrottleComponent from "./Throttle/Throttle";
import TotalDurationComponent from "./TotalDuration/TotalDuration";
import PercentileLatencyComponent from "./PercentileLatency/PercentileLatency";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { RefreshIcon, DownloadIcon, FilterIcon } from "../../components/icons";

interface FunctionData {
  functionName: string;
  duration: number[];
  concurrentExecutions: number[];
  throttles: number[];
  timestamps: string[];
}

interface PercentileData {
  p90: number[];
  p95: number[];
  p99: number[];
}

const FunctionAnalyticsContainer = () => {
  const { currentUser } = useAuth();
  const [functionData, setFunctionData] = useState<FunctionData[]>([]);
  const [selectedFunction, setSelectedFunction] = useState<string>("");
  const [filteredData, setFilteredData] = useState<FunctionData | null>(null);
  const [percentileData, setPercentileData] = useState<{
    [key: string]: { percentiles: PercentileData };
  }>({});
  const [filteredPercentileData, setFilteredPercentileData] =
    useState<PercentileData | null>(null);

  const [errorCW, setErrorCW] = useState<string | null>(null);
  const [errorPercentiles, setErrorPercentiles] = useState<string | null>(null);
  const [loadingCW, setLoadingCW] = useState<boolean>(false);
  const [loadingPercentiles, setLoadingPercentiles] = useState<boolean>(false);
  const [isClicked, setClicked] = useState(false);

  const fetchCloudWatchMetrics = useCallback(async () => {
    if (!currentUser) {
      setErrorCW("Please log in to fetch CloudWatch metrics.");
      setFunctionData([]);
      return;
    }
    setLoadingCW(true);
    setErrorCW(null);
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/data/cloud`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        let errorMsg = `Failed to fetch CloudWatch metrics: ${response.status} ${response.statusText}`;
        try {
            const errorData = await response.json();
            errorMsg = errorData.message?.err || errorData.err || errorMsg;
        } catch (parseError) { /* Ignore */ }
        throw new Error(errorMsg);
      }
      const data: FunctionData[] = await response.json();
      setFunctionData(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length > 0 && !selectedFunction) {
        setSelectedFunction(data[0].functionName);
      }
    } catch (err) {
      console.error("CloudWatch metrics error:", err);
      setErrorCW(err instanceof Error ? err.message : "Failed to fetch CloudWatch metrics");
      setFunctionData([]);
    } finally {
      setLoadingCW(false);
    }
  }, [currentUser, selectedFunction]);

  const fetchPercentileMetrics = useCallback(async () => {
    if (!currentUser) {
      setErrorPercentiles("Please log in to fetch percentile metrics.");
      setPercentileData({});
      return;
    }
    setLoadingPercentiles(true);
    setErrorPercentiles(null);
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/data/metrics`, {
         headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        let errorMsg = `Failed to fetch percentile metrics: ${response.status} ${response.statusText}`;
        try {
            const errorData = await response.json();
            errorMsg = errorData.message?.err || errorData.err || errorMsg;
        } catch (parseError) { /* Ignore */ }
        throw new Error(errorMsg);
      }
      const data = await response.json();
      setPercentileData(typeof data === 'object' && data !== null ? data : {});
    } catch (err) {
      console.error("Percentile metrics error:", err);
      setErrorPercentiles(err instanceof Error ? err.message : "Failed to fetch percentile metrics");
      setPercentileData({});
    } finally {
      setLoadingPercentiles(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchCloudWatchMetrics();
    fetchPercentileMetrics();
  }, [fetchCloudWatchMetrics, fetchPercentileMetrics]);

  useEffect(() => {
    if (selectedFunction && functionData.length > 0) {
      const selected = functionData.find(
        (func) => func.functionName === selectedFunction
      );
      setFilteredData(selected || null);
    } else {
      setFilteredData(null);
    }

    if (selectedFunction && Object.keys(percentileData).length > 0) {
       const selectedPercentile = percentileData[selectedFunction]?.percentiles;
       setFilteredPercentileData(selectedPercentile || null);
    } else {
        setFilteredPercentileData(null);
    }
  }, [selectedFunction, functionData, percentileData]);

  const handleFunctionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFunction(e.target.value);
  };

  const handleRefresh = () => {
    setClicked(true);
    fetchCloudWatchMetrics();
    fetchPercentileMetrics();
    setTimeout(() => setClicked(false), 1000);
  };

  const allFunctionNames = [
      ...functionData.map(d => d.functionName),
      ...Object.keys(percentileData)
  ];
  const uniqueFunctionNames = [...new Set(allFunctionNames)];

  return (
    <div className="p-6 bg-light-cont-l dark:bg-dark-cont-l transition-colors min-h-screen">
      {/* Adjust header layout */}
      <div className="pb-4 mb-6 flex justify-between items-end"> {/* Change items-start to items-end */}
        {/* Title and Subtitle */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-dark-text-prim">
            Function Analytics
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-dark-text-sec">
            Visualize execution, throttle, and latency data for individual Lambda functions.
          </p>
        </div>

        {/* Controls Group */}
        <div className="flex items-center gap-3"> {/* Group controls */}
          {/* Error Message */}
          {(errorCW || errorPercentiles) && (
            <div className="text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700/50 rounded-md px-3 py-2 max-w-xs">
              {errorCW && <div>CloudWatch Error: {errorCW}</div>}
              {errorPercentiles && <div>Percentiles Error: {errorPercentiles}</div>}
            </div>
          )}

          {/* Function Selector */}
          {!loadingCW && !loadingPercentiles && uniqueFunctionNames.length > 0 ? (
            <select
              value={selectedFunction}
              onChange={handleFunctionChange}
              disabled={!currentUser}
              className="h-9 px-4 rounded-md bg-white dark:bg-dark-cont-s border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 shadow-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-1 dark:focus:ring-offset-dark-bg text-sm"
            >
              {!selectedFunction && <option value="" disabled>Select a function</option>}
              {uniqueFunctionNames.map((funcName) => (
                <option key={funcName} value={funcName}>
                  {funcName}
                </option>
              ))}
            </select>
          ) : (loadingCW || loadingPercentiles) ? (
             <div className="text-sm text-gray-500 dark:text-dark-text-sec h-9 flex items-center px-4">Loading functions...</div>
          ) : (!errorCW && !errorPercentiles && !currentUser) ? (
             <div className="text-sm text-gray-500 dark:text-dark-text-sec h-9 flex items-center px-4">Please log in.</div>
          ) : (!errorCW && !errorPercentiles && uniqueFunctionNames.length === 0) ? (
             <div className="text-sm text-gray-500 dark:text-dark-text-sec h-9 flex items-center px-4">No functions found.</div>
          ) : null }

          {/* Action Buttons */}
          <button
            className="flex items-center justify-center h-9 px-4 bg-white dark:bg-dark-cont-s border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark-cont-m text-gray-700 dark:text-gray-300 rounded-md transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-1 dark:focus:ring-offset-dark-bg"
            disabled={!currentUser || (!loadingCW && !loadingPercentiles && uniqueFunctionNames.length === 0)}
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
            disabled={!currentUser || (!loadingCW && !loadingPercentiles && uniqueFunctionNames.length === 0)}
          >
            <DownloadIcon />
            Export Data
          </button>
        </div>
      </div>

      {/* Charts Area - No changes needed here */}
      <div className="grid grid-cols-2 gap-6 auto-rows-fr">
        {selectedFunction && (loadingCW || loadingPercentiles) && (
             <div className="col-span-2 text-center text-gray-500 dark:text-dark-text-sec py-10">Loading data for {selectedFunction}...</div>
        )}

        {selectedFunction && !loadingCW && !errorCW && filteredData && (
          <>
            <div className="bg-white dark:bg-dark-cont-l rounded-lg p-5 border border-gray-200 dark:border-gray-700 transition-colors">
              <ConcurrExecComponent data={filteredData} />
            </div>
            <div className="bg-white dark:bg-dark-cont-l rounded-lg p-5 border border-gray-200 dark:border-gray-700 transition-colors">
              <ThrottleComponent data={filteredData} />
            </div>
            <div className="bg-white dark:bg-dark-cont-l rounded-lg p-5 border border-gray-200 dark:border-gray-700 transition-colors">
              <TotalDurationComponent data={filteredData} />
            </div>
          </>
        )}
        {selectedFunction && !loadingPercentiles && !errorPercentiles && filteredPercentileData && (
          <div className="bg-white dark:bg-dark-cont-l rounded-lg p-5 border border-gray-200 dark:border-gray-700 transition-colors">
            <PercentileLatencyComponent data={filteredPercentileData} />
          </div>
        )}

         {selectedFunction && !loadingCW && !errorCW && !filteredData && (
             <div className="col-span-2 text-center text-gray-500 dark:text-dark-text-sec py-10">No CloudWatch data found for {selectedFunction}.</div>
         )}
          {selectedFunction && !loadingPercentiles && !errorPercentiles && !filteredPercentileData && (
             <div className="col-span-2 text-center text-gray-500 dark:text-dark-text-sec py-10">No Percentile data found for {selectedFunction}.</div>
         )}

         {!selectedFunction && !loadingCW && !loadingPercentiles && !errorCW && !errorPercentiles && currentUser && uniqueFunctionNames.length > 0 && (
              <div className="col-span-2 text-center text-gray-500 dark:text-dark-text-sec py-10">Please select a function to view its analytics.</div>
         )}
         {!currentUser && !errorCW && !errorPercentiles && (
              <div className="col-span-2 text-center text-gray-500 dark:text-dark-text-sec py-10">Please log in to view function analytics.</div>
         )}
         {currentUser && uniqueFunctionNames.length === 0 && !loadingCW && !loadingPercentiles && !errorCW && !errorPercentiles && (
              <div className="col-span-2 text-center text-gray-500 dark:text-dark-text-sec py-10">No functions found for this account.</div>
         )}
      </div>
    </div>
  );
};

export default FunctionAnalyticsContainer;
