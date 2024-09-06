import { Bar } from "react-chartjs-2";

interface Props {
  data: {
    concurrentExecutions: number[];
  };
}

const ConcurrExecComponent = ({ data }: Props) => {
  const chartData = {
    labels: ['Invocation'],
    datasets: [
      {
        label: 'Invocation',
        data: data.concurrentExecutions,
        backgroundColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  return (
    <div>
      <h2>Concurrent Executions</h2>
      <Bar data={chartData} />
    </div>
  )
};

export default ConcurrExecComponent;