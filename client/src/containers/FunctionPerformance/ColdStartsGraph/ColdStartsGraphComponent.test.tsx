import React from "react";
import { render, screen } from "@testing-library/react";
import ColdStartsGraphComponent from "./ColdStartsGraphComponent";

import type { Doughnut as ImportedDoughnut } from "react-chartjs-2";

type DoughnutProps = React.ComponentProps<typeof ImportedDoughnut>;

// Mock the Doughnut component from react-chartjs-2
jest.mock("react-chartjs-2", () => {
  const actualModule = jest.requireActual("react-chartjs-2");
  return {
    ...actualModule,
    Doughnut: (props: DoughnutProps) => (
      <div data-testid="doughnut-chart">{JSON.stringify(props)}</div>
    ),
  };
});

describe("ColdStartsGraphComponent", () => {
  const sampleData = [
    { functionName: "functionA", numColdStarts: 5 },
    { functionName: "functionB", numColdStarts: 3 },
  ];

  test("renders header and doughnut chart", () => {
    render(<ColdStartsGraphComponent data={sampleData} />);

    // Check that the header is rendered
    expect(screen.getByText("Total Cold Starts")).toBeInTheDocument();

    // Check that the mocked Doughnut component is rendered
    expect(screen.getByTestId("doughnut-chart")).toBeInTheDocument();
  });

  test("passes correct data props to Doughnut component", () => {
    render(<ColdStartsGraphComponent data={sampleData} />);

    const doughnutChart = screen.getByTestId("doughnut-chart");
    const props = JSON.parse(doughnutChart.textContent || "{}");

    // Validate that labels and data match our sampleData
    expect(props.data.labels).toEqual(["functionA", "functionB"]);
    expect(props.data.datasets[0].data).toEqual([5, 3]);

    // Verify options settings for legend display and position
    expect(props.options.plugins.legend.display).toBe(true);
    expect(props.options.plugins.legend.position).toBe("left");
    expect(props.options.plugins.legend.labels.color).toBe("#A2A2A2");
  });
});
