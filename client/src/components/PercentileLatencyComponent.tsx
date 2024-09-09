import { Bar } from 'react-chartjs-2';

interface PercentileData {
  p90: number[];
  p95: number[];
  p99: number[];
}

interface Props {
  data: PercentileData;
}

const PercentileLatencyComponent = ({ data }: Props) => {
  const labels = ['p90', 'p95', 'p99'];

    const chartData = {
    labels,
    datasets: [
      {
        label: 'Latency (ms)',
        data: [data.p90[0], data.p95[0], data.p99[0]],
        backgroundColor: ['rgba(100, 150, 200, 1)']
      },
    ],
  };

  return (
    <div>
      <h2>Percentile Latency (ms)</h2>
      <Bar data={chartData} />
    </div>
  )

}

export default PercentileLatencyComponent