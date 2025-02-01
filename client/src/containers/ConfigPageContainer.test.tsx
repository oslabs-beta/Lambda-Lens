import { screen, waitFor, act } from "@testing-library/react";
import { customRender } from "./test-utils";
import ConfigPageContainer from "./ConfigPageContainer";
import type { Config } from "./ConfigPageContainer";

interface MockConfigFormProps {
  onSave: (config: Config) => void;
  onDatabase: () => void;
}

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

global.fetch = jest.fn();

describe("ConfigPageContainer", () => {
  beforeAll(() => {
    window.alert = jest.fn();
    Object.defineProperty(window, "location", {
      writable: true,
      value: { replace: jest.fn() },
    });
  });

  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    (window.alert as jest.Mock).mockClear();
  });

  test("renders configuration page", () => {
    customRender(<ConfigPageContainer />);
    expect(screen.getByText("Configuration")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /save config/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /save database/i })
    ).toBeInTheDocument();
  });

  test("successful config save shows success alert", async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true });
    customRender(<ConfigPageContainer />);

    await act(async () => {
      screen.getByRole("button", { name: /save config/i }).click();
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Configuration saved");
    });
  });

  test("server error response shows error alert", async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: false });
    customRender(<ConfigPageContainer />);

    await act(async () => {
      screen.getByRole("button", { name: /save config/i }).click();
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Error saving user information"
      );
    });
  });

  test("network error logs to console without alert", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    (fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    customRender(<ConfigPageContainer />);

    await act(async () => {
      screen.getByRole("button", { name: /save config/i }).click();
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "The following error occurred:",
        expect.any(Error)
      );
    });

    expect(window.alert).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test("successful database save redirects to dashboard", async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true });
    customRender(<ConfigPageContainer />);

    await act(async () => {
      screen.getByRole("button", { name: /save database/i }).click();
    });

    await waitFor(() => {
      expect(window.location.replace).toHaveBeenCalledWith(
        "http://localhost:3000/dash"
      );
    });
  });

  test("database connection error shows alert", async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: false });
    customRender(<ConfigPageContainer />);

    await act(async () => {
      screen.getByRole("button", { name: /save database/i }).click();
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Error connecting to database. Please check for valid URI input"
      );
    });
  });

  test("database network error logs to console", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    (fetch as jest.Mock).mockRejectedValue(new Error("DB connection failed"));

    customRender(<ConfigPageContainer />);

    await act(async () => {
      screen.getByRole("button", { name: /save database/i }).click();
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error in handleDatabase: ",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
});
