// client/src/containers/test-utils.tsx
import React from "react";
import {
  render,
  RenderOptions,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

interface MockResponse<T = unknown> {
  ok: boolean;
  status?: number;
  json: () => Promise<T>;
}

const customRender = (ui: React.ReactElement, options?: RenderOptions) => {
  return render(ui, { ...options });
};

export { render, screen, fireEvent, waitFor };
export { customRender };
export { userEvent };

export const sendMessage = async (message: string) => {
  const input = screen.getByPlaceholderText("Type your message here...");
  const sendButton = screen.getByRole("button", { name: /send/i });

  fireEvent.change(input, { target: { value: message } });
  fireEvent.click(sendButton);

  // Optionally, wait for some UI changes
  await waitFor(() => expect(input).toHaveValue(""));
};

export const mockFetch = (mockResponse: Partial<MockResponse>) => {
  (fetch as jest.Mock).mockResolvedValueOnce(mockResponse as MockResponse);
};

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

export const mockFetchResponse = async <T,>(
  data: T
): Promise<MockResponse> => ({
  ok: true,
  json: async () => data,
});
