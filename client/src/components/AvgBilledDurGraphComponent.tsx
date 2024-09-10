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
        backgroundColor: '#447A90',
        borderRadius: 2,
        hoverBackgroundColor: '#62ACCC'
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#FFFFFF',
          display: false,
        },
        title: {
          display: false,
        },
        border: {
          display: false,
        }
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          padding: 10,
        },
        title: {
          display: false,
        },
        border: {
          display: false,
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
      <div className='chart-wrapper'>
        <Bar data={chartData} options={options}/>
      </div>
    </div>
  )
};

export default AvgBilledDurGraph;