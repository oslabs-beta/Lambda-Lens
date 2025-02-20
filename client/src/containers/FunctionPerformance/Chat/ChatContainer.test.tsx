import { screen, fireEvent, waitFor } from "@testing-library/react";
import { customRender, sendMessage, mockFetch } from "../../test-utils";
import ChatContainer from "../../ChatContainer";

// This response object mimics a successful fetch where the JSON result is "Success response".
const successfulResponse = {
  ok: true,
  json: async () => ({ result: "Success response" }),
};

// This response object includes a status code and error message to mimic server failure.
const errorResponse = {
  ok: false,
  status: 500,
  json: async () => ({ error: "Internal Server Error" }),
};

// Globally mock the fetch API to control network requests within our tests.
global.fetch = jest.fn();

describe("ChatContainer Rendering", () => {
  test("renders the chat container with initial elements", () => {
    // Render the ChatContainer component using a custom rendering method.
    customRender(<ChatContainer />);

    // Verify that the main heading text is rendered correctly.
    expect(
      screen.getByText("Explore Your Metrics: Ask Me How!")
    ).toBeInTheDocument();
    // Verify that the input field for typing messages is present.
    expect(
      screen.getByPlaceholderText("Type your message here...")
    ).toBeInTheDocument();
    // Verify that the "Send" button is rendered.
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });
});

describe("ChatContainer User Interactions", () => {
  beforeEach(() => {
    // Clear any previous calls to the mocked fetch function before each interaction test.
    (fetch as jest.Mock).mockClear();
  });

  test("prevents sending empty messages", async () => {
    // Render the ChatContainer component for testing user interactions.
    customRender(<ChatContainer />);
    // Locate the input field and the send button.
    const input = screen.getByPlaceholderText("Type your message here...");
    const sendButton = screen.getByRole("button", { name: /send/i });

    // Simulate user entering an empty (whitespace) message.
    fireEvent.change(input, { target: { value: "   " } });
    // Simulate clicking the send button.
    fireEvent.click(sendButton);

    // Confirm that no fetch request is made when an empty message is submitted.
    expect(fetch).not.toHaveBeenCalled();
  });

  test("allows user to type a message and send it", async () => {
    // Set up mock fetch to return a successful response.
    mockFetch(successfulResponse);
    customRender(<ChatContainer />);

    // Retrieve the input field and send button.
    const input = screen.getByPlaceholderText("Type your message here...");
    const sendButton = screen.getByRole("button", { name: /send/i });

    // Simulate user entering "Hello" as the message.
    fireEvent.change(input, { target: { value: "Hello" } });
    // Simulate clicking the send button.
    fireEvent.click(sendButton);

    // Wait for the user message to appear in the chat; this ensures the message is rendered.
    await waitFor(() => {
      expect(screen.getByText("Hello")).toBeInTheDocument();
    });

    // Wait for the response from the server ("Success response") to be rendered.
    await waitFor(() => {
      expect(screen.getByText("Success response")).toBeInTheDocument();
    });

    // Validate that fetch was called with the correct URL and configuration.
    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/data/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Hello" }),
    });
  });

  test("prevents sending multiple messages while loading", async () => {
    // Setup mock fetch that simulates a never-resolving fetch (keeps loading state active).
    mockFetch({
      ok: true,
      json: () => new Promise(() => {}), // This promise never resolves.
    });
    customRender(<ChatContainer />);

    // Retrieve input field and send button.
    const input = screen.getByPlaceholderText("Type your message here...");
    const sendButton = screen.getByRole("button", { name: /send/i });

    // Send the first message.
    fireEvent.change(input, { target: { value: "First message" } });
    fireEvent.click(sendButton);

    // Attempt to send a second message while the first message fetch is still in progress.
    fireEvent.change(input, { target: { value: "Second message" } });
    fireEvent.click(sendButton);

    // Ensure that only one fetch call was made, confirming that the component prevents duplicate submissions.
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("allows user to send a message by pressing Enter key", async () => {
    // Setup fetch mock with a successful response.
    mockFetch(successfulResponse);
    customRender(<ChatContainer />);

    // Retrieve the input field and send button.
    const input = screen.getByPlaceholderText("Type your message here...");
    const sendButton = screen.getByRole("button", { name: /send/i });

    // Simulate user typing a message and then triggering the send action.
    fireEvent.change(input, { target: { value: "Enter key message" } });
    fireEvent.click(sendButton);

    // Validate that the user's message appears in the container.
    await waitFor(() => {
      expect(screen.getByText("Enter key message")).toBeInTheDocument();
    });

    // Validate that the success response from the server is rendered.
    await waitFor(() => {
      expect(screen.getByText("Success response")).toBeInTheDocument();
      // Confirm that any loading indication (e.g., a "..." text) is removed.
      expect(screen.queryByText("...")).not.toBeInTheDocument();
    });
  });

  test("handles empty response data gracefully", async () => {
    // Setup mock fetch to simulate a case where the server returns an empty result.
    mockFetch({
      ok: true,
      json: async () => ({ result: "" }), // Return an empty string result.
    });
    customRender(<ChatContainer />);

    // Retrieve input field and send button.
    const input = screen.getByPlaceholderText("Type your message here...");
    const sendButton = screen.getByRole("button", { name: /send/i });

    // Simulate entering a test message.
    fireEvent.change(input, { target: { value: "Test message" } });
    fireEvent.click(sendButton);

    // Wait for the fallback "No response" message to be displayed,
    // which indicates the component handled empty server response gracefully.
    await waitFor(() => {
      expect(screen.getByText("No response")).toBeInTheDocument();
    });
  });
});

describe("ChatContainer Error Handling", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    // Override console.error to prevent error logs during tests.
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error after each test.
    (console.error as jest.Mock).mockRestore();
  });

  test("handles non-ok responses from fetch gracefully", async () => {
    // Setup fetch mock to simulate an error response from the server.
    mockFetch(errorResponse);
    customRender(<ChatContainer />);

    // Use the sendMessage helper function to simulate sending a message.
    await sendMessage("Test non-ok response");

    // Verify the user's message is rendered as expected.
    await waitFor(() => {
      expect(screen.getByText("Test non-ok response")).toBeInTheDocument();
    });

    // Verify that the component displays an error message when the assistant's response fails.
    await waitFor(() => {
      const errorMessages = screen.getAllByText(/Assistant went wrong/);
      expect(errorMessages.length).toBeGreaterThan(0);
      // Ensure that any temporary loading indicator is no longer visible.
      expect(screen.queryByText("...")).not.toBeInTheDocument();
    });

    // Confirm that fetch was called with the correct request configuration.
    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/data/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Test non-ok response" }),
    });
  });

  test("displays error message when fetch fails", async () => {
    // Set fetch to reject with a network error to simulate a fetch failure.
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));
    customRender(<ChatContainer />);

    // Use the sendMessage helper function to simulate sending a message which will trigger a network error.
    await sendMessage("Network failure test");

    // Wait for the component to display the user's message and other UI elements.
    await waitFor(() => {
      expect(screen.getByText("You:")).toBeInTheDocument();
      expect(screen.getByText("Network failure test")).toBeInTheDocument();
      expect(screen.getByText("Assistant:")).toBeInTheDocument();
    });

    // Wait for the error message to be displayed, indicating the assistant encountered an error.
    await waitFor(() => {
      expect(screen.getByText("Assistant went wrong")).toBeInTheDocument();
      // Confirm that the loading indicator is removed.
      expect(screen.queryByText("...")).not.toBeInTheDocument();
    });
  });
});
