import { Doughnut } from "react-chartjs-2";
// Ensure Chart.js elements are registered
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
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
    labels: data.map((fn) => `${fn.functionName} (${((fn.numColdStarts / data.reduce((sum, d) => sum + d.numColdStarts, 0)) * 100).toFixed(0)}%)`), // Add percentage to label
    datasets: [
      {
        data: data.map((fn) => fn.numColdStarts),
        backgroundColor: backgroundColors.slice(0, data.length),
        // Target: Add white border between segments
        borderColor: '#ffffff', // White border for light mode
        // borderColor: '#2d3748', // Dark border for dark mode (conditionally apply if needed)
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      // Target: Hide default legend, labels are now part of the data labels
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
            label: function(context: any) {
                // Show only the value in the tooltip, as label now includes percentage
                let value = context.parsed || 0;
                return `Cold Starts: ${value}`;
            }
        }
      },
      // Optional: Use chartjs-plugin-datalabels if you want labels directly on/near the chart segments
      // datalabels: {
      //   formatter: (value, ctx) => {
      //     let sum = 0;
      //     let dataArr = ctx.chart.data.datasets[0].data;
      //     dataArr.map(data => { sum += data; });
      //     let percentage = (value*100 / sum).toFixed(0)+"%";
      //     return percentage;
      //   },
      //   color: '#fff',
      // }
    },
    maintainAspectRatio: false,
    cutout: '70%', // Target: Adjust cutout percentage
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