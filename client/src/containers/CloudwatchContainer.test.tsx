import { screen, waitFor, act } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { customRender } from "./test-utils";
import CloudwatchContainer from "./CloudwatchContainer";

// Mock all chart components to avoid canvas rendering issues in tests
// Replace each with a simple div containing the component name
jest.mock("../components/ConcurrExecComponent", () => ({
  __esModule: true,
  default: () => <div>Concurrent Executions</div>,
}));

jest.mock("../components/ThrottleComponent", () => ({
  __esModule: true,
  default: () => <div>Throttles</div>,
}));

jest.mock("../components/TotalDurationComponent", () => ({
  __esModule: true,
  default: () => <div>Duration</div>,
}));

jest.mock("../components/PercentileLatencyComponent", () => ({
  __esModule: true,
  default: () => <div>Percentile Latency</div>,
}));

// Setup global fetch mock for API calls
global.fetch = jest.fn();

describe("CloudwatchContainer", () => {
  // Reset fetch mock before each test
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  // Test basic rendering with valid initial data
  test("renders with initial data", async () => {
    // Mock successful API responses
    (fetch as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                functionName: "testFunction",
                duration: [1],
                concurrentExecutions: [1],
                throttles: [1],
                timestamps: ["2024-01-01"],
              },
            ]),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        })
      );

    await act(async () => {
      customRender(<CloudwatchContainer />);
    });

    // Verify initial render state
    await waitFor(() => {
      expect(screen.getByText("CloudWatch Metrics")).toBeInTheDocument();
      expect(screen.getByRole("combobox")).toHaveValue("testFunction");
    });
  });

  // Test error handling for failed API calls
  test("handles fetch errors gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    // Mock failed API calls
    (fetch as jest.Mock)
      .mockImplementationOnce(() => Promise.reject("API error"))
      .mockImplementationOnce(() => Promise.reject("API error"));

    await act(async () => {
      customRender(<CloudwatchContainer />);
    });

    // Verify error was logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    consoleSpy.mockRestore();
  });

  // Test handling of null/undefined percentile data
  test("handles undefined percentile data", async () => {
    // Mock API response with null percentile values
    (fetch as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                functionName: "testFunction",
                duration: [1],
                concurrentExecutions: [1],
                throttles: [1],
                timestamps: ["2024-01-01"],
              },
            ]),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              testFunction: {
                percentiles: {
                  p90: null,
                  p95: null,
                  p99: null,
                },
              },
            }),
        })
      );

    await act(async () => {
      customRender(<CloudwatchContainer />);
    });

    // Verify component renders with null data
    await waitFor(() => {
      expect(screen.getByRole("combobox")).toHaveValue("testFunction");
    });
    expect(screen.getByText("Concurrent Executions")).toBeInTheDocument();
    expect(screen.getByText("Duration")).toBeInTheDocument();
  });

  // Test function selection dropdown behavior
  test("handles function selection change", async () => {
    // Mock API response with multiple functions
    (fetch as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                functionName: "testFunction1",
                duration: [1],
                concurrentExecutions: [1],
                throttles: [1],
                timestamps: ["2024-01-01"],
              },
              {
                functionName: "testFunction2",
                duration: [2],
                concurrentExecutions: [2],
                throttles: [2],
                timestamps: ["2024-01-02"],
              },
            ]),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        })
      );

    await act(async () => {
      customRender(<CloudwatchContainer />);
    });

    const select = (await screen.findByRole("combobox")) as HTMLSelectElement;

    // Simulate user selecting a different function
    await act(async () => {
      fireEvent.change(select, { target: { value: "testFunction2" } });
    });

    // Verify selection changed
    expect(select).toHaveValue("testFunction2");
  });
});
