import { Line } from 'react-chartjs-2';

interface Props {
  data: {
    throttles: number[];
    timestamps: string[];
  };
}

const ThrottleComponent = ({ data }: Props) => {
  
  const chartData = {
    labels: data.timestamps,
    datasets: [
      {
        label: 'Throttles',
        data: data.throttles,
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2>Number of Throttles (5min period)</h2>
      <Line data={chartData} options={options} />
    </div>
  )
};

export default ThrottleComponent;