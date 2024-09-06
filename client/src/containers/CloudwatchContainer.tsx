import ConcurrInvocComponent from "../components/ConcurrInvocComponent";
import ThrottleComponent from "../components/ThrottleComponent";
import TotalDurationComponent from "../components/TotalDurationComponent";
import { useState, useEffect } from "react";

interface FunctionData {
    functionName: string;
    duration: number[];
    concurrentExecutions: number[];
    throttles: number[];
}

const CloudwatchContainer = () => {
    const [functionData, setFunctionData] = useState<FunctionData[]>([]);
    const [selectedFunction, setSelectedFunction] = useState<string>('');
    const [filteredData, setFilteredData] = useState<FunctionData | null>(null);

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
        if (selectedFunction && functionData.length > 0) {
            const selected = functionData.find(func => func.functionName === selectedFunction);
            setFilteredData(selected || null);
        }
    }, [selectedFunction, functionData]);

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

            {filteredData && (
                <div className="container">
                    <div className="charts-column">
                        <ConcurrInvocComponent />
                        <ThrottleComponent />
                    </div>
                    <div className="offset-graph">
                        <TotalDurationComponent />
                    </div>
                </div>
            )}
        </div>
    );
}

export default CloudwatchContainer;