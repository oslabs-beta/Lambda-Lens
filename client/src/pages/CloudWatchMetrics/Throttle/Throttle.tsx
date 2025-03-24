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
        borderColor: [
          '#437990',
        ],
        fill: false,
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
          display: false
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Throttles'
        },
        grid: {
          display: false
        }
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 text-[#161616] dark:text-white">Total Number of Throttles (5min period)</h2>
      <div className="flex-1 min-h-0">
        <div className="bg-[#e1e1e1] dark:bg-[#363636] rounded-lg p-4 shadow-sm transition-colors">
          <Line data={chartData} options={options} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default ThrottleComponent;