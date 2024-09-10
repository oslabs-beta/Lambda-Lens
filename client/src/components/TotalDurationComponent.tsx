import { Pie } from 'react-chartjs-2';

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
          'rgba(60, 120, 180, 1)',
          'rgba(140, 140, 140, 1)',
        ],
      },
    ],
  };

  return (
    <div>
      <h2>Average Execution Duration (5min period)</h2>
      <Pie data={chartData} className='pie'/>
    </div>
  )
}

export default TotalDurationComponent;