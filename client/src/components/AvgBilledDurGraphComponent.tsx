import { Bar } from 'react-chartjs-2';

interface Props {
  data: { functionName: string; avgBilledDur: number}[];
}

const AvgBilledDurGraph = ({ data }: Props) => {
  const chartData = {
    labels: data.map(fn => fn.functionName),
    datasets: [
      {
        label: 'Average Billed Duration',
        data: data.map(fn => fn.avgBilledDur),
        backgroundColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  return (
    <div>
      <h2>Average Billed Duration</h2>
      <Bar data={chartData} />
    </div>
  )
};

export default AvgBilledDurGraph;