import { render, screen } from "@testing-library/react";
import RowComponent from "./Row";

describe("RowComponent", () => {
  const sampleProps = {
    functionName: "test-function",
    avgBilledDur: 123.456,
    coldStarts: 5,
    percentage: 25.678
  };

  test("renders all data points with correct formatting", () => {
    render(<RowComponent {...sampleProps} />);
    
    expect(screen.getByText("test-function")).toBeInTheDocument();
    expect(screen.getByText("123.46 ms")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("25.7%")).toBeInTheDocument();
  });

  test("handles zero and empty string values", () => {
    const zeroProps = {
      functionName: "",
      avgBilledDur: 0,
      coldStarts: 0,
      percentage: 0,
    };

    const { container } = render(<RowComponent {...zeroProps} />);

    const tableRow = container.querySelector(".table-row");
    expect(tableRow).toBeInTheDocument();

    if (tableRow) {
      const divs = tableRow.querySelectorAll("div");
      expect(divs).toHaveLength(4);

      expect(divs[0].textContent).toBe("");
      expect(divs[1].textContent).toBe("0 ms");
      expect(divs[2].textContent).toBe("0");
      expect(divs[3].textContent).toBe("0%");
    }
  });

  test("applies correct CSS classes", () => {
    const { container } = render(<RowComponent {...sampleProps} />);

    const tableRow = container.querySelector(".table-row");
    expect(tableRow).toBeInTheDocument();
    expect(tableRow).toHaveClass("table-row");
  });
});
