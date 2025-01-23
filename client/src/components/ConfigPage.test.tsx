/// <reference types="@testing-library/jest-dom" />

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfigPageComponent from "./ConfigPageComponent";

// Define mock functions for onSave and onDatabase
const mockOnSave = jest.fn();
const mockOnDatabase = jest.fn();

describe("ConfigPageComponent", () => {
  beforeEach(() => {
    // Clear all mock function calls before each test
    mockOnSave.mockClear();
    mockOnDatabase.mockClear();
  });

  const renderComponent = () => {
    render(
      <ConfigPageComponent onSave={mockOnSave} onDatabase={mockOnDatabase} />
    );
  };

  test("renders all input fields and buttons", () => {
    renderComponent();

    // Check for AWS Access Key ID input
    expect(screen.getByPlaceholderText("AWS Access Key")).toBeInTheDocument();

    // Check for AWS Secret Access Key input
    expect(
      screen.getByPlaceholderText("AWS Secret Access Key")
    ).toBeInTheDocument();

    // Check for AWS Region select
    expect(screen.getByRole("combobox")).toBeInTheDocument();

    // Check for MongoDB URI input
    expect(screen.getByPlaceholderText("MongoDB URI")).toBeInTheDocument();

    // Check for Submit button
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();

    // Check for Connect to Database button
    expect(
      screen.getByRole("button", { name: /connect to database/i })
    ).toBeInTheDocument();
  });

  test("shows validation errors when submitting empty form", async () => {
    renderComponent();

    // Find the submit button
    const submitButton = screen.getByRole("button", { name: /submit/i });

    // Submit the form without filling any fields
    fireEvent.click(submitButton);

    // Check for validation error messages
    expect(
      await screen.findByText("AWS Access Key ID is required")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("AWS Secret Access Key is required")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("AWS Region is required")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("MongoDB URI is required")
    ).toBeInTheDocument();

    // Ensure onSave was not called
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test("calls onSave with correct data when form is submitted with valid inputs", async () => {
    renderComponent();

    // Fill out the form fields
    await userEvent.type(
      screen.getByPlaceholderText("AWS Access Key"),
      "AKIAEXAMPLE"
    );
    await userEvent.type(
      screen.getByPlaceholderText("AWS Secret Access Key"),
      "SECRETEXAMPLE"
    );
    await userEvent.selectOptions(screen.getByRole("combobox"), "us-east-1");
    await userEvent.type(
      screen.getByPlaceholderText("MongoDB URI"),
      "mongodb://localhost:27017"
    );

    // Find the submit button
    const submitButton = screen.getByRole("button", { name: /submit/i });

    // Submit the form
    fireEvent.click(submitButton);

    // Wait for the onSave to be called
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
      expect(mockOnSave).toHaveBeenCalledWith({
        awsAccessKeyID: "AKIAEXAMPLE",
        awsSecretAccessKey: "SECRETEXAMPLE",
        awsRegion: "us-east-1",
        mongoURI: "mongodb://localhost:27017",
      });
    });

    // Ensure no validation errors are present
    expect(
      screen.queryByText("AWS Access Key ID is required")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("AWS Secret Access Key is required")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("AWS Region is required")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("MongoDB URI is required")
    ).not.toBeInTheDocument();
  });

  test('calls onDatabase when "Connect to Database" button is clicked', async () => {
    renderComponent();

    // Find the "Connect to Database" button
    const connectButton = screen.getByRole("button", {
      name: /connect to database/i,
    });

    // Click the button
    await userEvent.click(connectButton);

    // Ensure onDatabase was called once
    expect(mockOnDatabase).toHaveBeenCalledTimes(1);
  });

  test('does not call onSave when "Connect to Database" button is clicked', async () => {
    renderComponent();

    // Find the "Connect to Database" button
    const connectButton = screen.getByRole("button", {
      name: /connect to database/i,
    });

    // Click the button
    await userEvent.click(connectButton);

    // Ensure onSave was not called
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test("formats and submits the form data correctly", async () => {
    renderComponent();

    // Fill out the form fields
    await userEvent.type(
      screen.getByPlaceholderText("AWS Access Key"),
      "AKIA123456"
    );
    await userEvent.type(
      screen.getByPlaceholderText("AWS Secret Access Key"),
      "SECRET123456"
    );
    await userEvent.selectOptions(screen.getByRole("combobox"), "eu-west-1");
    await userEvent.type(
      screen.getByPlaceholderText("MongoDB URI"),
      "mongodb://example.com:27017"
    );

    // Find the submit button
    const submitButton = screen.getByRole("button", { name: /submit/i });

    // Submit the form
    fireEvent.click(submitButton);

    // Wait for the onSave to be called
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        awsAccessKeyID: "AKIA123456",
        awsSecretAccessKey: "SECRET123456",
        awsRegion: "eu-west-1",
        mongoURI: "mongodb://example.com:27017",
      });
    });
  });
});
