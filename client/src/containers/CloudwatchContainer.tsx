import ConcurrExecComponent from "../components/ConcurrExecComponent";
import ThrottleComponent from "../components/ThrottleComponent";
import TotalDurationComponent from "../components/TotalDurationComponent";
import PercentileLatencyComponent from "../components/PercentileLatencyComponent";
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
    const [selectedFunction, setSelectedFunction] = useState<string>('');
    const [filteredData, setFilteredData] = useState<FunctionData | null>(null);
    const [percentileData, setPercentileData] = useState<{ [key: string]: { percentiles: PercentileData } }>({});
    const [filteredPercentileData, setFilteredPercentileData] = useState<PercentileData | null>(null);

    useEffect(() => {
        fetch('http://localhost:8080/data/cloud')
            .then(res => res.json())
            .then((data: FunctionData[]) => {
                setFunctionData(data);
                if (data.length > 0) {
                    setSelectedFunction(data[0].functionName);
                }
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        fetch('http://localhost:8080/data/metrics')
            .then(res => res.json())
            .then((data: { [key: string]: { percentiles: PercentileData } }) => {
                setPercentileData(data);
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        if (selectedFunction && functionData.length > 0) {
            const selected = functionData.find(func => func.functionName === selectedFunction);
            setFilteredData(selected || null);

            const selectedPercentile = percentileData[selectedFunction]?.percentiles;
            setFilteredPercentileData(selectedPercentile || null);
        }
    }, [selectedFunction, functionData, percentileData]);

    return (
        <div>
            <h1>CloudWatch Metrics</h1>
            <select
                value={selectedFunction}
                onChange={(e) => setSelectedFunction(e.target.value)}
            >
                {functionData.map(func => (
                    <option key={func.functionName} value={func.functionName}>
                        {func.functionName}
                    </option>
                ))}
            </select>
            <div className="grid-container">
                {filteredData && (
                    <>
                            <ConcurrExecComponent data={filteredData}/>
                            <ThrottleComponent data={filteredData}/>
                            <TotalDurationComponent data={filteredData}/>
                    </>
                )}
                {filteredPercentileData && (
                    <div>
                        <PercentileLatencyComponent data={filteredPercentileData} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default CloudwatchContainer;