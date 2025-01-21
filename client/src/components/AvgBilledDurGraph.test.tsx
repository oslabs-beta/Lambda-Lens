/// <reference types="@testing-library/jest-dom" />

import React from "react";
import { render, screen } from "@testing-library/react";
import AvgBilledDurGraph from "./AvgBilledDurGraphComponent";
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

describe("AvgBilledDurGraph", () => {
  const sampleData = [
    { functionName: "functionA", avgBilledDur: 120 },
    { functionName: "functionB", avgBilledDur: 240 },
  ];

  test("renders header and chart container", () => {
    render(<AvgBilledDurGraph data={sampleData} />);

    expect(
      screen.getByText("Average Billed Duration (ms)")
    ).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  test("passes correct data props to Bar component", () => {
    render(<AvgBilledDurGraph data={sampleData} />);

    const barChart = screen.getByTestId("bar-chart");
    const props = JSON.parse(barChart.textContent || "{}");

    expect(props.data.labels).toEqual(["functionA", "functionB"]);
    expect(props.data.datasets[0].data).toEqual([120, 240]);
    expect(props.options.indexAxis).toBe("y");
    expect(props.options.scales.x.title.text).toBe("Milliseconds");
    expect(props.options.scales.y.title.text).toBe("Function Name");
  });
});
