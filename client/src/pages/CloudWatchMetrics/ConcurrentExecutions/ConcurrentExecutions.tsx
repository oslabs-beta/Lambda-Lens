import { Bar } from "react-chartjs-2";
import "../../../styles/Graphs.css";

interface Props {
  data: {
    concurrentExecutions: number[];
    timestamps: string[];
  };
}

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);

  const formattedDate = date.toLocaleDateString([], {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

  const formattedTime = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return `${formattedDate} ${formattedTime}`;
};

const ConcurrExecComponent = ({ data }: Props) => {
  const labels = data.timestamps.map(formatTimestamp);
  
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Executions',
        data: data.concurrentExecutions,
        backgroundColor: [
          '#437990',
          '#4c88a1',
          '#5796af',
          '#68a0b7',
          '#79abc0',
          '#8bb6c8',
          '#9cc1d0',
          '#adccd8',
          '#bfd7e0',
          '#d0e1e9'
        ],
        borderRadius: 4
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Executions'
        },
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'End time'
        },
        grid: {
          display: false
        }
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 text-[#161616] dark:text-white">Total Concurrent Executions (5min period)</h2>
      <div className="flex-1 min-h-0">
        <div className="bg-[#e1e1e1] dark:bg-[#363636] rounded-lg p-4 shadow-sm transition-colors">
          <Bar data={chartData} options={options} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default ConcurrExecComponent;