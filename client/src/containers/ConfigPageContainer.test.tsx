import { screen, waitFor, act } from "@testing-library/react";
import { customRender } from "./test-utils";
import ConfigPageContainer from "./ConfigPageContainer";
import type { Config } from "./ConfigPageContainer";

interface MockConfigFormProps {
  onSave: (config: Config) => void;
  onDatabase: () => void;
}

// Here we mock the ConfigPageComponent to avoid testing its internal implementation.
// Instead, we simulate a basic version that provides buttons to trigger the onSave and onDatabase callbacks.
jest.mock("../components/ConfigPageComponent", () => ({
  __esModule: true,
  default: ({ onSave, onDatabase }: MockConfigFormProps) => (
    <div>
      <button
        onClick={() =>
          onSave({
            awsAccessKeyID: "testKey",
            awsSecretAccessKey: "testSecret",
            awsRegion: "us-east-1",
            mongoURI: "mongodb://localhost:27017/test",
          })
        }
      >
        Save Config
      </button>
      <button onClick={onDatabase}>Save Database</button>
    </div>
  ),
}));

// Override the global fetch API to prevent real network calls during tests.
global.fetch = jest.fn();

describe("ConfigPageContainer", () => {
  beforeAll(() => {
    // Override window.alert to prevent actual alert dialogs during tests.
    window.alert = jest.fn();
    // Stub window.location.replace to allow testing redirection behavior without a real page navigation.
    Object.defineProperty(window, "location", {
      writable: true,
      value: { replace: jest.fn() },
    });
  });

  beforeEach(() => {
    // Clear the fetch mock call history before each test to isolate test cases.
    (fetch as jest.Mock).mockClear();
    // Clear the alert mock history before each test.
    (window.alert as jest.Mock).mockClear();
  });

  test("renders configuration page", () => {
    // Render the ConfigPageContainer, which internally uses our mocked ConfigPageComponent.
    customRender(<ConfigPageContainer />);
    // Verify the page title "Configuration" is present.
    expect(screen.getByText("Configuration")).toBeInTheDocument();
    // Ensure that the "Save Config" button is rendered.
    expect(
      screen.getByRole("button", { name: /save config/i })
    ).toBeInTheDocument();
    // Ensure that the "Save Database" button is rendered.
    expect(
      screen.getByRole("button", { name: /save database/i })
    ).toBeInTheDocument();
  });

  test("successful config save shows success alert", async () => {
    // Simulate a successful network response for saving configuration.
    (fetch as jest.Mock).mockResolvedValue({ ok: true });
    customRender(<ConfigPageContainer />);

    // Use act() to apply click event changes and wait for asynchronous state updates.
    await act(async () => {
      screen.getByRole("button", { name: /save config/i }).click();
    });

    // Wait for the alert to be called confirming the configuration was saved.
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Configuration saved");
    });
  });

  test("server error response shows error alert", async () => {
    // Simulate a server error response by returning ok: false.
    (fetch as jest.Mock).mockResolvedValue({ ok: false });
    customRender(<ConfigPageContainer />);

    // Trigger the save configuration process.
    await act(async () => {
      screen.getByRole("button", { name: /save config/i }).click();
    });

    // Wait for the alert to indicate an error occurred during the save process.
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Error saving user information"
      );
    });
  });

  test("network error logs to console without alert", async () => {
    // Spy on console.log to capture any logs generated during fetch failure.
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    // Simulate a network error by rejecting the fetch promise.
    (fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    customRender(<ConfigPageContainer />);

    // Trigger the save configuration process.
    await act(async () => {
      screen.getByRole("button", { name: /save config/i }).click();
    });

    // Wait for console.log to be called, indicating error logging.
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "The following error occurred:",
        expect.any(Error)
      );
    });

    // Assert that no alert was triggered in case of a network error.
    expect(window.alert).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test("successful database save redirects to dashboard", async () => {
    // Simulate a successful database save operation.
    (fetch as jest.Mock).mockResolvedValue({ ok: true });
    customRender(<ConfigPageContainer />);

    // Trigger the database save by clicking the corresponding button.
    await act(async () => {
      screen.getByRole("button", { name: /save database/i }).click();
    });

    // Wait for the redirection behavior to occur, verifying that window.location.replace is called correctly.
    await waitFor(() => {
      expect(window.location.replace).toHaveBeenCalledWith(
        "http://localhost:3000/dash"
      );
    });
  });

  test("database connection error shows alert", async () => {
    // Simulate a failure response from the server when attempting to save database configuration.
    (fetch as jest.Mock).mockResolvedValue({ ok: false });
    customRender(<ConfigPageContainer />);

    // Trigger the database connection process.
    await act(async () => {
      screen.getByRole("button", { name: /save database/i }).click();
    });

    // Wait for the alert to be called with the appropriate error message.
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Error connecting to database. Please check for valid URI input"
      );
    });
  });

  test("database network error logs to console", async () => {
    // Spy on console.log to capture error logging.
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    // Simulate a network failure for the database call.
    (fetch as jest.Mock).mockRejectedValue(new Error("DB connection failed"));

    customRender(<ConfigPageContainer />);

    // Trigger the database connection process.
    await act(async () => {
      screen.getByRole("button", { name: /save database/i }).click();
    });

    // Wait for the console log to capture the error message during the database connection attempt.
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error in handleDatabase: ",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
});
