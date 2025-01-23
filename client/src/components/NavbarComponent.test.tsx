/// <reference types="@testing-library/jest-dom" />

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NavbarComponent from "./NavbarComponent";
import { MemoryRouter } from "react-router-dom";

// Mock the image import
jest.mock("../assets/lambda.png", () => "lambda.png");

describe("NavbarComponent", () => {
  const mockLocalStorage = (() => {
    let store: { [key: string]: string } = {};

    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  beforeAll(() => {
    // Replace the global localStorage with our mock
    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
    });
  });

  beforeEach(() => {
    // Clear localStorage and any classes on document.body before each test
    window.localStorage.clear();
    document.body.className = "";
  });

  const renderComponent = () => {
    render(
      <MemoryRouter>
        <NavbarComponent />
      </MemoryRouter>
    );
  };

  test("renders logo image with correct src and alt attributes", () => {
    renderComponent();

    const logo = screen.getByAltText("Logo") as HTMLImageElement;
    expect(logo).toBeInTheDocument();
    expect(logo.src).toContain("lambda.png");
  });

  test("renders all navigation links with correct labels and hrefs", () => {
    renderComponent();

    const functionPerformanceLink = screen.getByRole("link", {
      name: /function performance/i,
    });
    const cloudwatchMetricsLink = screen.getByRole("link", {
      name: /cloudwatch metrics/i,
    });
    const configurationLink = screen.getByRole("link", {
      name: /configuration/i,
    });

    expect(functionPerformanceLink).toBeInTheDocument();
    expect(functionPerformanceLink).toHaveAttribute("href", "/dash");

    expect(cloudwatchMetricsLink).toBeInTheDocument();
    expect(cloudwatchMetricsLink).toHaveAttribute("href", "/cloudwatchmetrics");

    expect(configurationLink).toBeInTheDocument();
    expect(configurationLink).toHaveAttribute("href", "/");
  });

  test("renders LightModeIcon by default", () => {
    renderComponent();

    const themeToggle = screen.getByRole("button", { name: /theme switch/i });
    expect(themeToggle).toBeInTheDocument();

    // Since darkMode is false by default, LightModeIcon should be rendered
    const lightModeIcon = themeToggle.querySelector("svg");
    expect(lightModeIcon).toBeInTheDocument();
    expect(lightModeIcon).toHaveAttribute("fill", "#646464");
  });

  test("initializes with dark mode if localStorage has theme set to dark", () => {
    window.localStorage.setItem("theme", "dark");

    renderComponent();

    expect(document.body).toHaveClass("darkmode");

    const themeToggle = screen.getByRole("button", { name: /theme switch/i });
    const darkModeIcon = themeToggle.querySelector("svg");
    expect(darkModeIcon).toBeInTheDocument();
    expect(darkModeIcon).toHaveAttribute("fill", "#a2a2a2");
  });

  test("toggles to dark mode when theme switch is clicked", async () => {
    renderComponent();

    const themeToggle = screen.getByRole("button", { name: /theme switch/i });

    // Initially, light mode
    expect(document.body).not.toHaveClass("darkmode");

    // Click to switch to dark mode
    await userEvent.click(themeToggle);

    expect(document.body).toHaveClass("darkmode");
    expect(window.localStorage.getItem("theme")).toBe("dark");

    // The icon should now be DarkModeIcon
    const darkModeIcon = themeToggle.querySelector("svg");
    expect(darkModeIcon).toBeInTheDocument();
    expect(darkModeIcon).toHaveAttribute("fill", "#a2a2a2");
  });

  test("toggles back to light mode when theme switch is clicked twice", async () => {
    renderComponent();

    const themeToggle = screen.getByRole("button", { name: /theme switch/i });

    // Click to switch to dark mode
    await userEvent.click(themeToggle);
    expect(document.body).toHaveClass("darkmode");
    expect(window.localStorage.getItem("theme")).toBe("dark");

    // Click again to switch back to light mode
    await userEvent.click(themeToggle);
    expect(document.body).not.toHaveClass("darkmode");
    expect(window.localStorage.getItem("theme")).toBeNull();

    // The icon should now be LightModeIcon
    const lightModeIcon = themeToggle.querySelector("svg");
    expect(lightModeIcon).toBeInTheDocument();
    expect(lightModeIcon).toHaveAttribute("fill", "#646464");
  });

  test("toggles dark mode using keyboard interaction", async () => {
    renderComponent();

    const themeToggle = screen.getByRole("button", { name: /theme switch/i });

    // Focus the theme toggle
    themeToggle.focus();
    expect(themeToggle).toHaveFocus();

    // Press 'Enter' to toggle dark mode
    await userEvent.keyboard("{Enter}");
    expect(document.body).toHaveClass("darkmode");
    expect(window.localStorage.getItem("theme")).toBe("dark");

    // Press 'Space' to toggle back to light mode
    await userEvent.keyboard(" "); // Simulate pressing Space
    expect(document.body).not.toHaveClass("darkmode");
    expect(window.localStorage.getItem("theme")).toBeNull();

    // The icon should now be LightModeIcon
    const lightModeIcon = themeToggle.querySelector("svg");
    expect(lightModeIcon).toBeInTheDocument();
    expect(lightModeIcon).toHaveAttribute("fill", "#646464");
  });

  test("handles unexpected theme values in localStorage gracefully", () => {
    // Set an unexpected theme value
    window.localStorage.setItem("theme", "unknown");

    renderComponent();

    // The component should default to light mode
    expect(document.body).not.toHaveClass("darkmode");

    const themeToggle = screen.getByRole("button", { name: /theme switch/i });
    expect(themeToggle).toBeInTheDocument();

    // Optionally, check if the icon is LightModeIcon
    const lightModeIcon = themeToggle.querySelector("svg");
    expect(lightModeIcon).toBeInTheDocument();
    expect(lightModeIcon).toHaveAttribute("fill", "#646464");
  });

  test("cleans up classes on unmount", async () => {
    const { unmount } = render(
      <MemoryRouter>
        <NavbarComponent />
      </MemoryRouter>
    );

    const themeToggle = screen.getByRole("button", { name: /theme switch/i });
    await userEvent.click(themeToggle);
    expect(document.body).toHaveClass("darkmode");

    // Unmount the component
    unmount();

    // Ensure the class is removed
    expect(document.body).not.toHaveClass("darkmode");
  });
});
