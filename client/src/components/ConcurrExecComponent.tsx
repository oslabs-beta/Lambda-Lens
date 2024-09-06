import { Bar } from "react-chartjs-2";

interface Props {
  data: {
    concurrentExecutions: number[];
    timestamps: string[];
  };
}

const ConcurrExecComponent = ({ data }: Props) => {
  
  const chartData = {
    labels: data.timestamps,
    datasets: [
      {
        label: 'Executions',
        data: data.concurrentExecutions,
        backgroundColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  return (
    <div>
      <h2>Concurrent Executions (5min period)</h2>
      <Bar data={chartData} />
    </div>
  )
};

export default ConcurrExecComponent;