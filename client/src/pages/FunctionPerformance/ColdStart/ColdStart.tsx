import { Doughnut } from "react-chartjs-2";

interface FunctionData {
  functionName: string;
  numColdStarts: number;
}

interface Props {
  data: FunctionData[];
}

const ColdStartsGraphComponent = ({ data }: Props) => {
  const chartData = {
    labels: data.map((fn) => fn.functionName),
    datasets: [
      {
        data: data.map((fn) => fn.numColdStarts),
        backgroundColor: [
          "#437990",
          "#4c88a1",
          "#5796af",
          "#68a0b7",
          "#79abc0",
          "#8bb6c8",
          "#9cc1d0",
          "#adccd8",
          "#bfd7e0",
          "#d0e1e9",
        ],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "left" as const,
        labels: {
          color: "#646464",
          padding: 16,
          font: {
            size: 12,
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 text-[#161616] dark:text-white">Total Cold Starts</h2>
      <div className="flex-1 min-h-0">
        <div className="bg-[#e1e1e1] dark:bg-[#2a2a2a] rounded-lg p-4 shadow-sm transition-colors">
          <Doughnut data={chartData} options={options} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default ColdStartsGraphComponent;
