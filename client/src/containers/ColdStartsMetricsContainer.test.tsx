import { screen } from "@testing-library/react";
import { customRender } from "./test-utils";
import ColdStartsMetricsContainer from "./ColdStartsMetricsContainer";

interface RowProps {
  functionName: string;
  avgBilledDur: number;
  coldStarts: number;
  percentage: number;
}

// The RowComponent is mocked to simplify the tests and to isolate the container's behavior.
// Instead of rendering the full implementation of RowComponent, it renders a simple div with a test id.
// This allows the test to verify the container's logic without being coupled to the RowComponent's internals.
jest.mock("../components/RowComponent", () => ({
  __esModule: true,
  default: (props: RowProps) => (
    <div data-testid="row">
      <span>{props.functionName}</span>
      <span>{props.avgBilledDur}</span>
      <span>{props.coldStarts}</span>
      <span>{props.percentage}</span>
    </div>
  ),
}));

describe("ColdStartsMetricsContainer", () => {
  // Define sample test data that matches the expected structure (FunctionData interface).
  // Each object represents metrics for a specific function.
  const mockData = [
    {
      functionName: "testFunction1",
      avgBilledDur: 100,
      numColdStarts: 5,
      percentColdStarts: 10,
    },
    {
      functionName: "testFunction2",
      avgBilledDur: 200,
      numColdStarts: 10,
      percentColdStarts: 20,
    },
  ];

  test("renders container with data", () => {
    // Render the ColdStartsMetricsContainer with the sample data.
    customRender(<ColdStartsMetricsContainer data={mockData} />);

    // Verify that the main header, indicating the type of metrics, is visible.
    expect(
      screen.getByText("Cold Start Performance Metrics")
    ).toBeInTheDocument();

    // Verify that column headers are present, ensuring table structure is correct.
    expect(screen.getByText("Function Name")).toBeInTheDocument();
    expect(screen.getByText("Average Billed Duration")).toBeInTheDocument();
    expect(screen.getByText("# Cold Starts")).toBeInTheDocument();
    expect(screen.getByText("% Cold Starts")).toBeInTheDocument();

    // Verify that each Row (mocked) is rendered according to the number of data items.
    const rows = screen.getAllByTestId("row");
    expect(rows).toHaveLength(2);

    // Confirm that specific function names are rendered in the rows.
    expect(screen.getByText("testFunction1")).toBeInTheDocument();
    expect(screen.getByText("testFunction2")).toBeInTheDocument();
  });

  test("renders container with empty data", () => {
    // Render the container with an empty array to simulate no available data.
    customRender(<ColdStartsMetricsContainer data={[]} />);

    // The main header should always be visible, regardless of data content.
    expect(
      screen.getByText("Cold Start Performance Metrics")
    ).toBeInTheDocument();

    // Since there is no data, no row should be rendered.
    const rows = screen.queryAllByTestId("row");
    expect(rows).toHaveLength(0);
  });
});
