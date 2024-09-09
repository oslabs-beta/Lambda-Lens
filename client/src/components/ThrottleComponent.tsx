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
          'rgba(60, 120, 180, 1)',
          'rgba(140, 140, 140, 1)',
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
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Throttles'
        }
      },
    },
  };

  return (
    <div>
      <h2>Total Number of Throttles (5min period)</h2>
      <Line data={chartData} options={options} />
    </div>
  )
};

export default ThrottleComponent;