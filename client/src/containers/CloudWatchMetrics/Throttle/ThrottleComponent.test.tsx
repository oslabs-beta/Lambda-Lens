import { render, screen } from "@testing-library/react";
import ThrottleComponent from "./ThrottleComponent";
import { Line } from "react-chartjs-2";

// Mock the Line component to avoid rendering an actual chart during tests.
// This allows us to inspect the props being passed to the Line component without dealing with chart internals.
jest.mock("react-chartjs-2", () => ({
  Line: jest.fn(() => null),
}));

// Sample data simulating throttle count and corresponding timestamps.
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
    // Clear any previous calls to the mocked Line component to ensure each test starts with a clean state.
    (Line as jest.Mock).mockClear();
  });

  it("renders without crashing", () => {
    // Render the ThrottleComponent using the sample data.
    render(<ThrottleComponent data={sampleData} />);
    // Confirm that the component renders the expected heading text.
    expect(
      screen.getByText("Total Number of Throttles (5min period)")
    ).toBeInTheDocument();
  });

  it("renders the Line chart with correct data and options", () => {
    // Render the component to capture the data and configuration passed to the Line chart.
    render(<ThrottleComponent data={sampleData} />);

    // Verify the mocked Line component is called exactly once.
    expect(Line).toHaveBeenCalledTimes(1);

    // Retrieve the properties passed to the Line component from its first call.
    const lineProps = (Line as jest.Mock).mock.calls[0][0];

    // Validate that the 'data.labels' property contains correctly formatted timestamp labels.
    expect(lineProps.data.labels).toEqual([
      "01/27/25 10:00 AM",
      "01/27/25 10:05 AM",
      "01/27/25 10:10 AM",
      "01/27/25 10:15 AM",
      "01/27/25 10:20 AM",
    ]);

    // Check that the 'data.datasets' array includes a dataset with the provided throttle values and style options.
    expect(lineProps.data.datasets).toEqual([
      {
        label: "Throttles",
        data: sampleData.throttles,
        borderColor: ["#437990"],
        fill: false,
      },
    ]);

    // Verify that the options provided to the chart set the correct titles and disable the legend display.
    expect(lineProps.options).toHaveProperty("scales.x.title.text", "End time");
    expect(lineProps.options).toHaveProperty(
      "scales.y.title.text",
      "Throttles"
    );
    expect(lineProps.options.plugins.legend.display).toBe(false);
  });

  it("formats timestamps correctly", () => {
    // Render the component again to specifically test the timestamp formatting.
    render(<ThrottleComponent data={sampleData} />);
    // Retrieve the Line component props and ensure the labels match the expected format.
    const lineProps = (Line as jest.Mock).mock.calls[0][0];
    expect(lineProps.data.labels).toEqual([
      "01/27/25 10:00 AM",
      "01/27/25 10:05 AM",
      "01/27/25 10:10 AM",
      "01/27/25 10:15 AM",
      "01/27/25 10:20 AM",
    ]);
  });
});
