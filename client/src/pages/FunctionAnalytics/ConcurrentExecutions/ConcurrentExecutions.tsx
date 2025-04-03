import { Bar } from "react-chartjs-2";

interface Props {
  data: {
    concurrentExecutions: number[];
    timestamps: string[];
  };
}

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);

  const formattedDate = date.toLocaleDateString([], {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

  const formattedTime = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return `${formattedDate} ${formattedTime}`;
};

const ConcurrExecComponent = ({ data }: Props) => {
  const labels = data.timestamps.map(formatTimestamp);
  
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Executions',
        data: data.concurrentExecutions,
        backgroundColor: "#60a5fa",
        borderRadius: 4
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Executions'
        },
        grid: {
          display: false // Keep grid off
        },
        ticks: {
          color: "#6b7280", // Match tick color
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'End time'
        },
        grid: {
          display: false // Keep grid off
        },
        ticks: {
          color: "#6b7280", // Match tick color
        }
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false, // Add maintainAspectRatio
  };

  return (
    <div className="flex flex-col h-full">
      {/* Use consistent title styling */}
      <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-dark-text-prim">Total Concurrent Executions</h2>
      {/* Add consistent subtitle */}
      <p className="text-sm text-gray-500 dark:text-dark-text-sec mb-4">
        Executions per 5min interval
      </p>
      {/* Remove inner container/background/shadow */}
      <div className="flex-1 min-h-0">
        <Bar data={chartData} options={options} className="w-full h-full" />
      </div>
    </div>
  );
};

export default ConcurrExecComponent;