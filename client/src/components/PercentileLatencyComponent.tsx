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
    '#4c88a1',
    '#79abc0',
    '#adccd8',
  ];

  const chartData = {
    labels: ['Percentiles'],
    datasets: (Object.keys(data) as Array<keyof PercentileData>).map((key, index) => ({
      label: `${key.toUpperCase()} Latency (ms)`,  
      data: [data[key][0]],  
      backgroundColor: colorPalette[index],
      borderRadius: 4
    })),
  }

  const options = {
    indexAxis: 'y',
    scales: {
      x: {
        title: {
          display: true,
          text: 'Latency (ms)',
        },
        grid: {
          display: false
        }
      }
    },
  };

  return (
    <div>
      <h2>Percentile Latency (ms)</h2>
      <Bar data={chartData} options={options} className='bar'/>
    </div>
  )

}

export default PercentileLatencyComponent