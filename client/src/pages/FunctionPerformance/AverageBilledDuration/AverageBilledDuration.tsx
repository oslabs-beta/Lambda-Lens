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
        backgroundColor: "#437990",
        maxBarThickness: 50,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Duration (ms)",
          color: "#A2A2A2",
        },
        grid: {
          display: false,
        },
        ticks: {
          color: "#A2A2A2",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#A2A2A2",
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Average Billed Duration</h2>
      <div className="flex-1 min-h-0">
        <Bar data={chartData} options={options} className="w-full h-full" />
      </div>
    </div>
  );
};

export default AvgBilledDurGraph;