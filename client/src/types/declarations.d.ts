// src/declaration.d.ts

import "@testing-library/jest-dom";

declare module "react-chartjs-2" {
  import { ChartOptions, ChartData as OriginalChartData } from "chart.js";

  export interface ChartData extends OriginalChartData {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string | string[];
      borderRadius: number;
    }[];
  }

  export interface BarProps {
    data: ChartData;
    options: ChartOptions;
    className?: string;
  }

  export const Bar: React.FC<BarProps>;
}

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare module "*.gif" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.less" {
  const content: { [className: string]: string };
  export default content;
}
