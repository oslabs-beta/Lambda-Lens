import { Pie } from 'react-chartjs-2';

const ColdStartsGraphComponent = () => {
  const data = {
    labels: ['Function A', 'Function B', 'Function C', 'Function D', 'Function E'],
    datasets: [
      {
        data: [20, 5, 3, 13, 6],
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
      <h2>Total Cold Starts</h2>
      <Pie data={data} />
    </div>
  );
};

export default ColdStartsGraphComponent;