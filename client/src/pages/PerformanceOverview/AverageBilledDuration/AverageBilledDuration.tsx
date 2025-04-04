import { ChartOptions, Tick, TooltipItem } from "chart.js";
import ChartWrapper from "../../../components/Charts/ChartWrapper";
import {
  getHorizontalBarOptions,
  deepMerge,
} from "../../../utils/chartOptions";

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

  const baseOptions = getHorizontalBarOptions();
  const options: ChartOptions<"bar"> = deepMerge(baseOptions, {
    scales: {
      x: {
        grid: {
          color: "#e5e7eb",
        },
        ticks: {
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
    },
    plugins: {
      tooltip: {
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
  });

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
