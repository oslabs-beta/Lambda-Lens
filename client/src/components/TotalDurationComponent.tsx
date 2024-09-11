import { Doughnut } from 'react-chartjs-2';

interface Props {
  data: {
    duration: number[];
    timestamps: string[];
  }
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

const TotalDurationComponent = ({ data }: Props) => {
  const labels = data.timestamps.map(formatTimestamp);
  
  const chartData = {
    labels,
    datasets: [
      {
        data: data.duration,
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
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'left' as const,
        labels: {
          boxWidth: 20,
          padding: 10,
        },
      },
    },
  };

  return (
    <div>
      <h2>Average Execution Duration (5min period)</h2>
      <Doughnut data={chartData} options={options} className='pie' width={20} height={20}/>
    </div>
  )
}

export default TotalDurationComponent;