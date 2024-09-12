import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PercentileLatencyComponent from '../components/PercentileLatencyComponent'; 

vi.mock('react-chartjs-2', () => ({
  Bar: vi.fn(() => <div>Bar Chart</div>),
}));

describe('PercentileLatencyComponent', () => {
  it('renders the chart with the correct data and options', () => {
    // Sample data for testing
    const testData = {
      p90: [100],
      p95: [200],
      p99: [300],
    };

    render(<PercentileLatencyComponent data={testData} />);

    expect(screen.getByText('Percentile Latency (ms)')).toBeInTheDocument();

    expect(screen.getByText('Bar Chart')).toBeInTheDocument();

  });
});