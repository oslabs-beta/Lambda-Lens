import { render, screen } from "@testing-library/react";
import App from "./App";

test("smoke test: App renders without crashing", () => {
  render(<App />);
  // Use getByRole('heading') to target the h2 element with text "Configuration"
  expect(
    screen.getByRole("heading", { name: /configuration/i })
  ).toBeInTheDocument();
});
