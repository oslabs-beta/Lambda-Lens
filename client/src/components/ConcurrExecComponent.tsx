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
          '#437990',
          '#4c88a1',
          '#5796af',
          '#68a0b7',
          '#79abc0',
          '#8bb6c8',
          '#9cc1d0',
          '#adccd8',
          '#bfd7e0',
          '#d0e1e9'
        ],
        borderRadius: 4
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    scales: {
      x: {
        title: {
          display: true,
          text: 'Executions'
        },
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'End time'
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
    <div>
      <h2>Total Concurrent Executions (5min period)</h2>
      <Bar data={chartData} options={options} className='bar'/>
    </div>
  )
};

export default ConcurrExecComponent;