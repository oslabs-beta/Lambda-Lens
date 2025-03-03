/// <reference types="@testing-library/jest-dom" />

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfigPageComponent from "./ConfigPageComponent";

// Define mock functions for onSave and onDatabase
const mockOnSave = jest.fn();
const mockOnDatabase = jest.fn();

describe("ConfigPageComponent", () => {
  beforeEach(() => {
    // Clear all previous mock calls before each test to ensure tests are isolated.
    mockOnSave.mockClear();
    mockOnDatabase.mockClear();
  });

  // Helper function to render ConfigPageComponent with the required callback props.
  const renderComponent = () => {
    render(
      <ConfigPageComponent onSave={mockOnSave} onDatabase={mockOnDatabase} />
    );
  };

  test("renders all input fields and buttons", () => {
    renderComponent();

    // Verify that the AWS Access Key input field is present.
    expect(screen.getByPlaceholderText("AWS Access Key")).toBeInTheDocument();

    // Verify that the AWS Secret Access Key input field is present.
    expect(
      screen.getByPlaceholderText("AWS Secret Access Key")
    ).toBeInTheDocument();

    // Verify that a combobox (for AWS Region selection) is rendered.
    expect(screen.getByRole("combobox")).toBeInTheDocument();

    // Verify that the MongoDB URI input field is present.
    expect(screen.getByPlaceholderText("MongoDB URI")).toBeInTheDocument();

    // Verify that the Submit button is rendered.
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();

    // Verify that the "Connect to Database" button is rendered.
    expect(
      screen.getByRole("button", { name: /connect to database/i })
    ).toBeInTheDocument();
  });

  test("shows validation errors when submitting empty form", async () => {
    renderComponent();

    // Find the submit button element by its accessible name.
    const submitButton = screen.getByRole("button", { name: /submit/i });

    // Simulate a user clicking the submit button without entering any input data.
    fireEvent.click(submitButton);

    // Check that the appropriate validation errors are displayed, waiting if necessary for asynchronous rendering.
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

    // Ensure that the onSave callback is not invoked when required fields are missing.
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test("calls onSave with correct data when form is submitted with valid inputs", async () => {
    renderComponent();

    // Simulate typing into the AWS Access Key field.
    await userEvent.type(
      screen.getByPlaceholderText("AWS Access Key"),
      "AKIAEXAMPLE"
    );
    // Simulate typing into the AWS Secret Access Key field.
    await userEvent.type(
      screen.getByPlaceholderText("AWS Secret Access Key"),
      "SECRETEXAMPLE"
    );
    // Simulate selecting "us-east-1" from the AWS Region dropdown.
    await userEvent.selectOptions(screen.getByRole("combobox"), "us-east-1");
    // Simulate typing into the MongoDB URI input field.
    await userEvent.type(
      screen.getByPlaceholderText("MongoDB URI"),
      "mongodb://localhost:27017"
    );

    // Identify the submit button and simulate its click event.
    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    // Wait for the onSave function to be called asynchronously, verifying its arguments.
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
      expect(mockOnSave).toHaveBeenCalledWith({
        awsAccessKeyID: "AKIAEXAMPLE",
        awsSecretAccessKey: "SECRETEXAMPLE",
        awsRegion: "us-east-1",
        mongoURI: "mongodb://localhost:27017",
      });
    });

    // Confirm that validation error messages do not exist after a valid form submission.
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

    // Find the "Connect to Database" button by its accessible name.
    const connectButton = screen.getByRole("button", {
      name: /connect to database/i,
    });

    // Simulate a click event on the "Connect to Database" button.
    await userEvent.click(connectButton);

    // Verify that the onDatabase callback is invoked exactly once.
    expect(mockOnDatabase).toHaveBeenCalledTimes(1);
  });

  test('does not call onSave when "Connect to Database" button is clicked', async () => {
    renderComponent();

    // Find the "Connect to Database" button by its accessible name.
    const connectButton = screen.getByRole("button", {
      name: /connect to database/i,
    });

    // Simulate a click event on the button.
    await userEvent.click(connectButton);

    // Confirm that the onSave callback is not triggered when connecting to the database.
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test("formats and submits the form data correctly", async () => {
    renderComponent();

    // Simulate entering valid data into each form field with new test values.
    await userEvent.type(
      screen.getByPlaceholderText("AWS Access Key"),
      "AKIA123456"
    );
    await userEvent.type(
      screen.getByPlaceholderText("AWS Secret Access Key"),
      "SECRET123456"
    );
    // Select "eu-west-1" from the region dropdown.
    await userEvent.selectOptions(screen.getByRole("combobox"), "eu-west-1");
    await userEvent.type(
      screen.getByPlaceholderText("MongoDB URI"),
      "mongodb://example.com:27017"
    );

    // Identify the submit button and simulate clicking it.
    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    // Wait for the onSave callback, and verify it is called with the correctly formatted data.
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
