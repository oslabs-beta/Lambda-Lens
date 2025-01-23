import { render, screen } from "@testing-library/react";
import RowComponent from "./RowComponent";

describe("RowComponent", () => {
  const sampleProps = {
    functionName: "processData",
    avgBilledDur: 250,
    coldStarts: 10,
    percentage: 20,
  };

  test("renders all props correctly", () => {
    render(<RowComponent {...sampleProps} />);

    // Check that each prop is rendered in its respective div
    expect(screen.getByText("processData")).toBeInTheDocument();
    expect(screen.getByText("250 ms")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("20%")).toBeInTheDocument();
  });

  test("handles zero and empty string values", () => {
    const zeroProps = {
      functionName: "",
      avgBilledDur: 0,
      coldStarts: 0,
      percentage: 0,
    };

    const { container } = render(<RowComponent {...zeroProps} />);

    // Select the root div with class 'table-row'
    const tableRow = container.querySelector(".table-row");
    expect(tableRow).toBeInTheDocument();

    if (tableRow) {
      const divs = tableRow.querySelectorAll("div");
      expect(divs).toHaveLength(4);

      // Check that each div contains the correct content
      expect(divs[0].textContent).toBe(""); // functionName
      expect(divs[1].textContent).toBe("0 ms"); // avgBilledDur
      expect(divs[2].textContent).toBe("0"); // coldStarts
      expect(divs[3].textContent).toBe("0%"); // percentage
    }
  });

  test("applies correct CSS classes", () => {
    const { container } = render(<RowComponent {...sampleProps} />);

    // Select the root div with class 'table-row'
    const tableRow = container.querySelector(".table-row");
    expect(tableRow).toBeInTheDocument();
    expect(tableRow).toHaveClass("table-row");
  });
});
