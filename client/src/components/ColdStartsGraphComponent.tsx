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
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'left' as const,
      },
    },
  }

  return (
    <div>
      <h2>Total Cold Starts</h2>
      <Pie data={chartData} options={options}/>
    </div>
  );
};

export default ColdStartsGraphComponent;