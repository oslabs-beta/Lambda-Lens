// src/components/PercentileLatencyComponent.test.tsx

import React from "react";
import { render, screen } from "@testing-library/react";
import PercentileLatencyComponent from "./PercentileLatencyComponent";

import type { Bar as ImportedBar } from "react-chartjs-2";

type BarProps = React.ComponentProps<typeof ImportedBar>;

// Mock the Bar component from react-chartjs-2
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
  const sampleData = {
    p90: [120, 130, 110],
    p95: [150, 160, 140],
    p99: [200, 210, 190],
  };

  test("renders header and bar chart", () => {
    render(<PercentileLatencyComponent data={sampleData} />);

    // Check that the header is rendered
    expect(screen.getByText("Percentile Latency (ms)")).toBeInTheDocument();

    // Check that the mocked Bar component is rendered
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  test("passes correct data props to Bar component", () => {
    render(<PercentileLatencyComponent data={sampleData} />);

    const barChart = screen.getByTestId("bar-chart");
    const props = JSON.parse(barChart.textContent || "{}");

    // Validate that labels are set correctly
    expect(props.data.labels).toEqual(["Percentiles"]);

    // Validate that datasets are correctly mapped
    expect(props.data.datasets).toHaveLength(3);

    expect(props.data.datasets[0].label).toBe("P90 Latency (ms)");
    expect(props.data.datasets[0].data).toEqual([120]); // Updated expectation
    expect(props.data.datasets[0].backgroundColor).toBe("#4c88a1");

    expect(props.data.datasets[1].label).toBe("P95 Latency (ms)");
    expect(props.data.datasets[1].data).toEqual([150]); // Updated expectation
    expect(props.data.datasets[1].backgroundColor).toBe("#79abc0");

    expect(props.data.datasets[2].label).toBe("P99 Latency (ms)");
    expect(props.data.datasets[2].data).toEqual([200]); // Updated expectation
    expect(props.data.datasets[2].backgroundColor).toBe("#adccd8");

    // Validate chart options
    expect(props.options.indexAxis).toBe("y");
    expect(props.options.scales.x.title.display).toBe(true);
    expect(props.options.scales.x.title.text).toBe("Latency (ms)");
    expect(props.options.scales.x.grid.display).toBe(false);
  });
});
