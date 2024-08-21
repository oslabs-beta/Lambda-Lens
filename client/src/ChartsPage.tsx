import React from "react";
import { Chart, registerables } from 'chart.js';
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";

Chart.register(...registerables);

const ChartsPage: React.FC = () => {
  return (
    <div>
      <LineChart />
      <BarChart />
      <PieChart />
    </div>
  );
};

export default ChartsPage;