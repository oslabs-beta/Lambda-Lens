import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ConfigForm from '../components/ConfigPageComponent'; 

describe('ConfigForm', () => {
  it('renders the form correctly', () => {
    render(
      <ConfigForm
        onSave={vi.fn()}
        onDatabase={vi.fn()}
      />
    );

    expect(screen.getByPlaceholderText('AWS Access Key')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('AWS Secret Access Key')).toBeInTheDocument();
    expect(screen.getByText('Select Region')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('MongoDB URI')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Connect to Database/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  it('calls onSave with form data when the form is submitted', async () => {
    const mockOnSave = vi.fn();
    render(
      <ConfigForm
        onSave={mockOnSave}
        onDatabase={vi.fn()}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('AWS Access Key'), { target: { value: 'test-key-id' } });
    fireEvent.change(screen.getByPlaceholderText('AWS Secret Access Key'), { target: { value: 'test-secret-key' } });
    fireEvent.change(screen.getByPlaceholderText('MongoDB URI'), { target: { value: 'mongodb://localhost:27017/test' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'us-east-1' } });

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        awsAccessKeyID: 'test-key-id',
        awsSecretAccessKey: 'test-secret-key',
        awsRegion: 'us-east-1',
        mongoURI: 'mongodb://localhost:27017/test'
      });
    });
  });

  it('calls onDatabase when the Connect to Database button is clicked', () => {
    const mockOnDatabase = vi.fn();
    render(
      <ConfigForm
        onSave={vi.fn()}
        onDatabase={mockOnDatabase}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Connect to Database/i }));
    expect(mockOnDatabase).toHaveBeenCalled();
  });
});