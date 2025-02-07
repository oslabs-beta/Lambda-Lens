import { render, screen } from "@testing-library/react";
import RowComponent from "./RowComponent";

describe("RowComponent", () => {
  // Define sample props that represent typical, non-edge-case values.
  const sampleProps = {
    functionName: "processData",
    avgBilledDur: 250,
    coldStarts: 10,
    percentage: 20,
  };

  test("renders all props correctly", () => {
    // Render the component with normal values.
    render(<RowComponent {...sampleProps} />);

    // Verify that the function name is rendered correctly.
    expect(screen.getByText("processData")).toBeInTheDocument();
    // Verify that the average billed duration is rendered with "ms" appended.
    expect(screen.getByText("250 ms")).toBeInTheDocument();
    // Verify that the number of cold starts is rendered correctly.
    expect(screen.getByText("10")).toBeInTheDocument();
    // Verify that the percentage is rendered with a "%" symbol.
    expect(screen.getByText("20%")).toBeInTheDocument();
  });

  test("handles zero and empty string values", () => {
    // Define props with zero or empty string values to test edge cases.
    const zeroProps = {
      functionName: "",
      avgBilledDur: 0,
      coldStarts: 0,
      percentage: 0,
    };

    // Render the component with edge-case values.
    const { container } = render(<RowComponent {...zeroProps} />);

    // Select the component's root element (identified by the 'table-row' CSS class).
    const tableRow = container.querySelector(".table-row");
    // Confirm the root element exists.
    expect(tableRow).toBeInTheDocument();

    if (tableRow) {
      // Retrieve all child div elements which represent the different rendered props.
      const divs = tableRow.querySelectorAll("div");
      // Ensure that there are exactly 4 div elements, one for each prop.
      expect(divs).toHaveLength(4);

      // Check that the first div displays an empty string for the functionName.
      expect(divs[0].textContent).toBe(""); // functionName should be empty.
      // Check that the second div displays "0 ms" for average billed duration.
      expect(divs[1].textContent).toBe("0 ms"); // avgBilledDur should be "0 ms".
      // Check that the third div displays "0" for coldStarts.
      expect(divs[2].textContent).toBe("0"); // coldStarts should be "0".
      // Check that the fourth div displays "0%" for percentage.
      expect(divs[3].textContent).toBe("0%"); // percentage should be "0%".
    }
  });

  test("applies correct CSS classes", () => {
    // Render the component using the sampleProps to verify CSS class assignments.
    const { container } = render(<RowComponent {...sampleProps} />);

    // Select the root element by querying for a div with the 'table-row' class.
    const tableRow = container.querySelector(".table-row");
    // Confirm that the element exists in the DOM.
    expect(tableRow).toBeInTheDocument();
    // Confirm that the element has exactly the expected CSS class applied.
    expect(tableRow).toHaveClass("table-row");
  });
});
