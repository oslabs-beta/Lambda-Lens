import { Bar } from "react-chartjs-2";

interface FunctionData {
  functionName: string;
  avgBilledDur: number;
}

interface Props {
  data: FunctionData[];
}

const AvgBilledDurGraph = ({ data }: Props) => {
  const chartData = {
    labels: data.map((fn) => fn.functionName),
    datasets: [
      {
        label: "Average Billed Duration",
        data: data.map((fn) => fn.avgBilledDur),
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
        borderRadius: 4,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    scales: {
      x: {
        title: {
          display: true,
          text: "Duration (ms)",
          color: "#646464",
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "Function Name",
          color: "#646464",
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 text-light-text-prim dark:text-dark-text-prim">
        Average Billed Duration
      </h2>
      <div className="flex-1 min-h-0">
        <div className="bg-light-cont-s dark:bg-dark-cont-s rounded-lg p-4 shadow-sm transition-colors">
          <Bar data={chartData} options={options} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default AvgBilledDurGraph;