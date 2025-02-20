import React from "react";
import { render, screen } from "@testing-library/react";
import TotalDurationComponent from "../../../components/TotalDurationComponent";

import type { Doughnut as ImportedDoughnut } from "react-chartjs-2";
type DoughnutProps = React.ComponentProps<typeof ImportedDoughnut>;

jest.mock("react-chartjs-2", () => {
  const actualModule = jest.requireActual("react-chartjs-2");
  return {
    ...actualModule,
    Doughnut: (props: DoughnutProps) => (
      <div data-testid="doughnut-chart">{JSON.stringify(props)}</div>
    ),
  };
});

// Test suite for TotalDurationComponent which renders a doughnut chart
// to visualize execution duration data.
describe("TotalDurationComponent", () => {
  // Sample data representing execution durations and corresponding timestamps.
  const sampleData = {
    duration: [120, 240, 360],
    timestamps: [
      "2023-01-01T12:00:00Z",
      "2023-01-01T13:00:00Z",
      "2023-01-01T14:00:00Z",
    ],
  };

  test("renders header and doughnut chart container", () => {
    // Render the TotalDurationComponent with the sample data.
    render(<TotalDurationComponent data={sampleData} />);

    // Verify that the header text is rendered. This ensures that the component's title
    // ("Average Execution Duration (5min period)") is visible to the user.
    expect(
      screen.getByText("Average Execution Duration (5min period)")
    ).toBeInTheDocument();

    // Verify that the mocked Doughnut component is rendered.
    // The doughnut chart is identified by the data-testid "doughnut-chart".
    expect(screen.getByTestId("doughnut-chart")).toBeInTheDocument();
  });

  test("passes correct data props to Doughnut component", () => {
    // Render the component again with the sample data.
    render(<TotalDurationComponent data={sampleData} />);

    // Retrieve the mocked Doughnut chart element by its test id.
    // The component uses JSON.stringify to output its props.
    const doughnutChart = screen.getByTestId("doughnut-chart");
    const props = JSON.parse(doughnutChart.textContent || "{}");

    // Build the expected labels by transforming each ISO timestamp into a user-friendly string.
    // The formatting includes a 2-digit year, month, day, and a 2-digit hour and minute.
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

    // Validate that the doughnut chart's labels (x-axis) match the expected formatted timestamps.
    expect(props.data.labels).toEqual(expectedLabels);

    // Confirm that the Doughnut chart's data array matches the duration values from sampleData.
    expect(props.data.datasets[0].data).toEqual(sampleData.duration);

    // Verify that the background colors for the data segments are correctly set.
    // This array of hex color codes defines the colors of the chart segments.
    expect(props.data.datasets[0].backgroundColor).toEqual([
      "#437990",
      "#4c88a1",
      "#5796af",
      "#68a0b7",
      "#79abc0",
      "#8bb6c8",
      "#9cc1d0",
      "#adccd8",
      "#bfd7e0",
      "#d0e1e9",
    ]);

    // Validate chart options:
    // - The legend should be displayed.
    // - The legend should be positioned on the left.
    // - Legend labels should have a box width of 20 and padding of 10.
    expect(props.options.plugins.legend.display).toBe(true);
    expect(props.options.plugins.legend.position).toBe("left");
    expect(props.options.plugins.legend.labels.boxWidth).toBe(20);
    expect(props.options.plugins.legend.labels.padding).toBe(10);
  });
});
