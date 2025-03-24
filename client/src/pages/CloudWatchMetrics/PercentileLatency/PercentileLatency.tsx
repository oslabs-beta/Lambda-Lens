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
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 text-[#161616] dark:text-white">Percentile Latency (ms)</h2>
      <div className="flex-1 min-h-0">
        <div className="bg-[#e1e1e1] dark:bg-[#363636] rounded-lg p-4 shadow-sm transition-colors">
          <Bar data={chartData} options={options} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default PercentileLatencyComponent;