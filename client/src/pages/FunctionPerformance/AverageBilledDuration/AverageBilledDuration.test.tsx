/// <reference types="@testing-library/jest-dom" />

import React from "react";
import { render, screen } from "@testing-library/react";
import AvgBilledDurGraph from "./AverageBilledDuration";
import type { Bar as ImportedBar } from "react-chartjs-2";

type BarProps = React.ComponentProps<typeof ImportedBar>;

// Mock the react-chartjs-2 module to avoid rendering the actual chart,
// replacing the Bar component with a simple div that outputs the received props.
jest.mock("react-chartjs-2", () => {
  const actualModule = jest.requireActual("react-chartjs-2");
  return {
    ...actualModule,
    Bar: (props: BarProps) => (
      <div data-testid="bar-chart">{JSON.stringify(props)}</div>
    ),
  };
});

// Test suite for the AvgBilledDurGraph component
describe("AvgBilledDurGraph", () => {
  // Sample data for testing the component
  const sampleData = [
    { functionName: "functionA", avgBilledDur: 120 },
    { functionName: "functionB", avgBilledDur: 240 },
  ];

  // Verify that the header text and chart container are rendered correctly
  test("renders header and chart container", () => {
    render(<AvgBilledDurGraph data={sampleData} />);

    // Check for the existence of the header element
    expect(
      screen.getByText("Average Billed Duration (ms)")
    ).toBeInTheDocument();
    // Check for the mocked Bar chart container using its test id
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  // Verify that the component passes the expected props to the mocked Bar component
  test("passes correct data props to Bar component", () => {
    render(<AvgBilledDurGraph data={sampleData} />);

    // Retrieve the rendered mocked Bar component and parse its props.
    const barChart = screen.getByTestId("bar-chart");
    const props = JSON.parse(barChart.textContent || "{}");

    // Validate that the labels and dataset values are structured as expected
    expect(props.data.labels).toEqual(["functionA", "functionB"]);
    expect(props.data.datasets[0].data).toEqual([120, 240]);

    // Validate that chart options are correctly set
    expect(props.options.indexAxis).toBe("y");
    expect(props.options.scales.x.title.text).toBe("Milliseconds");
    expect(props.options.scales.y.title.text).toBe("Function Name");
  });
});
