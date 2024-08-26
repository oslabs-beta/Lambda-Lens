import { useState, useEffect } from "react";
import ColdStartsGraphComponent from "../components/ColdStartsGraphComponent";
import ColdStartsMetricsContainer from "./ColdStartsMetricsContainer";
import AvgBilledDurGraph from "../components/AvgBilledDurGraphComponent";
import '../styles.css';

interface FunctionData {
    functionName: string; 
    avgBilledDur: number;
    numColdStarts: number;
    percentColdStarts: number;
}

const DashboardContainer = () => {
const [data, setData] = useState<FunctionData[]>([]);

const fetchData = () => {
  fetch('/mockData.json')
    .then(res => res.json())
    .then(data => setData(data.functions))
    .catch(err => console.log(err))
}

useEffect(() => {
  fetchData();
}, []);

const handleRefresh = () => {
  fetchData();
}

const sortedData = data
  .sort((a, b) => b.percentColdStarts - a.percentColdStarts)
  .slice(0, 10)

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <button onClick={handleRefresh}>Refresh</button>
      <div>
        <ColdStartsMetricsContainer data={sortedData}/>
      </div>
      <div className="dashboard-graphs">
        <ColdStartsGraphComponent data={sortedData}/>
        <AvgBilledDurGraph data={sortedData}/>
      </div>
    </div>
  )
}

export default DashboardContainer;