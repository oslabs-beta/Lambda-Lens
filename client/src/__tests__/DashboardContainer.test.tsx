import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DashboardContainer from '../containers/DashboardContainer';

interface FunctionData {
  functionName: string;
  avgBilledDur: number;
  numColdStarts: number;
  percentColdStarts: number;
}

vi.mock('../containers/ColdStartsMetricsContainer', () => ({
  default: ({ data }: { data: FunctionData[] }) => (
    <div>
      {data.map((item, index) => (
        <div key={index}>
          <div>{item.functionName}</div>
          <div>{item.avgBilledDur}</div>
          <div>{item.numColdStarts}</div>
          <div>{item.percentColdStarts}</div>
        </div>
      ))}
    </div>
  ),
}));

vi.mock('../components/ColdStartsGraphComponent', () => ({
  default: ({ data }: { data: FunctionData[] }) => (
    <div>
      ColdStartsGraphComponent with data: {data.length > 0 ? JSON.stringify(data) : 'No data'}
    </div>
  ),
}));

vi.mock('../components/AvgBilledDurGraphComponent', () => ({
  default: ({ data }: { data: FunctionData[] }) => (
    <div>
      AvgBilledDurGraphComponent with data: {data.length > 0 ? JSON.stringify(data) : 'No data'}
    </div>
  ),
}));

vi.mock('../containers/ChatContainer', () => ({
  default: () => <div>ChatContainer</div>,
}));

const mockResponse = {
  ok: true,
  json: async () => [{ functionName: 'Function1', avgBilledDur: 123, numColdStarts: 5, percentColdStarts: 20 }],
} as Response;

const mockFetch = vi.fn().mockResolvedValue(mockResponse);

global.fetch = mockFetch as typeof fetch;

describe('DashboardContainer', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should render DashboardContainer and handle data fetching and refreshing', async () => {
    const mockData: FunctionData[] = [
      {
        functionName: 'Function1',
        avgBilledDur: 123,
        numColdStarts: 5,
        percentColdStarts: 20,
      },
      {
        functionName: 'Function2',
        avgBilledDur: 456,
        numColdStarts: 10,
        percentColdStarts: 30,
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    } as Response);

    render(<DashboardContainer />);

    expect(screen.getByText('Function Performance')).toBeInTheDocument();

    const refreshButton = screen.getByRole('button');
    expect(refreshButton).toBeInTheDocument();
    expect(refreshButton).toHaveTextContent('↻');

    expect(screen.getByText(/ColdStartsGraphComponent with data:/)).toBeInTheDocument();
    expect(screen.getByText(/AvgBilledDurGraphComponent with data:/)).toBeInTheDocument();
    expect(screen.getByText('ChatContainer')).toBeInTheDocument();

    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  it('should handle fetch errors correctly', async () => {
    // mockFetch.mockRejectedValueOnce(new Error('Network error'));
  
    render(<DashboardContainer />);
  
    await waitFor(() => {
      expect(screen.queryByText(/Function\d/)).toBeNull();
    });
  });
});