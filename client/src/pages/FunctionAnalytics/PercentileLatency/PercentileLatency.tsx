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
    "#2563eb", 
    "#3b82f6", 
    "#60a5fa", 
  ];

  const chartData = {
    labels: ['Percentiles'],
    datasets: (Object.keys(data) as Array<keyof PercentileData>).map((key, index) => ({
      label: `${key.toUpperCase()} Latency (ms)`,
      data: [Array.isArray(data[key]) && data[key].length > 0 ? data[key][0] : 0],
      backgroundColor: colorPalette[index % colorPalette.length], 
      borderRadius: 4
    })),
  };

  const options = {
    indexAxis: 'y' as const, 
    scales: {
      x: {
        title: {
          display: true,
          text: 'Latency (ms)',
        },
        grid: {
          display: false 
        },
        ticks: {
          color: "#6b7280", 
        }
      },
      y: { 
        grid: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
        }
      }
    },
    plugins: { 
      legend: {
        display: true, 
        position: 'top' as const, 
        labels: {
          color: '#6b7280',
          boxWidth: 12,
          padding: 10,
        }
      },
      tooltip: {
        backgroundColor: '#333',
        titleColor: '#fff',
        bodyColor: '#fff',
      }
    },
    maintainAspectRatio: false, 
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-dark-text-prim">Percentile Latency</h2>
      <p className="text-sm text-gray-500 dark:text-dark-text-sec mb-4">
        P90, P95, P99 latency distribution (ms)
      </p>
      <div className="flex-1 min-h-0">
        <Bar data={chartData} options={options} className="w-full h-full" />
      </div>
    </div>
  );
};

export default PercentileLatencyComponent;