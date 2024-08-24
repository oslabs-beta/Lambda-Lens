import { Pie } from 'react-chartjs-2';

interface FunctionData {
  functionName: string;
  numColdStarts: number;
}

interface Props {
  data: FunctionData[];
}

const ColdStartsGraphComponent = ({ data }: Props) => {
  const chartData = {
    labels: data.map(fn => fn.functionName),
    datasets: [
      {
        data: data.map(fn => fn.numColdStarts),
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
          'rgb(255, 159, 64)',
          'rgb(201, 203, 207)',
          'rgb(255, 99, 71)',
          'rgb(144, 238, 144)',
          'rgb(220, 20, 60)'
        ],
      },
    ],
  };

  return (
    <div>
      <h2>Total Cold Starts</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default ColdStartsGraphComponent;