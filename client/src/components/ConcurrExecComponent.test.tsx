/// <reference types="@testing-library/jest-dom" />

import React from "react";
import { render, screen } from "@testing-library/react";
import ConcurrExecComponent from "./ConcurrExecComponent";

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
  const sampleData = {
    concurrentExecutions: [10, 20, 30],
    // Use ISO strings or recognizable dates to test formatting
    timestamps: [
      "2023-01-01T12:00:00Z",
      "2023-01-01T13:00:00Z",
      "2023-01-01T14:00:00Z",
    ],
  };

  test("renders header and bar chart container", () => {
    render(<ConcurrExecComponent data={sampleData} />);

    // Check that the header is rendered
    expect(
      screen.getByText("Total Concurrent Executions (5min period)")
    ).toBeInTheDocument();

    // Check that the mocked Bar component is rendered
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  test("passes correct data props to Bar component", () => {
    render(<ConcurrExecComponent data={sampleData} />);

    const barChart = screen.getByTestId("bar-chart");
    const props = JSON.parse(barChart.textContent || "{}");

    // Check that labels are formatted timestamps
    const expectedLabels = sampleData.timestamps.map((timestamp) => {
      const date = new Date(timestamp);
      const formattedDate = date.toLocaleDateString([], {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      });
      const formattedTime = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${formattedDate} ${formattedTime}`;
    });

    expect(props.data.labels).toEqual(expectedLabels);

    // Verify the data array
    expect(props.data.datasets[0].data).toEqual(
      sampleData.concurrentExecutions
    );

    // Verify a few options to ensure they're passed correctly
    expect(props.options.indexAxis).toBe("y");
    expect(props.options.scales.x.title.text).toBe("Executions");
    expect(props.options.scales.y.title.text).toBe("End time");
    expect(props.options.plugins.legend.display).toBe(false);
  });
});
