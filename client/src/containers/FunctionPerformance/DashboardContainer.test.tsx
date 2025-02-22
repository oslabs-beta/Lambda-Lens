import { screen, waitFor, act, within } from "@testing-library/react";
import { customRender } from "../test-utils";
import DashboardContainer from "../DashboardContainer";

// We are replacing child components with simple mocks to isolate DashboardContainer's behavior.
// This prevents the complexity of the child components (like chart rendering) from interfering with the tests.
jest.mock("./ColdStartsGraph/ColdStartsGraphComponent", () => ({
  __esModule: true,
  default: () => <div>Cold Starts Graph</div>,
}));

jest.mock("../ColdStartsMetricsContainer", () => ({
  __esModule: true,
  default: () => <div>Cold Starts Metrics</div>,
}));

jest.mock("../ChatContainer", () => ({
  __esModule: true,
  default: () => <div>Chat Container</div>,
}));

// Mock the Average Billed Duration Graph by simulating a component that renders a header and a sorted list.
jest.mock("./AvgBilledDurGraph/AvgBilledDurGraphComponent", () => {
  return function AvgBilledDurGraphMock(props: {
    data: Array<{
      functionName: string;
      avgBilledDur: number;
      numColdStarts: number;
      percentColdStarts: number;
    }>;
  }) {
    return (
      <div>
        <h2>Average Billed Duration Graph</h2>
        <ul data-testid="avg-billed-list">
          {props.data.map((item) => (
            <li data-testid="avg-billed-item" key={item.functionName}>
              {item.functionName} - {item.percentColdStarts}
            </li>
          ))}
        </ul>
      </div>
    );
  };
});

// Override the global fetch API to simulate network requests and responses.
global.fetch = jest.fn();

describe("DashboardContainer", () => {
  beforeEach(() => {
    // Clear any previous calls and reset mocks before each test to ensure test isolation.
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  test("renders the dashboard with initial data", async () => {
    // Simulate a successful API call with sample dashboard data.
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          functionName: "testFunction",
          avgBilledDur: 100,
          numColdStarts: 5,
          percentColdStarts: 10,
        },
      ],
    });

    // Render the DashboardContainer which triggers the initial fetch.
    customRender(<DashboardContainer />);

    // Check that the main heading for the dashboard is present.
    expect(screen.getByText("Function Performance")).toBeInTheDocument();

    // Wait for all mocked child components to be rendered with the actual data.
    await waitFor(() => {
      expect(screen.getByText("Cold Starts Graph")).toBeInTheDocument();
      expect(screen.getByText("Cold Starts Metrics")).toBeInTheDocument();
      expect(
        screen.getByText("Average Billed Duration Graph")
      ).toBeInTheDocument();
      expect(screen.getByText("Chat Container")).toBeInTheDocument();
    });
  });

  test("handles fetch errors gracefully", async () => {
    // Spy on console.log to capture the error logging.
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    // Simulate a failed API call by rejecting the fetch promise.
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    // Render the DashboardContainer which should handle the error internally.
    customRender(<DashboardContainer />);

    // Wait until an error is logged to the console. The error should be an instance of Error.
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    // Restore console.log to its original implementation.
    consoleSpy.mockRestore();
  });

  test("refreshes data when refresh button is clicked", async () => {
    // Simulate two successive API calls:
    // - The first call returns the initial data.
    // - The second call returns refreshed data after the refresh button is clicked.
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            functionName: "testFunction",
            avgBilledDur: 100,
            numColdStarts: 5,
            percentColdStarts: 10,
          },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            functionName: "testFunction2",
            avgBilledDur: 200,
            numColdStarts: 10,
            percentColdStarts: 20,
          },
        ],
      });

    // Render the DashboardContainer, which makes the first API call.
    customRender(<DashboardContainer />);

    // Wait for the initial load to complete by checking for a known element.
    await screen.findByText("Cold Starts Graph");

    // Get the refresh button from the DOM.
    const refreshButton = screen.getByRole("button", { name: /refresh/i });

    // Simulate clicking the refresh button to trigger a data refresh.
    await act(async () => {
      refreshButton.click();
    });

    // Wait until the second API call has been made.
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  test("sorts data by percentColdStarts descending and shows top 5 in the DOM", async () => {
    // Define a set of test data with varying percentColdStarts values.
    const mockData = [
      {
        functionName: "f1",
        avgBilledDur: 111,
        numColdStarts: 3,
        percentColdStarts: 10,
      },
      {
        functionName: "f2",
        avgBilledDur: 222,
        numColdStarts: 6,
        percentColdStarts: 60,
      },
      {
        functionName: "f3",
        avgBilledDur: 333,
        numColdStarts: 9,
        percentColdStarts: 30,
      },
      {
        functionName: "f4",
        avgBilledDur: 444,
        numColdStarts: 12,
        percentColdStarts: 80,
      },
      {
        functionName: "f5",
        avgBilledDur: 555,
        numColdStarts: 15,
        percentColdStarts: 50,
      },
    ];

    // Simulate a successful fetch that returns the test dataset.
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    // Render the container with the test data.
    customRender(<DashboardContainer />);

    // Wait until the Average Billed Duration Graph component renders its sorted list.
    await waitFor(() => {
      // Retrieve the list element containing the sorted items.
      const list = screen.getByTestId("avg-billed-list");
      // Get all list items rendered by the mocked AvgBilledDurGraph component.
      const items = within(list).getAllByTestId("avg-billed-item");
      // Extract text content from each item.
      const textValues = items.map((li) => li.textContent);

      // Assert that the items are sorted in descending order by percentColdStarts.
      expect(textValues).toEqual([
        "f4 - 80",
        "f2 - 60",
        "f5 - 50",
        "f3 - 30",
        "f1 - 10",
      ]);
    });
  });

  test("toggles the clicked state off after 1 second", async () => {
    // Use fake timers to control time-based behavior in the test.
    jest.useFakeTimers();

    // Simulate a successful fetch call with sample data.
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [
        {
          functionName: "exampleFunction",
          avgBilledDur: 100,
          numColdStarts: 5,
          percentColdStarts: 10,
        },
      ],
    });

    // Render the DashboardContainer which initiates the API call.
    customRender(<DashboardContainer />);

    // Wait for the component to render the Cold Starts Graph, ensuring the UI is loaded.
    await screen.findByText("Cold Starts Graph");

    // Locate the refresh button which triggers the UI 'clicked' state.
    const refreshButton = screen.getByRole("button", { name: /refresh/i });

    // Simulate a click on the refresh button. This should add the "clicked" CSS class.
    await act(async () => {
      refreshButton.click();
    });

    // Verify that the refresh button now has the "clicked" class, indicating its active state.
    expect(refreshButton).toHaveClass("clicked");

    // Advance the timers by 1 second to simulate the timeout for the "clicked" state.
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Confirm that the "clicked" class is removed after the timeout.
    expect(refreshButton).not.toHaveClass("clicked");

    // Restore real timers to avoid side effects in other tests.
    jest.useRealTimers();
  });
});
