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
  // Use blue shades like ColdStartsGraphComponent
  const colorPalette = [
    "#2563eb", // Darker Blue for P90
    "#3b82f6", // Medium Blue for P95
    "#60a5fa", // Lighter Blue for P99
  ];

  const chartData = {
    labels: ['Percentiles'],
    datasets: (Object.keys(data) as Array<keyof PercentileData>).map((key, index) => ({
      label: `${key.toUpperCase()} Latency (ms)`,
      // Ensure data is always an array, taking the first element if available
      data: [Array.isArray(data[key]) && data[key].length > 0 ? data[key][0] : 0],
      backgroundColor: colorPalette[index % colorPalette.length], // Use modulo for safety
      borderRadius: 4
    })),
  };

  const options = {
    indexAxis: 'y' as const, // Keep horizontal bar chart
    scales: {
      x: {
        title: {
          display: true,
          text: 'Latency (ms)',
        },
        grid: {
          display: false // Keep grid off
        },
        ticks: {
          color: "#6b7280", // Match tick color
        }
      },
      y: { // Add y-axis styling
        grid: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
        }
      }
    },
    plugins: { // Add plugins section if needed for legend/tooltip
      legend: {
        display: true, // Display legend for different percentiles
        position: 'top' as const, // Example position
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
    maintainAspectRatio: false, // Add maintainAspectRatio
  };

  return (
    <div className="flex flex-col h-full">
      {/* Use consistent title styling */}
      <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-dark-text-prim">Percentile Latency</h2>
      {/* Add consistent subtitle */}
      <p className="text-sm text-gray-500 dark:text-dark-text-sec mb-4">
        P90, P95, P99 latency distribution (ms)
      </p>
      {/* Remove inner container/background/shadow */}
      <div className="flex-1 min-h-0">
        <Bar data={chartData} options={options} className="w-full h-full" />
      </div>
    </div>
  );
};

export default PercentileLatencyComponent;