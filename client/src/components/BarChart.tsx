import { Bar } from "react-chartjs-2";

const BarChart = () => {
  const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: 'Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  return <Bar data={data} />;
};

export default BarChart;