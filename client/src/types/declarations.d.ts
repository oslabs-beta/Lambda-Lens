// Additional module declarations for our project.
// These declarations inform TypeScript about the shape of non-code assets and third-party modules
// that do not have their own type definitions.

import "@testing-library/jest-dom";

// Extends and defines types for the react-chartjs-2 library, which is used to integrate Chart.js
// components into React applications.
declare module "react-chartjs-2" {
  import { ChartOptions, ChartData as OriginalChartData } from "chart.js";

  // Extend the original ChartData interface with additional structure
  // so that charts in our application have a consistent data format.
  export interface ChartData extends OriginalChartData {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string | string[];
      borderRadius: number;
    }[];
  }

  // Define the properties expected by the Bar chart component.
  export interface BarProps {
    data: ChartData;
    options: ChartOptions;
    className?: string;
  }

  export const Bar: React.FC<BarProps>;
}

// These declarations enable TypeScript to correctly handle imported image files.
// When importing image assets (e.g., PNG, JPG, JPEG, GIF, SVG), TypeScript will treat them as strings,
// typically representing the path to the bundled asset.

// Declaration for PNG files.
declare module "*.png" {
  const value: string;
  export default value;
}

// Declaration for JPG files.
declare module "*.jpg" {
  const value: string;
  export default value;
}

// Declaration for JPEG files.
declare module "*.jpeg" {
  const value: string;
  export default value;
}

// Declaration for GIF files.
declare module "*.gif" {
  const value: string;
  export default value;
}

// Declaration for SVG files.
declare module "*.svg" {
  const value: string;
  export default value;
}

// These declarations allow us to import CSS, SCSS, and LESS files as modules.
// TypeScript will treat these files as objects mapping class names to unique string identifiers,
// which is useful for CSS Modules.

// Declaration for CSS files.
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

// Declaration for SCSS files.
declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

// Declaration for LESS files.
declare module "*.less" {
  const content: { [className: string]: string };
  export default content;
}
