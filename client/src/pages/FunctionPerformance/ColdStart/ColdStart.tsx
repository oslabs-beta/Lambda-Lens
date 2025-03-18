import { Doughnut } from "react-chartjs-2";
import "../../../styles/Graphs.css";

interface FunctionData {
  functionName: string;
  numColdStarts: number;
}

interface Props {
  data: FunctionData[];
}

const ColdStartsGraphComponent = ({ data }: Props) => {
  const chartData = {
    labels: data.map((fn) => fn.functionName),
    datasets: [
      {
        data: data.map((fn) => fn.numColdStarts),
        backgroundColor: [
          "#437990",
          "#4c88a1",
          "#5796af",
          "#68a0b7",
          "#79abc0",
          "#8bb6c8",
          "#9cc1d0",
          "#adccd8",
          "#bfd7e0",
          "#d0e1e9",
        ],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "left" as const,
        labels: {
          color: "#A2A2A2",
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Total Cold Starts</h2>
      <div className="flex-1 min-h-0">
        <Doughnut data={chartData} options={options} className="w-full h-full" />
      </div>
    </div>
  );
};

export default ColdStartsGraphComponent;
