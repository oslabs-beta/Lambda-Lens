import { Bar } from 'react-chartjs-2';

interface Props {
  data: { functionName: string; avgBilledDur: number}[];
}

const AvgBilledDurGraph = ({ data }: Props) => {
  const chartData = {
    labels: data.map(fn => fn.functionName),
    datasets: [
      {
        label: 'Average Billed Duration (ms)',
        data: data.map(fn => fn.avgBilledDur),
        backgroundColor: [
          '#4E79A7', // Soft Blue
          '#F28E2B', // Orange
          '#E15759', // Red
          '#76B7B2', // Teal
          '#59A14F', // Green
          '#EDC948', // Yellow
          '#B07AA1', // Purple
          '#FF9DA7', // Pink
          '#9C755F', // Brown
          '#BAB0AC', // Gray
        ],
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Function Name'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Time (ms)'
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
    <div>
      <h2>Average Billed Duration (ms)</h2>
      <Bar data={chartData} options={options}/>
    </div>
  )
};

export default AvgBilledDurGraph;