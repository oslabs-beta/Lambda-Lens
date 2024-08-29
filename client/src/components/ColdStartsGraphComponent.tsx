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

  return (
    <div>
      <h2>Total Cold Starts</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default ColdStartsGraphComponent;