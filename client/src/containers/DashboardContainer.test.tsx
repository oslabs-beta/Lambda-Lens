import { screen, waitFor, act, within } from "@testing-library/react";
import { customRender } from "./test-utils";
import DashboardContainer from "./DashboardContainer";

jest.mock("../components/ColdStartsGraphComponent", () => ({
  __esModule: true,
  default: () => <div>Cold Starts Graph</div>,
}));

jest.mock("./ColdStartsMetricsContainer", () => ({
  __esModule: true,
  default: () => <div>Cold Starts Metrics</div>,
}));

jest.mock("./ChatContainer", () => ({
  __esModule: true,
  default: () => <div>Chat Container</div>,
}));

jest.mock("../components/AvgBilledDurGraphComponent", () => {
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

global.fetch = jest.fn();

describe("DashboardContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  test("renders the dashboard with initial data", async () => {
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

    customRender(<DashboardContainer />);

    expect(screen.getByText("Function Performance")).toBeInTheDocument();

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
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    customRender(<DashboardContainer />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  test("refreshes data when refresh button is clicked", async () => {
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

    customRender(<DashboardContainer />);

    await screen.findByText("Cold Starts Graph");

    const refreshButton = screen.getByRole("button", { name: /refresh/i });

    await act(async () => {
      refreshButton.click();
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  test("sorts data by percentColdStarts descending and shows top 5 in the DOM", async () => {
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

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    customRender(<DashboardContainer />);

    await waitFor(() => {
      const list = screen.getByTestId("avg-billed-list");
      const items = within(list).getAllByTestId("avg-billed-item");
      const textValues = items.map((li) => li.textContent);

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
    jest.useFakeTimers();

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

    customRender(<DashboardContainer />);

    await screen.findByText("Cold Starts Graph");

    const refreshButton = screen.getByRole("button", { name: /refresh/i });

    await act(async () => {
      refreshButton.click();
    });

    expect(refreshButton).toHaveClass("clicked");

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(refreshButton).not.toHaveClass("clicked");

    jest.useRealTimers();
  });
});
