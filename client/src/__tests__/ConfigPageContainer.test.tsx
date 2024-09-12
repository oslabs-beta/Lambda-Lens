import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ConfigPageContainer from '../containers/ConfigPageContainer';

type Config = {
  awsAccessKeyID: string;
  awsSecretAccessKey: string;
  awsRegion: string;
  mongoURI: string;
};

const mockFetch = vi.fn();

vi.mock('../components/ConfigPageComponent', () => {
  return {
    default: ({ onSave, onDatabase }: { onSave: (config: Config) => void; onDatabase: () => void }) => (
      <div>
        <button
          onClick={() => onSave({
            awsAccessKeyID: 'testAccessKey',
            awsSecretAccessKey: 'testSecretKey',
            awsRegion: 'us-east-1',
            mongoURI: 'mongodb://localhost:27017/test'
          })}
        >
          Save Config
        </button>
        <button onClick={onDatabase}>Save Database</button>
      </div>
    ),
  };
});

global.fetch = mockFetch;

describe('ConfigPageContainer', () => {
  let originalAlert: typeof window.alert;

  beforeAll(() => {
    originalAlert = window.alert;
  });

  beforeEach(() => {
    window.alert = vi.fn();
    mockFetch.mockClear();
  });

  afterAll(() => {
    window.alert = originalAlert;
  });

  it('should render the ConfigPageContainer and handle saving config and database', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true } as Response)  
      .mockResolvedValueOnce({ ok: true } as Response); 

    render(<ConfigPageContainer />);

    expect(screen.getByText('Configuration')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Save Config'));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/config/save', expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          awsAccessKeyID: 'testAccessKey',
          awsSecretAccessKey: 'testSecretKey',
          awsRegion: 'us-east-1',
          mongoURI: 'mongodb://localhost:27017/test'
        }),
      }));
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    expect(window.alert).toHaveBeenCalledWith('Configuration saved');

    fireEvent.click(screen.getByText('Save Database'));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/config/db', expect.objectContaining({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }));
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

  });

  it('should handle fetch errors correctly', async () => {

    mockFetch
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({ ok: true } as Response);

    vi.spyOn(console, 'log').mockImplementation(() => {});

    render(<ConfigPageContainer />);

    fireEvent.click(screen.getByText('Save Config'));

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('The following error occurred:', new Error('Network error'));
    });

    fireEvent.click(screen.getByText('Save Database'));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/config/db', expect.objectContaining({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }));
    });
  });
});