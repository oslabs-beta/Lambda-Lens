import { ChartOptions, Tick, TooltipItem } from "chart.js";
import ChartWrapper from "../../../components/Charts/ChartWrapper";

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
        backgroundColor: "#60a5fa",
        borderRadius: 4,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "y" as const,
    scales: {
      x: {
        title: {
          display: false,
        },
        grid: {
          display: true,
          color: "#e5e7eb",
        },
        ticks: {
          color: "#6b7280",
          callback: function (
            value: string | number,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            _index: number,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            _ticks: Tick[]
          ) {
            const numericValue =
              typeof value === "string" ? parseFloat(value) : value;
            return !isNaN(numericValue) ? numericValue + " ms" : value;
          },
        },
      },
      y: {
        title: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#333",
        titleColor: "#fff",
        bodyColor: "#fff",
        callbacks: {
          label: function (context: TooltipItem<"bar">) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed?.x !== null && context.parsed?.x !== undefined) {
              label += context.parsed.x.toFixed(2) + " ms";
            }
            return label;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <ChartWrapper
      title="Average Billed Duration"
      description="Measured in milliseconds (ms)"
      chartType="bar"
      chartData={chartData}
      chartOptions={options}
    />
  );
};

export default AvgBilledDurGraph;
