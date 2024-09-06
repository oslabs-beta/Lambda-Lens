import { Line } from 'react-chartjs-2';

interface Props {
  data: {
    throttles: number[];
  };
}

const ThrottleComponent = ({ data }: Props) => {
  const labels = data.throttles.map((_, index) => `Invocation ${index + 1}`);
  
  const chartData = {
    labels,
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
      <h2>Number of Throttles</h2>
      <Line data={chartData} options={options} />
    </div>
  )
};

export default ThrottleComponent;