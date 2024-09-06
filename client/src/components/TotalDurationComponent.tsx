import { Pie } from 'react-chartjs-2';

interface Props {
  data: {
    duration: number[];
    timestamps: string[];
  }
}

const TotalDurationComponent = ({ data }: Props) => {
  
  const chartData = {
    labels: data.timestamps,
    datasets: [
      {
        data: data.duration,
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(100, 70, 200)',
          'rgb(200, 20, 250)',
        ],
      },
    ],
  };

  return (
    <div>
      <h2>Total Execution Duration (5min period)</h2>
      <Pie data={chartData} />
    </div>
  )
}

export default TotalDurationComponent;