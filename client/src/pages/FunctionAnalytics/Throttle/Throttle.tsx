import { Line } from 'react-chartjs-2';

interface Props {
  data: {
    throttles: number[];
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

const ThrottleComponent = ({ data }: Props) => {
  const labels = data.timestamps.map(formatTimestamp);
  
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Throttles',
        data: data.throttles,
        borderColor: "#60a5fa",
        fill: false,
        tension: 0.1 // Optional: Add slight curve to line
      },
    ],
  };

  const options = {
    scales: {
      x: {
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
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Throttles'
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
      <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-dark-text-prim">Total Number of Throttles</h2>
       {/* Add consistent subtitle */}
      <p className="text-sm text-gray-500 dark:text-dark-text-sec mb-4">
        Throttles per 5min interval
      </p>
      {/* Remove inner container/background/shadow */}
      <div className="flex-1 min-h-0">
          <Line data={chartData} options={options} className="w-full h-full" />
      </div>
    </div>
  );
};

export default ThrottleComponent;