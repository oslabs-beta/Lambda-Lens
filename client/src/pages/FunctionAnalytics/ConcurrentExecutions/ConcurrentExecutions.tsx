import { ChartOptions } from "chart.js";
import ChartWrapper from "../../../components/Charts/ChartWrapper";

interface Props {
  data: {
    concurrentExecutions: number[];
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

const ConcurrExecComponent = ({ data }: Props) => {
  const labels = data.timestamps.map(formatTimestamp);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Executions",
        data: data.concurrentExecutions,
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
          display: true,
          text: "Executions",
        },
        grid: {
          display: true,
        },
        ticks: {
          color: "#6b7280",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "End time",
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
    },
    maintainAspectRatio: false,
  };

  return (
    <ChartWrapper
      title="Total Concurrent Executions"
      description="Executions per 5min interval"
      chartType="bar"
      chartData={chartData}
      chartOptions={options}
    />
  );
};

export default ConcurrExecComponent;
