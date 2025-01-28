import { screen, fireEvent, waitFor } from "@testing-library/react";
import { customRender, sendMessage, mockFetch } from "./test-utils";
import ChatContainer from "./ChatContainer";
import {
  successfulResponse,
  errorResponse,
} from "./__fixtures__/mockResponses";

// Mock the global fetch API
global.fetch = jest.fn();

describe("ChatContainer Rendering", () => {
  test("renders the chat container with initial elements", () => {
    customRender(<ChatContainer />);

    expect(
      screen.getByText("Explore Your Metrics: Ask Me How!")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Type your message here...")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  test("matches the snapshot", () => {
    const { asFragment } = customRender(<ChatContainer />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("ChatContainer User Interactions", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  test("prevents sending empty messages", async () => {
    customRender(<ChatContainer />);
    const input = screen.getByPlaceholderText("Type your message here...");
    const sendButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.click(sendButton);

    // Just verify no fetch call was made
    expect(fetch).not.toHaveBeenCalled();
  });

  test("allows user to type a message and send it", async () => {
    mockFetch(successfulResponse);
    customRender(<ChatContainer />);

    const input = screen.getByPlaceholderText("Type your message here...");
    const sendButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(sendButton);

    // Wait for the message to appear
    await waitFor(() => {
      expect(screen.getByText("Hello")).toBeInTheDocument();
    });

    // Wait for the response
    await waitFor(() => {
      expect(screen.getByText("Success response")).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/data/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Hello" }),
    });
  });

  test("prevents sending multiple messages while loading", async () => {
    mockFetch({
      ok: true,
      json: () => new Promise(() => {}), // Never resolves to keep loading state
    });
    customRender(<ChatContainer />);

    const input = screen.getByPlaceholderText("Type your message here...");
    const sendButton = screen.getByRole("button", { name: /send/i });

    // Send first message
    fireEvent.change(input, { target: { value: "First message" } });
    fireEvent.click(sendButton);

    // Try to send second message while first is loading
    fireEvent.change(input, { target: { value: "Second message" } });
    fireEvent.click(sendButton);

    // Verify only one fetch call was made
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("allows user to send a message by pressing Enter key", async () => {
    mockFetch(successfulResponse);
    customRender(<ChatContainer />);

    const input = screen.getByPlaceholderText("Type your message here...");
    const sendButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(input, { target: { value: "Enter key message" } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText("Enter key message")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Success response")).toBeInTheDocument();
      expect(screen.queryByText("...")).not.toBeInTheDocument();
    });
  });

  test("handles empty response data gracefully", async () => {
    mockFetch({
      ok: true,
      json: async () => ({ result: "" }), // Empty result to trigger fallback
    });
    customRender(<ChatContainer />);

    const input = screen.getByPlaceholderText("Type your message here...");
    const sendButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(input, { target: { value: "Test message" } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText("No response")).toBeInTheDocument();
    });
  });
});

describe("ChatContainer Error Handling", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  test("handles non-ok responses from fetch gracefully", async () => {
    mockFetch(errorResponse);
    customRender(<ChatContainer />);

    await sendMessage("Test non-ok response");

    await waitFor(() => {
      expect(screen.getByText("Test non-ok response")).toBeInTheDocument();
    });

    await waitFor(() => {
      const errorMessages = screen.getAllByText(/Assistant went wrong/);
      expect(errorMessages.length).toBeGreaterThan(0);
      expect(screen.queryByText("...")).not.toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/data/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Test non-ok response" }),
    });
  });

  test("displays error message when fetch fails", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));
    customRender(<ChatContainer />);

    await sendMessage("Network failure test");

    await waitFor(() => {
      expect(screen.getByText("You:")).toBeInTheDocument();
      expect(screen.getByText("Network failure test")).toBeInTheDocument();
      expect(screen.getByText("Assistant:")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Assistant went wrong")).toBeInTheDocument();
      expect(screen.queryByText("...")).not.toBeInTheDocument();
    });
  });
});
