// This file centralizes common testing functions and utilities that can be re-used across
// different test files. It provides helpers for rendering components, simulating user interactions,
// and mocking API responses, thereby promoting consistency and reducing duplication in tests.

import React from "react";
import {
  render,
  RenderOptions,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Defines the structure of a mock response object used to simulate fetch API responses during tests.
// - "ok": Indicates if the response is successful.
// - "status": Optionally specifies an HTTP status code.
// - "json": A function that returns a Promise resolving to the response body.
interface MockResponse<T = unknown> {
  ok: boolean;
  status?: number;
  json: () => Promise<T>;
}

// A wrapper around the "@testing-library/react" render function.
// It can accept additional render options, making it easier to apply consistent configuration
// across tests.
const customRender = (ui: React.ReactElement, options?: RenderOptions) => {
  return render(ui, { ...options });
};

// These re-exports allow test files to obtain common functions directly from test-utils,
// reducing the need for repetitive import statements in individual test files.
export { render, screen, fireEvent, waitFor };
export { customRender };
export { userEvent };

// Simulates sending a message in a chat interface by:
// 1. Locating the input field using its placeholder text.
// 2. Finding the "Send" button by its accessible name.
// 3. Triggering change and click events as if a user typed and submitted a message.
// 4. Waiting for the input field to be cleared (indicating a successful send).
export const sendMessage = async (message: string) => {
  const input = screen.getByPlaceholderText("Type your message here...");
  const sendButton = screen.getByRole("button", { name: /send/i });

  fireEvent.change(input, { target: { value: message } });
  fireEvent.click(sendButton);

  // Optionally wait for the input to be cleared, ensuring that the UI reacts to the sent message.
  await waitFor(() => expect(input).toHaveValue(""));
};

// Mocks the global fetch function for a single call by resolving with the provided mock response.
// This helps in testing components that make API calls without performing real network requests.
export const mockFetch = (mockResponse: Partial<MockResponse>) => {
  (fetch as jest.Mock).mockResolvedValueOnce(mockResponse as MockResponse);
};

// Generates a standardized mock response object.
// Accepts parameters for whether the response is OK, an optional result and error message,
// as well as an optional HTTP status code. The returned object adheres to the MockResponse interface.
export const createMockResponse = (
  ok: boolean,
  result?: string,
  error?: string,
  status?: number
): MockResponse => ({
  ok,
  status,
  json: async () => ({ result, error }),
});

// A helper that returns a promise which resolves to a mock response containing data of a generic type.
// This is useful for simulating successful API calls that return specific data payloads.
export const mockFetchResponse = async <T,>(
  data: T
): Promise<MockResponse> => ({
  ok: true,
  json: async () => data,
});
