//for this test, run server first

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CloudwatchContainer from '../containers/CloudwatchContainer';

vi.mock('react-chartjs-2', () => ({
  Line: () => <div>Mocked Line Chart</div>,
  Bar: () => <div>Mocked Bar Chart</div>,
  Doughnut: () => <div>Mocked Doughnut Chart</div> 
}));

vi.stubGlobal('fetch', () => {
    return Promise.resolve({
      json: () => Promise.resolve({}),
    });
  });

const fetchMock = vi.fn<typeof fetch>();

describe('CloudwatchContainer', () => {
  beforeEach(() => {
    fetchMock.mockClear();
    (global as unknown as { fetch: typeof fetch }).fetch = fetchMock;
  });

  it('renders correctly and fetches data', async () => {
    const mockFunctionData = [
      { functionName: 'Function1', duration: [100], concurrentExecutions: [10], throttles: [2], timestamps: ['2024-01-01T00:00:00Z'] },
      { functionName: 'Function2', duration: [200], concurrentExecutions: [20], throttles: [4], timestamps: ['2024-01-02T00:00:00Z'] }
    ];

    const mockPercentileData = {
      'Function1': { percentiles: { p90: [50], p95: [70], p99: [90] } },
      'Function2': { percentiles: { p90: [60], p95: [80], p99: [100] } }
    };

    fetchMock
      .mockResolvedValueOnce(new Response(JSON.stringify(mockFunctionData)))
      .mockResolvedValueOnce(new Response(JSON.stringify(mockPercentileData)));

    render(<CloudwatchContainer />);

    expect(screen.getByText('CloudWatch Metrics')).toBeInTheDocument();
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Function1')).toBeInTheDocument();
      expect(screen.getByText('Function2')).toBeInTheDocument();
    });

    fireEvent.change(selectElement, { target: { value: 'Function2' } });

    // screen.debug();

    await waitFor(() => {
      expect(screen.queryByText('Total Number of Throttles (5min period)')).toBeInTheDocument();
      expect(screen.queryByText('Average Execution Duration (5min period)')).toBeInTheDocument();
      expect(screen.queryByText('Percentile Latency (ms)')).toBeInTheDocument();
    });
  });
});