import React from "react";
import { Bar, Line, Doughnut, ChartData } from "react-chartjs-2";
import { ChartOptions } from "chart.js";

type SupportedChartType = "bar" | "line" | "doughnut";

interface ChartWrapperProps {
  title: string;
  description: string;
  chartType: SupportedChartType;
  chartData: ChartData;
  chartOptions: ChartOptions<SupportedChartType>;
  containerClassName?: string;
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({
  title,
  description,
  chartType,
  chartData,
  chartOptions,
  containerClassName = "flex-1 min-h-0",
}) => {
  const renderChart = () => {
    const commonProps = {
      className: "w-full h-full",
    };

    switch (chartType) {
      case "bar":
        return (
          <Bar
            {...commonProps}
            data={chartData}
            options={chartOptions as ChartOptions<"bar">}
          />
        );
      case "line":
        return (
          <Line
            {...commonProps}
            data={chartData}
            options={chartOptions as ChartOptions<"line">}
          />
        );
      case "doughnut":
        return (
          <Doughnut
            {...commonProps}
            data={chartData}
            options={chartOptions as ChartOptions<"doughnut">}
          />
        );
      default:
        console.error("Unknown chart type:", chartType);
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-dark-text-prim">
        {title}
      </h2>
      <p className="text-sm text-gray-500 dark:text-dark-text-sec mb-4">
        {description}
      </p>
      <div className={containerClassName}>{renderChart()}</div>
    </div>
  );
};

export default ChartWrapper;
