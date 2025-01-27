// src/components/ThrottleComponent.test.tsx

import { render, screen } from "@testing-library/react";
import ThrottleComponent from "./ThrottleComponent";
import { Line } from "react-chartjs-2";

// Mock the Line component
jest.mock("react-chartjs-2", () => ({
  Line: jest.fn(() => null),
}));

const sampleData = {
  throttles: [10, 20, 30, 40, 50],
  timestamps: [
    "2025-01-27T10:00:00Z",
    "2025-01-27T10:05:00Z",
    "2025-01-27T10:10:00Z",
    "2025-01-27T10:15:00Z",
    "2025-01-27T10:20:00Z",
  ],
};

describe("ThrottleComponent", () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    (Line as jest.Mock).mockClear();
  });

  it("renders without crashing", () => {
    render(<ThrottleComponent data={sampleData} />);
    expect(
      screen.getByText("Total Number of Throttles (5min period)")
    ).toBeInTheDocument();
  });

  it("renders the Line chart with correct data and options", () => {
    render(<ThrottleComponent data={sampleData} />);

    // Ensure the Line component is called once
    expect(Line).toHaveBeenCalledTimes(1);

    // Extract the props passed to the Line component
    const lineProps = (Line as jest.Mock).mock.calls[0][0];

    // Check if 'data' prop is correctly formatted
    expect(lineProps.data.labels).toEqual([
      "01/27/25 10:00 AM",
      "01/27/25 10:05 AM",
      "01/27/25 10:10 AM",
      "01/27/25 10:15 AM",
      "01/27/25 10:20 AM",
    ]);

    expect(lineProps.data.datasets).toEqual([
      {
        label: "Throttles",
        data: sampleData.throttles,
        borderColor: ["#437990"],
        fill: false,
      },
    ]);

    // Optionally, check if 'options' prop contains expected configuration
    expect(lineProps.options).toHaveProperty("scales.x.title.text", "End time");
    expect(lineProps.options).toHaveProperty(
      "scales.y.title.text",
      "Throttles"
    );
    expect(lineProps.options.plugins.legend.display).toBe(false);
  });

  it("formats timestamps correctly", () => {
    render(<ThrottleComponent data={sampleData} />);
    const lineProps = (Line as jest.Mock).mock.calls[0][0];
    expect(lineProps.data.labels).toEqual([
      "01/27/25 10:00 AM",
      "01/27/25 10:05 AM",
      "01/27/25 10:10 AM",
      "01/27/25 10:15 AM",
      "01/27/25 10:20 AM",
    ]);
  });

  it("matches the snapshot", () => {
    const { asFragment } = render(<ThrottleComponent data={sampleData} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
