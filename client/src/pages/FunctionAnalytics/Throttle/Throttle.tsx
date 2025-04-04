import { ChartOptions } from "chart.js";
import ChartWrapper from "../../../components/Charts/ChartWrapper";

interface Props {
  data: {
    throttles: number[];
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

const ThrottleComponent = ({ data }: Props) => {
  const labels = data.timestamps.map(formatTimestamp);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Throttles",
        data: data.throttles,
        borderColor: "#60a5fa",
        backgroundColor: "#60a5fa",
        borderRadius: 0,
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    scales: {
      x: {
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
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Throttles",
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
      title="Total Number of Throttles"
      description="Throttles per 5min interval"
      chartType="line"
      chartData={chartData}
      chartOptions={options}
    />
  );
};

export default ThrottleComponent;
