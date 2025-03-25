import ConcurrExecComponent from "./ConcurrentExecutions/ConcurrentExecutions";
import ThrottleComponent from "./Throttle/Throttle";
import TotalDurationComponent from "./TotalDuration/TotalDuration";
import PercentileLatencyComponent from "./PercentileLatency/PercentileLatency";
import { useState, useEffect } from "react";

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

const CloudwatchContainer = () => {
  const [functionData, setFunctionData] = useState<FunctionData[]>([]);
  const [selectedFunction, setSelectedFunction] = useState<string>("");
  const [filteredData, setFilteredData] = useState<FunctionData | null>(null);
  const [percentileData, setPercentileData] = useState<{
    [key: string]: { percentiles: PercentileData };
  }>({});
  const [filteredPercentileData, setFilteredPercentileData] =
    useState<PercentileData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/data/cloud`)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.err || "Failed to fetch CloudWatch metrics");
          });
        }
        return res.json();
      })
      .then((data: FunctionData[]) => {
        setFunctionData(Array.isArray(data) ? data : []);
        if (data && data.length > 0) {
          setSelectedFunction(data[0].functionName);
        }
        setError(null);
      })
      .catch((err) => {
        console.error("CloudWatch metrics error:", err);
        setError(err.message);
        setFunctionData([]);
      });
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/data/metrics`)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.err || "Failed to fetch percentile metrics");
          });
        }
        return res.json();
      })
      .then((data: { [key: string]: { percentiles: PercentileData } }) => {
        setPercentileData(data || {});
        setError(null);
      })
      .catch((err) => {
        console.error("Percentile metrics error:", err);
        setError(err.message);
        setPercentileData({});
      });
  }, []);

  useEffect(() => {
    if (selectedFunction && functionData.length > 0) {
      const selected = functionData.find(
        (func) => func.functionName === selectedFunction
      );
      setFilteredData(selected || null);

      const selectedPercentile = percentileData[selectedFunction]?.percentiles;
      setFilteredPercentileData(selectedPercentile || null);
    }
  }, [selectedFunction, functionData, percentileData]);

  return (
    <div className="p-6 bg-light-cont-l dark:bg-dark-cont-l transition-colors">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-4xl font-normal text-light-text-prim dark:text-dark-text-prim">CloudWatch Metrics</h1>
        {error && (
          <div className="text-sm text-[#dc3545] bg-[#f8d7da] dark:bg-[#2f1c1e] border border-[#f5c6cb] dark:border-[#472a2d] rounded-md px-3 py-2">
            {error}
          </div>
        )}
        {functionData.length > 0 ? (
          <select
            value={selectedFunction}
            onChange={(e) => setSelectedFunction(e.target.value)}
            className="rounded-lg px-2 py-2 bg-light-cont-s dark:bg-dark-cont-s text-light-text-prim dark:text-dark-text-prim border-0"
          >
            {functionData.map((func) => (
              <option key={func.functionName} value={func.functionName}>
                {func.functionName}
              </option>
            ))}
          </select>
        ) : (
          !error && <div className="text-light-text-prim dark:text-dark-text-prim">Loading functions...</div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-5 auto-rows-fr">
        {filteredData && (
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
        {filteredPercentileData && (
          <div className="flex-1 bg-light-cont-m dark:bg-dark-cont-m border border-light-cont-s dark:border-dark-cont-s rounded-lg p-4 shadow-sm transition-colors">
            <PercentileLatencyComponent data={filteredPercentileData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CloudwatchContainer;
