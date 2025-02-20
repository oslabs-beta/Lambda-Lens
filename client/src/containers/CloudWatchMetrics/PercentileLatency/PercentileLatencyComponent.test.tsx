import React from "react";
import { render, screen } from "@testing-library/react";
import PercentileLatencyComponent from "../../../components/PercentileLatencyComponent";

import type { Bar as ImportedBar } from "react-chartjs-2";

type BarProps = React.ComponentProps<typeof ImportedBar>;

// Mock the Bar component from react-chartjs-2 to simplify chart rendering.
// This mock displays a div with a test id and the received props as JSON.
jest.mock("react-chartjs-2", () => {
  const actualModule = jest.requireActual("react-chartjs-2");
  return {
    ...actualModule,
    Bar: (props: BarProps) => (
      <div data-testid="bar-chart">{JSON.stringify(props)}</div>
    ),
  };
});

describe("PercentileLatencyComponent", () => {
  // Define sample data for testing the component.
  const sampleData = {
    p90: [120, 130, 110],
    p95: [150, 160, 140],
    p99: [200, 210, 190],
  };

  // Test to ensure the header and the chart container render correctly.
  test("renders header and bar chart", () => {
    render(<PercentileLatencyComponent data={sampleData} />);

    // Check that the header "Percentile Latency (ms)" is present.
    expect(screen.getByText("Percentile Latency (ms)")).toBeInTheDocument();

    // Confirm that the Bar component (mocked) is rendered by checking its test id.
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  // Test to verify that the correct props are passed to the Bar component.
  test("passes correct data props to Bar component", () => {
    render(<PercentileLatencyComponent data={sampleData} />);

    // Retrieve the rendered mocked Bar component.
    const barChart = screen.getByTestId("bar-chart");
    // Parse the JSON output to access the props passed to the Bar component.
    const props = JSON.parse(barChart.textContent || "{}");

    // Validate that the labels for the chart are correctly set.
    expect(props.data.labels).toEqual(["Percentiles"]);

    // Validate that three datasets are provided (for p90, p95, and p99).
    expect(props.data.datasets).toHaveLength(3);

    // Check dataset for P90 latency.
    expect(props.data.datasets[0].label).toBe("P90 Latency (ms)");
    expect(props.data.datasets[0].data).toEqual([120]);
    expect(props.data.datasets[0].backgroundColor).toBe("#4c88a1");

    // Check dataset for P95 latency.
    expect(props.data.datasets[1].label).toBe("P95 Latency (ms)");
    expect(props.data.datasets[1].data).toEqual([150]);
    expect(props.data.datasets[1].backgroundColor).toBe("#79abc0");

    // Check dataset for P99 latency.
    expect(props.data.datasets[2].label).toBe("P99 Latency (ms)");
    expect(props.data.datasets[2].data).toEqual([200]);
    expect(props.data.datasets[2].backgroundColor).toBe("#adccd8");

    // Validate chart configuration options.
    // Ensure the chart renders horizontally (indexAxis is "y"),
    // the x-axis title is visible and correctly labeled,
    // and that the x-axis grid lines are disabled.
    expect(props.options.indexAxis).toBe("y");
    expect(props.options.scales.x.title.display).toBe(true);
    expect(props.options.scales.x.title.text).toBe("Latency (ms)");
    expect(props.options.scales.x.grid.display).toBe(false);
  });
});
