import { Bar } from "react-chartjs-2";

const ConcurrInvocComponent = () => {
  const data = {
    labels: ['App A', 'App B', 'App C', 'App D', 'App E'],
    datasets: [
      {
        label: 'Errors',
        data: [12, 19, 3, 5, 2],
        backgroundColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  return (
    <div>
      <h2>Concurrent Invocations</h2>
      <Bar data={data} />
    </div>
  )
};

export default ConcurrInvocComponent;