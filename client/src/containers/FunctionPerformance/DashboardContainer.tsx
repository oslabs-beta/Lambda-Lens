import { useState, useEffect } from "react";
import ColdStartsGraphComponent from "./ColdStartsGraph/ColdStartsGraphComponent";
import ColdStartsMetricsContainer from "./ColdStartsMetrics/ColdStartsMetricsContainer";
import AvgBilledDurGraph from "./AvgBilledDurGraph/AvgBilledDurGraphComponent";
import ChatContainer from "./Chat/ChatContainer";
import "../../Graphs.css";

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
    fetch("http://localhost:8080/data/req")
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
    <div>
      {/* Quadrant 1 */}
      <div className="dashboard-header-cw">
        <h1>Function Performance</h1>
        <button
          className={`refresh-button ${isClicked ? "clicked" : ""}`}
          onClick={handleRefresh}
          aria-label="Refresh"
        >
          &#x21bb;
        </button>
      </div>
      <div className="grid-container">
        <div className="component-box-cw">
          <AvgBilledDurGraph data={sortedData} />
        </div>

        {/* Quadrant 2 */}
        <div className="component-box-cw">
          <ColdStartsMetricsContainer data={sortedData} />
        </div>

        {/* Quadrant 3 */}
        <div className="component-box-cw">
          <ColdStartsGraphComponent data={sortedData} />
        </div>

        {/* Quadrant 4 */}
        <div className="component-box-cw">
          <h2>Bedrock Analysis</h2>
          <ChatContainer />
        </div>
      </div>
    </div>
  );
};

export default DashboardContainer;
