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
        backgroundColor: [
          'rgba(60, 120, 180, 1)',
          'rgba(140, 140, 140, 1)',
        ],
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
          text: 'Executions'
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
    <div>
      <h2>Total Concurrent Executions (5min period)</h2>
      <Bar data={chartData} options={options} className='bar'/>
    </div>
  )
};

export default ConcurrExecComponent;