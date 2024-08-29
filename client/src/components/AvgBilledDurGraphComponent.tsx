import { Bar } from 'react-chartjs-2';

interface Props {
  data: { functionName: string; avgBilledDur: number}[];
}

const AvgBilledDurGraph = ({ data }: Props) => {
  const chartData = {
    labels: data.map(fn => fn.functionName),
    datasets: [
      {
        label: 'Average Billed Duration (ms)',
        data: data.map(fn => fn.avgBilledDur),
        backgroundColor: [
          '#4E79A7', // Soft Blue
          '#F28E2B', // Orange
          '#E15759', // Red
          '#76B7B2', // Teal
          '#59A14F', // Green
          '#EDC948', // Yellow
          '#B07AA1', // Purple
          '#FF9DA7', // Pink
          '#9C755F', // Brown
          '#BAB0AC', // Gray
        ],
      },
    ],
  };

  return (
    <div>
      <h2>Average Billed Duration (ms)</h2>
      <Bar data={chartData} />
    </div>
  )
};

export default AvgBilledDurGraph;