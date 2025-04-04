import { Doughnut } from "react-chartjs-2";
// Import TooltipItem
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  TooltipItem,
} from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

interface FunctionData {
  functionName: string;
  numColdStarts: number;
}

interface Props {
  data: FunctionData[];
}

const ColdStartsGraphComponent = ({ data }: Props) => {
  const backgroundColors = [
    "#2563eb",
    "#3b82f6",
    "#60a5fa",
    "#93c5fd",
    "#bfdbfe",
  ];

  const chartData = {
    labels: data.map((fn) => fn.functionName),
    datasets: [
      {
        data: data.map((fn) => fn.numColdStarts),
        backgroundColor: backgroundColors.slice(0, data.length),
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          boxWidth: 12,
          padding: 15,
          color: "#6b7280",
          // Optional: Customize label generation further if needed
          // generateLabels: function(chart) { ... }
        },
      },
      tooltip: {
        callbacks: {
          // Use TooltipItem<'doughnut'> instead of any
          label: function (context: TooltipItem<"doughnut">) {
            let label = context.label || "";
            // Use const instead of let
            const value = context.parsed || 0;
            if (label) {
              label += ": ";
            }
            label += `${value} Cold Starts`;

            // Filter data to ensure only numbers are reduced and handle potential null/undefined
            const datasetData = context.chart.data.datasets[0].data.filter(
              (d): d is number => typeof d === "number" && !isNaN(d)
            );
            const total = datasetData.reduce(
              (acc: number, val: number) => acc + val,
              0 // Provide initial value 0
            );

            // Check if total is a valid number and greater than 0 before calculating percentage
            const percentage =
              typeof total === "number" && total > 0
                ? ((value / total) * 100).toFixed(1) + "%"
                : "0.0%";
            label += ` (${percentage})`;
            return label;
          },
        },
      },
    },
    maintainAspectRatio: false,
    cutout: "70%",
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-dark-text-prim">
        Total Cold Starts
      </h2>
      <p className="text-sm text-gray-500 dark:text-dark-text-sec mb-4">
        Distribution by function
      </p>
      <div className="flex-1 min-h-0 relative">
        <Doughnut
          data={chartData}
          options={options}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default ColdStartsGraphComponent;
