import { useState, useEffect } from 'react';
import ColdStartsGraphComponent from '../components/ColdStartsGraphComponent';
import ColdStartsMetricsContainer from './ColdStartsMetricsContainer';
import AvgBilledDurGraph from '../components/AvgBilledDurGraphComponent';
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
    fetch('http://localhost:8080/data/req')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  const sortedData = data
    .sort((a, b) => b.percentColdStarts - a.percentColdStarts)
    .slice(0, 10);

  return (
    <div className='dashboard-container'>
      <div className='dashboard-header'>
        <h1>Dashboard</h1>
        <button className='refresh-button' onClick={handleRefresh}>&#x21bb;</button>
      </div>
      <div className='component-box'>
        <ColdStartsMetricsContainer data={sortedData} />
      </div>
      <div className='dashboard-graphs'>
        <div className='component-box graph-container'>
          <ColdStartsGraphComponent data={sortedData} />
        </div>
        <div className='component-box graph-container'>
          <AvgBilledDurGraph data={sortedData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardContainer;
