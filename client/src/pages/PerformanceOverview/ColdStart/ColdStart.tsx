import { ChartOptions, TooltipItem } from "chart.js";
import ChartWrapper from "../../../components/Charts/ChartWrapper";
import { getDoughnutOptions, deepMerge } from "../../../utils/chartOptions";

interface FunctionData {
  functionName: string;
  numColdStarts: number;
}

interface Props {
  data: FunctionData[];
}

const ColdStartsGraphComponent = ({ data }: Props) => {
  const backgroundColors = [
    "#2563eb",
    "#3b82f6",
    "#60a5fa",
    "#93c5fd",
    "#bfdbfe",
  ];

  const chartData = {
    labels: data.map((fn) => fn.functionName),
    datasets: [
      {
        data: data.map((fn) => fn.numColdStarts),
        backgroundColor: backgroundColors.slice(0, data.length),
        borderColor: "#ffffff",
        borderWidth: 2,
        label: "Cold Starts",
        borderRadius: 0,
      },
    ],
  };

  const baseOptions = getDoughnutOptions();
  const options: ChartOptions<"doughnut"> = deepMerge(baseOptions, {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"doughnut">) {
            let label = context.label || "";
            const value = context.parsed || 0;
            if (label) {
              label += ": ";
            }
            label += `${value} Cold Starts`;

            const datasetData = context.chart.data.datasets[0].data.filter(
              (d): d is number => typeof d === "number" && !isNaN(d)
            );
            const total = datasetData.reduce(
              (acc: number, val: number) => acc + val,
              0
            );

            const percentage =
              typeof total === "number" && total > 0
                ? ((value / total) * 100).toFixed(1) + "%"
                : "0.0%";
            label += ` (${percentage})`;
            return label;
          },
        },
      },
    },
  });

  return (
    <ChartWrapper
      title="Total Cold Starts"
      description="Distribution by function"
      chartType="doughnut"
      chartData={chartData}
      chartOptions={options}
    />
  );
};

export default ColdStartsGraphComponent;
