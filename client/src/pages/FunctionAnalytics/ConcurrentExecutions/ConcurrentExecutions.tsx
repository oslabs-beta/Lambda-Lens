import { ChartOptions } from "chart.js";
import ChartWrapper from "../../../components/Charts/ChartWrapper";
import { formatTimestamp } from "../../../utils/dateUtils";
import {
  getHorizontalBarOptions,
  deepMerge,
} from "../../../utils/chartOptions";

interface Props {
  data: {
    concurrentExecutions: number[];
    timestamps: string[];
  };
}

const ConcurrExecComponent = ({ data }: Props) => {
  const labels = data.timestamps.map(formatTimestamp);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Executions",
        data: data.concurrentExecutions,
        backgroundColor: "#60a5fa",
        borderRadius: 4,
      },
    ],
  };

  const baseOptions = getHorizontalBarOptions();
  const options: ChartOptions<"bar"> = deepMerge(baseOptions, {
    scales: {
      x: {
        title: {
          display: true,
          text: "Executions",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "End time",
        },
      },
    },
  });

  return (
    <ChartWrapper
      title="Total Concurrent Executions"
      description="Executions per 5min interval"
      chartType="bar"
      chartData={chartData}
      chartOptions={options}
    />
  );
};

export default ConcurrExecComponent;
