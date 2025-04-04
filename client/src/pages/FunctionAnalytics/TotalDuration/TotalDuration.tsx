import ChartWrapper from "../../../components/Charts/ChartWrapper";
import { formatTimestamp } from "../../../utils/dateUtils";
import { getDoughnutOptions } from "../../../utils/chartOptions";

interface Props {
  data: {
    duration: number[];
    timestamps: string[];
  };
}

const TotalDurationComponent = ({ data }: Props) => {
  const labels = data.timestamps.map(formatTimestamp);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Duration",
        data: data.duration,
        backgroundColor: [
          "#2563eb",
          "#3b82f6",
          "#60a5fa",
          "#93c5fd",
          "#bfdbfe",
          "#2563eb",
          "#3b82f6",
          "#60a5fa",
          "#93c5fd",
          "#bfdbfe",
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
        borderRadius: 0,
      },
    ],
  };

  const options = getDoughnutOptions();

  return (
    <ChartWrapper
      title="Average Execution Duration"
      description="Duration per 5min interval (ms)"
      chartType="doughnut"
      chartData={chartData}
      chartOptions={options}
    />
  );
};

export default TotalDurationComponent;
