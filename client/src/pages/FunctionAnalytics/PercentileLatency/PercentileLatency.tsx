import { ChartOptions } from "chart.js";
import ChartWrapper from "../../../components/Charts/ChartWrapper";
import {
  getHorizontalBarOptions,
  deepMerge,
} from "../../../utils/chartOptions";

interface PercentileData {
  p90: number[];
  p95: number[];
  p99: number[];
}

interface Props {
  data: PercentileData;
}

const PercentileLatencyComponent = ({ data }: Props) => {
  const colorPalette = ["#2563eb", "#3b82f6", "#60a5fa"];

  const chartData = {
    labels: ["Percentiles"],
    datasets: (Object.keys(data) as Array<keyof PercentileData>).map(
      (key, index) => ({
        label: `${key.toUpperCase()} Latency (ms)`,
        data: [
          Array.isArray(data[key]) && data[key].length > 0 ? data[key][0] : 0,
        ],
        backgroundColor: colorPalette[index % colorPalette.length],
        borderRadius: 4,
      })
    ),
  };

  const baseOptions = getHorizontalBarOptions();
  const options: ChartOptions<"bar"> = deepMerge(baseOptions, {
    scales: {
      x: {
        title: {
          display: true,
          text: "Latency (ms)",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          color: "#6b7280",
          boxWidth: 12,
          padding: 10,
        },
      },
    },
  });

  return (
    <ChartWrapper
      title="Percentile Latency"
      description="P90, P95, P99 latency distribution (ms)"
      chartType="bar"
      chartData={chartData}
      chartOptions={options}
    />
  );
};

export default PercentileLatencyComponent;
