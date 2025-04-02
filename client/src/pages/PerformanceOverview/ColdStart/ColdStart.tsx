import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js'; // Import ChartOptions
Chart.register(ArcElement, Tooltip, Legend);


interface FunctionData {
  functionName: string;
  numColdStarts: number;
}

interface Props {
  data: FunctionData[];
}

const ColdStartsGraphComponent = ({ data }: Props) => {
  // Target: Different blue shades
  const backgroundColors = [
    "#2563eb", // Darker Blue
    "#3b82f6", // Medium Blue
    "#60a5fa", // Lighter Blue
    "#93c5fd", // Very Light Blue
    "#bfdbfe", // Palest Blue
    // Add more shades if needed
  ];

  const chartData = {
    // Use only function name for labels, legend will show details
    labels: data.map((fn) => fn.functionName),
    datasets: [
      {
        data: data.map((fn) => fn.numColdStarts),
        backgroundColor: backgroundColors.slice(0, data.length),
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  // Explicitly type options
  const options: ChartOptions<'doughnut'> = {
    plugins: {
      legend: {
        display: true, // Re-enable the legend
        position: 'right', // Position legend to the right
        labels: {
           boxWidth: 12, // Smaller color box
           padding: 15, // Padding between legend items
           color: '#6b7280', // Match tick color for consistency (adjust if needed)
           // Optional: Customize label generation further if needed
           // generateLabels: function(chart) { ... }
        }
      },
      tooltip: {
        callbacks: {
            label: function(context: any) {
                let label = context.label || '';
                let value = context.parsed || 0;
                if (label) {
                    label += ': ';
                }
                label += `${value} Cold Starts`;
                // Calculate percentage for tooltip
                const total = context.chart.data.datasets[0].data.reduce((acc: number, val: number) => acc + val, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0.0%';
                label += ` (${percentage})`;
                return label;
            }
        }
      },
    },
    maintainAspectRatio: false,
    cutout: '70%',
  };

  return (
    <div className="flex flex-col h-full">
      {/* Target: Updated title style */}
      <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-dark-text-prim">Total Cold Starts</h2>
       {/* Target: Add subtitle */}
      <p className="text-sm text-gray-500 dark:text-dark-text-sec mb-4">
        Distribution by function
      </p>
      {/* Target: Remove inner container/background/shadow */}
      <div className="flex-1 min-h-0 relative"> {/* Added relative for potential future label positioning */}
        <Doughnut data={chartData} options={options} className="w-full h-full" />
      </div>
    </div>
  );
};

export default ColdStartsGraphComponent;