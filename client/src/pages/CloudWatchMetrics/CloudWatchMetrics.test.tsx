import { screen, waitFor, act } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { customRender } from "../../utils/test-utils";
import CloudwatchContainer from "./CloudWatchMetrics";

// The following mocks replace the actual chart components with simple divs.
// This prevents canvas/rendering issues during tests and lets us focus on the logic.
jest.mock("./ConcurrentExecutions/ConcurrentExecutions", () => ({
  __esModule: true,
  default: () => <div>Concurrent Executions</div>,
}));

jest.mock("./Throttle/Throttle", () => ({
  __esModule: true,
  default: () => <div>Throttles</div>,
}));

jest.mock("./TotalDuration/TotalDuration", () => ({
  __esModule: true,
  default: () => <div>Duration</div>,
}));

jest.mock("./PercentileLatency/PercentileLatency", () => ({
  __esModule: true,
  default: () => <div>Percentile Latency</div>,
}));

// Global mock for the fetch API, used to simulate API calls throughout the tests.
global.fetch = jest.fn();

describe("CloudwatchContainer", () => {
  // Reset the global fetch mock before each test to avoid cross-test interference.
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  test("renders with initial data", async () => {
    // Mock implementations for successive API calls:
    // 1st API call: Returns an array with one function's metrics.
    // 2nd API call: Returns an empty object (could be for additional metadata or config).
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

    // Render the component asynchronously inside act to ensure proper state resolution.
    await act(async () => {
      customRender(<CloudwatchContainer />);
    });

    // Wait and verify:
    // - The container title ("CloudWatch Metrics") renders.
    // - The function selection dropdown (combobox) defaults to "testFunction".
    await waitFor(() => {
      expect(screen.getByText("CloudWatch Metrics")).toBeInTheDocument();
      expect(screen.getByRole("combobox")).toHaveValue("testFunction");
    });
  });

  test("handles fetch errors gracefully", async () => {
    // Spy on the console.log function; we expect errors to be logged.
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    // Simulate API failure by having fetch reject with an error.
    (fetch as jest.Mock)
      .mockImplementationOnce(() => Promise.reject("API error"))
      .mockImplementationOnce(() => Promise.reject("API error"));

    // Render the CloudwatchContainer, expecting that error conditions are handled.
    await act(async () => {
      customRender(<CloudwatchContainer />);
    });

    // Wait for the error to be logged in the console.
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    // Restore the original console.log behavior after the test.
    consoleSpy.mockRestore();
  });

  test("handles undefined percentile data", async () => {
    // Simulate an API response where percentile metrics are null.
    // First fetch returns standard function metric data.
    // Second fetch returns percentile data with all null values.
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

    // Render the CloudwatchContainer component using the above mocks.
    await act(async () => {
      customRender(<CloudwatchContainer />);
    });

    // Verify that the function selection dropdown is set to "testFunction".
    await waitFor(() => {
      expect(screen.getByRole("combobox")).toHaveValue("testFunction");
    });
    // Also verify that placeholder chart components are rendered for other metrics.
    expect(screen.getByText("Concurrent Executions")).toBeInTheDocument();
    expect(screen.getByText("Duration")).toBeInTheDocument();
  });

  test("handles function selection change", async () => {
    // Simulate API return with multiple functions.
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

    // Render the CloudwatchContainer component.
    await act(async () => {
      customRender(<CloudwatchContainer />);
    });

    // Locate the function selection dropdown (combobox).
    const select = (await screen.findByRole("combobox")) as HTMLSelectElement;

    // Simulate the user changing the selection to "testFunction2".
    await act(async () => {
      fireEvent.change(select, { target: { value: "testFunction2" } });
    });

    // Verify that the dropdown's value updates accordingly to the new selection.
    expect(select).toHaveValue("testFunction2");
  });
});
