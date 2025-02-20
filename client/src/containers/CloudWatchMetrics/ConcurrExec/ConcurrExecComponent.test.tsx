/// <reference types="@testing-library/jest-dom" />

import React from "react";
import { render, screen } from "@testing-library/react";
import ConcurrExecComponent from "../../../components/ConcurrExecComponent";

import type { Bar as ImportedBar } from "react-chartjs-2";
type BarProps = React.ComponentProps<typeof ImportedBar>;

jest.mock("react-chartjs-2", () => {
  const actualModule = jest.requireActual("react-chartjs-2");
  return {
    ...actualModule,
    Bar: (props: BarProps) => (
      <div data-testid="bar-chart">{JSON.stringify(props)}</div>
    ),
  };
});

describe("ConcurrExecComponent", () => {
  // Sample data for testing. 'concurrentExecutions' represents execution counts,
  // while 'timestamps' holds ISO date strings to test date formatting.
  const sampleData = {
    concurrentExecutions: [10, 20, 30],
    timestamps: [
      "2023-01-01T12:00:00Z",
      "2023-01-01T13:00:00Z",
      "2023-01-01T14:00:00Z",
    ],
  };

  // Test to check if the header and bar chart container render correctly.
  test("renders header and bar chart container", () => {
    // Render the component with sample data
    render(<ConcurrExecComponent data={sampleData} />);

    // Verify that the header text is displayed as expected
    expect(
      screen.getByText("Total Concurrent Executions (5min period)")
    ).toBeInTheDocument();

    // Verify that the mocked Bar chart container (identified by data-testid) is rendered
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  // Test to validate that the correct props are passed to the mocked Bar component.
  test("passes correct data props to Bar component", () => {
    // Render the component with the provided sample data
    render(<ConcurrExecComponent data={sampleData} />);

    // Retrieve the div representing the mocked Bar chart and parse its props from JSON
    const barChart = screen.getByTestId("bar-chart");
    const props = JSON.parse(barChart.textContent || "{}");

    // Calculate the expected labels by formatting each provided timestamp
    const expectedLabels = sampleData.timestamps.map((timestamp) => {
      const date = new Date(timestamp);
      // Format the date portion (e.g., "01/01/23")
      const formattedDate = date.toLocaleDateString([], {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      });
      // Format the time portion (e.g., "12:00 PM")
      const formattedTime = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${formattedDate} ${formattedTime}`;
    });

    // Assert that the chart labels match the expected formatted labels
    expect(props.data.labels).toEqual(expectedLabels);

    // Assert that the chart data array corresponds to the provided concurrent executions
    expect(props.data.datasets[0].data).toEqual(
      sampleData.concurrentExecutions
    );

    // Verify that the chart options are properly configured:
    // - The legend is hidden
    // - The x-axis title is correct
    // - The y-axis title is correct
    expect(props.options.indexAxis).toBe("y");
    expect(props.options.scales.x.title.text).toBe("Executions");
    expect(props.options.scales.y.title.text).toBe("End time");
    expect(props.options.plugins.legend.display).toBe(false);
  });
});
