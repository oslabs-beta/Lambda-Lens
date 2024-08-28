import { Line } from 'react-chartjs-2';

const ThrottleComponent = () => {
  const data = {
    labels: ['App A', 'App B', 'App C', 'App D', 'App E'],
    datasets: [
      {
        label: 'Throttles',
        data: [10, 40, 5, 30, 50],
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
      <Line data={data} options={options} />
    </div>
  )
};

export default ThrottleComponent;