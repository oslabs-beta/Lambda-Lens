import { Doughnut } from 'react-chartjs-2';

interface Props {
  data: {
    duration: number[];
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
    minute: '2-digit',
  });

  return `${formattedDate} ${formattedTime}`;
};

const TotalDurationComponent = ({ data }: Props) => {
  const labels = data.timestamps.map(formatTimestamp);

  const chartData = {
    labels,
    datasets: [
      {
        data: data.duration,
        backgroundColor: [
          "#2563eb", // Darker Blue
          "#3b82f6", // Medium Blue
          "#60a5fa", // Lighter Blue
          "#93c5fd", // Very Light Blue
          "#bfdbfe", // Palest Blue
          // Add more shades if needed, cycling through
          "#2563eb",
          "#3b82f6",
          "#60a5fa",
          "#93c5fd",
          "#bfdbfe",
        ],
        borderColor: '#ffffff', // Add white border like ColdStartsGraphComponent
        borderWidth: 2,       // Add white border like ColdStartsGraphComponent
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'right' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          color: '#6b7280',
        },
      },
      tooltip: {
        backgroundColor: '#333',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
    },
    maintainAspectRatio: false,
    cutout: '70%',
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-dark-text-prim">Average Execution Duration</h2>
      <p className="text-sm text-gray-500 dark:text-dark-text-sec mb-4">
        Duration per 5min interval (ms)
      </p>
      <div className="flex-1 min-h-0">
        <Doughnut data={chartData} options={options} className="w-full h-full" />
      </div>
    </div>
  );
};

export default TotalDurationComponent;
