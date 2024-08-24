import { Bar } from "react-chartjs-2";

const InvocErrComponent = () => {
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
      <h2>Invocation Error Rates</h2>
      <Bar data={data} />
    </div>
  )
};

export default InvocErrComponent;