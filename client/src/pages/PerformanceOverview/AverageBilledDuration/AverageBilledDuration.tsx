import { Bar } from "react-chartjs-2";
import { ChartOptions, Tick, TooltipItem } from 'chart.js';

interface FunctionData {
  functionName: string;
  avgBilledDur: number;
}

interface Props {
  data: FunctionData[];
}

const AvgBilledDurGraph = ({ data }: Props) => {
  const chartData = {
    labels: data.map((fn) => fn.functionName),
    datasets: [
      {
        label: "Average Billed Duration",
        data: data.map((fn) => fn.avgBilledDur),
        backgroundColor: "#60a5fa",
        borderRadius: 4, 
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: "y" as const,
    scales: {
      x: {
        title: {
          display: false,
        },
        grid: {
          display: true,
          color: "#e5e7eb",
        },
        ticks: {
           color: "#6b7280",
           callback: function(value: string | number, _index: number, _ticks: Tick[]) {
                const numericValue = typeof value === 'string' ? parseFloat(value) : value;
                return !isNaN(numericValue) ? numericValue + ' ms' : value;
           }
        }
      },
      y: {
        title: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
           color: "#6b7280",
        }
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#333',
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
            label: function(context: TooltipItem<'bar'>) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed?.x !== null && context.parsed?.x !== undefined) {
                    label += context.parsed.x.toFixed(2) + ' ms';
                }
                return label;
            }
        }
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-dark-text-prim">
        Average Billed Duration
      </h2>
      <p className="text-sm text-gray-500 dark:text-dark-text-sec mb-4">
        Measured in milliseconds (ms)
      </p>
      <div className="flex-1 min-h-0">
        <Bar data={chartData} options={options} className="w-full h-full" />
      </div>
    </div>
  );
};

export default AvgBilledDurGraph;