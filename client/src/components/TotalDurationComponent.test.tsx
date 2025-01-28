import React from "react";
import { render, screen } from "@testing-library/react";
import TotalDurationComponent from "./TotalDurationComponent";

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

describe("TotalDurationComponent", () => {
  const sampleData = {
    duration: [120, 240, 360],
    timestamps: [
      "2023-01-01T12:00:00Z",
      "2023-01-01T13:00:00Z",
      "2023-01-01T14:00:00Z",
    ],
  };

  test("renders header and doughnut chart container", () => {
    render(<TotalDurationComponent data={sampleData} />);

    // Check that the header is rendered
    expect(
      screen.getByText("Average Execution Duration (5min period)")
    ).toBeInTheDocument();

    // Check that the mocked Doughnut component is rendered
    expect(screen.getByTestId("doughnut-chart")).toBeInTheDocument();
  });

  test("passes correct data props to Doughnut component", () => {
    render(<TotalDurationComponent data={sampleData} />);

    const doughnutChart = screen.getByTestId("doughnut-chart");
    const props = JSON.parse(doughnutChart.textContent || "{}");

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
    expect(props.data.datasets[0].data).toEqual(sampleData.duration);

    // Verify background colors
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

    // Validate chart options
    expect(props.options.plugins.legend.display).toBe(true);
    expect(props.options.plugins.legend.position).toBe("left");
    expect(props.options.plugins.legend.labels.boxWidth).toBe(20);
    expect(props.options.plugins.legend.labels.padding).toBe(10);
  });
});
