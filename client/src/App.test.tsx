import { render, screen } from "@testing-library/react";
import App from "./App";

test("smoke test: App renders without crashing", () => {
  render(<App />);
  expect(
    screen.getByRole("heading", { name: /configuration/i })
  ).toBeInTheDocument();
});
