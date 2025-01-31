import { screen } from "@testing-library/react";
import { customRender } from "./test-utils";
import ColdStartsMetricsContainer from "./ColdStartsMetricsContainer";

interface RowProps {
  functionName: string;
  avgBilledDur: number;
  coldStarts: number;
  percentage: number;
}

// Mock the RowComponent to simplify testing
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
  // Test data that matches the FunctionData interface
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

  // Test basic rendering with data
  test("renders container with data", () => {
    customRender(<ColdStartsMetricsContainer data={mockData} />);

    // Verify header is present
    expect(
      screen.getByText("Cold Start Performance Metrics")
    ).toBeInTheDocument();

    // Verify column headers
    expect(screen.getByText("Function Name")).toBeInTheDocument();
    expect(screen.getByText("Average Billed Duration")).toBeInTheDocument();
    expect(screen.getByText("# Cold Starts")).toBeInTheDocument();
    expect(screen.getByText("% Cold Starts")).toBeInTheDocument();

    // Verify rows are rendered
    const rows = screen.getAllByTestId("row");
    expect(rows).toHaveLength(2);

    // Verify function names are displayed
    expect(screen.getByText("testFunction1")).toBeInTheDocument();
    expect(screen.getByText("testFunction2")).toBeInTheDocument();
  });

  // Test rendering with empty data
  test("renders container with empty data", () => {
    customRender(<ColdStartsMetricsContainer data={[]} />);

    // Verify header is still present
    expect(
      screen.getByText("Cold Start Performance Metrics")
    ).toBeInTheDocument();

    // Verify no rows are rendered
    const rows = screen.queryAllByTestId("row");
    expect(rows).toHaveLength(0);
  });
});
