import { render, screen } from "@testing-library/react";
import App from "../App";

// Smoke test to ensure the App component renders correctly.
test("smoke test: App renders without crashing", () => {
  render(<App />);

  // Check that a heading with "configuration" is present.
  expect(
    screen.getByRole("heading", { name: /configuration/i })
  ).toBeInTheDocument();
});
