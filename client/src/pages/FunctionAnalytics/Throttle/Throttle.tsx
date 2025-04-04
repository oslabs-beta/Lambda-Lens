import { ChartOptions } from "chart.js";
import ChartWrapper from "../../../components/Charts/ChartWrapper";
import { formatTimestamp } from "../../../utils/dateUtils";
import { getLineOptions, deepMerge } from "../../../utils/chartOptions";

interface Props {
  data: {
    throttles: number[];
    timestamps: string[];
  };
}

const ThrottleComponent = ({ data }: Props) => {
  const labels = data.timestamps.map(formatTimestamp);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Throttles",
        data: data.throttles,
        borderColor: "#60a5fa",
        backgroundColor: "#60a5fa",
        borderRadius: 0,
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const baseOptions = getLineOptions();
  const options: ChartOptions<"line"> = deepMerge(baseOptions, {
    scales: {
      x: {
        title: {
          display: true,
          text: "End time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Throttles",
        },
      },
    },
  });

  return (
    <ChartWrapper
      title="Total Number of Throttles"
      description="Throttles per 5min interval"
      chartType="line"
      chartData={chartData}
      chartOptions={options}
    />
  );
};

export default ThrottleComponent;
