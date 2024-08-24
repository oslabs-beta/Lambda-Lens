import { Pie } from 'react-chartjs-2';

const TotalDurationComponent = () => {
  const data = {
    labels: ['App A', 'App B', 'App C', 'App D', 'App E'],
    datasets: [
      {
        data: [300, 50, 100, 75, 150],
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
      <h2>Total Execution Duration</h2>
      <Pie data={data} />
    </div>
  )
}

export default TotalDurationComponent;