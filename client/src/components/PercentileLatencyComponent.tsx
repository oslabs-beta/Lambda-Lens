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
  const colorPalette = [
    'rgba(100, 150, 200, 1)',
    'rgba(150, 100, 200, 1)',
    'rgba(200, 150, 100, 1)',
  ];

  const chartData = {
    labels: ['Percentiles'],
    datasets: (Object.keys(data) as Array<keyof PercentileData>).map((key, index) => ({
      label: `${key.toUpperCase()} Latency (ms)`,  
      data: [data[key][0]],  
      backgroundColor: colorPalette[index],
    })),
  }

  const options = {
    scales: {
      y: {
        title: {
          display: true,
          text: 'Latency (ms)',
        }
      }
    },
  };

  return (
    <div>
      <h2>Percentile Latency (ms)</h2>
      <Bar data={chartData} options={options} />
    </div>
  )

}

export default PercentileLatencyComponent