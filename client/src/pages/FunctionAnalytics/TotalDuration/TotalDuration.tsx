import { ChartOptions } from "chart.js";
import ChartWrapper from "../../../components/Charts/ChartWrapper";

interface Props {
  data: {
    duration: number[];
    timestamps: string[];
  };
}

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);

  const formattedDate = date.toLocaleDateString([], {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });

  const formattedTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formattedDate} ${formattedTime}`;
};

const TotalDurationComponent = ({ data }: Props) => {
  const labels = data.timestamps.map(formatTimestamp);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Duration",
        data: data.duration,
        backgroundColor: [
          "#2563eb",
          "#3b82f6",
          "#60a5fa",
          "#93c5fd",
          "#bfdbfe",
          "#2563eb",
          "#3b82f6",
          "#60a5fa",
          "#93c5fd",
          "#bfdbfe",
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
        borderRadius: 0,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    plugins: {
      legend: {
        display: true,
        position: "right" as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          color: "#6b7280",
        },
      },
      tooltip: {
        backgroundColor: "#333",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    maintainAspectRatio: false,
    cutout: "70%",
  };

  return (
    <ChartWrapper
      title="Average Execution Duration"
      description="Duration per 5min interval (ms)"
      chartType="doughnut"
      chartData={chartData}
      chartOptions={options}
    />
  );
};

export default TotalDurationComponent;
