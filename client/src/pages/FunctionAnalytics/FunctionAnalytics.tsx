import ConcurrExecComponent from "./ConcurrentExecutions/ConcurrentExecutions";
import ThrottleComponent from "./Throttle/Throttle";
import TotalDurationComponent from "./TotalDuration/TotalDuration";
import PercentileLatencyComponent from "./PercentileLatency/PercentileLatency";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; 

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


  useEffect(() => {
    const fetchCloudWatchMetrics = async () => {
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
    };

    fetchCloudWatchMetrics();
  }, [currentUser]); 

  useEffect(() => {
    const fetchPercentileMetrics = async () => {
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
    };

    fetchPercentileMetrics();
  }, [currentUser]); 


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

  const allFunctionNames = [
      ...functionData.map(d => d.functionName),
      ...Object.keys(percentileData)
  ];
  const uniqueFunctionNames = [...new Set(allFunctionNames)];


  return (
    <div className="p-6 bg-light-cont-l dark:bg-dark-cont-l transition-colors min-h-screen">
      <div className="border-b border-light-cont-s dark:border-dark-cont-s pb-5 mb-6">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-medium tracking-tight text-light-text-prim dark:text-dark-text-prim">
                Function Analytics
              </h1>
              <p className="mt-1 text-sm text-light-text-sec dark:text-dark-text-sec">
                Visualize execution, throttle, and latency data for individual Lambda functions.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Display Combined Errors */}
              {(errorCW || errorPercentiles) && (
                <div className="text-sm text-[#dc3545] bg-light-cont-s dark:bg-dark-cont-s border border-[#f5c6cb] dark:border-[#472a2d] rounded-md px-3 py-2 max-w-xs">
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
                  className="h-10 px-4 rounded-lg bg-light-cont-s dark:bg-dark-cont-s text-light-text-prim dark:text-dark-text-prim border-0 shadow-sm disabled:opacity-50"
                >
                  {/* Add a default placeholder option */}
                  {!selectedFunction && <option value="" disabled>Select a function</option>}
                  {uniqueFunctionNames.map((funcName) => (
                    <option key={funcName} value={funcName}>
                      {funcName}
                    </option>
                  ))}
                </select>
              ) : (loadingCW || loadingPercentiles) ? (
                 <div className="text-light-text-sec dark:text-dark-text-sec text-sm">Loading functions...</div>
              ) : (!errorCW && !errorPercentiles && !currentUser) ? (
                 <div className="text-light-text-sec dark:text-dark-text-sec text-sm">Please log in.</div>
              ) : (!errorCW && !errorPercentiles && uniqueFunctionNames.length === 0) ? (
                 <div className="text-light-text-sec dark:text-dark-text-sec text-sm">No functions found.</div>
              ) : null }
            </div>
          </div>
        </div>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-2 gap-5 auto-rows-fr">
        {selectedFunction && (loadingCW || loadingPercentiles) && (
             <div className="col-span-2 text-center text-light-text-sec dark:text-dark-text-sec">Loading data for {selectedFunction}...</div>
        )}

        {selectedFunction && !loadingCW && !errorCW && filteredData && (
          <>
            <div className="flex-1 bg-light-cont-m dark:bg-dark-cont-m border border-light-cont-s dark:border-dark-cont-s rounded-lg p-4 shadow-sm transition-colors">
              <ConcurrExecComponent data={filteredData} />
            </div>
            <div className="flex-1 bg-light-cont-m dark:bg-dark-cont-m border border-light-cont-s dark:border-dark-cont-s rounded-lg p-4 shadow-sm transition-colors">
              <ThrottleComponent data={filteredData} />
            </div>
            <div className="flex-1 bg-light-cont-m dark:bg-dark-cont-m border border-light-cont-s dark:border-dark-cont-s rounded-lg p-4 shadow-sm transition-colors">
              <TotalDurationComponent data={filteredData} />
            </div>
          </>
        )}
        {selectedFunction && !loadingPercentiles && !errorPercentiles && filteredPercentileData && (
          <div className="flex-1 bg-light-cont-m dark:bg-dark-cont-m border border-light-cont-s dark:border-dark-cont-s rounded-lg p-4 shadow-sm transition-colors">
            <PercentileLatencyComponent data={filteredPercentileData} />
          </div>
        )}

         {selectedFunction && !loadingCW && !errorCW && !filteredData && (
             <div className="col-span-2 text-center text-light-text-sec dark:text-dark-text-sec">No CloudWatch data found for {selectedFunction}.</div>
         )}
          {selectedFunction && !loadingPercentiles && !errorPercentiles && !filteredPercentileData && (
             <div className="col-span-2 text-center text-light-text-sec dark:text-dark-text-sec">No Percentile data found for {selectedFunction}.</div>
         )}

         {!selectedFunction && !loadingCW && !loadingPercentiles && !errorCW && !errorPercentiles && currentUser && uniqueFunctionNames.length > 0 && (
              <div className="col-span-2 text-center text-light-text-sec dark:text-dark-text-sec">Please select a function to view its analytics.</div>
         )}
      </div>
    </div>
  );
};

export default FunctionAnalyticsContainer;
