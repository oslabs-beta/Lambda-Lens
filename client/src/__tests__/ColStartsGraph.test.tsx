import { describe, it, expect, vi} from 'vitest';
import { render, screen } from '@testing-library/react';
import ColdStartsGraphComponent from '../components/ColdStartsGraphComponent';
import {Pie} from 'react-chartjs-2';

vi.mock('react-chartjs-2', () => ({
  Pie: vi.fn(() => <div>Pie Chart</div>),
}));

const mockData = [
  { functionName: 'Function A', numColdStarts: 10 },
  { functionName: 'Function B', numColdStarts: 20 },
  { functionName: 'Function C', numColdStarts: 30 },
];

describe('ColdStartsGraphComponent', () => {
  it('renders the chart with the correct data', () => {
    render(<ColdStartsGraphComponent data={mockData} />);
    expect(screen.getByText('Pie Chart')).toBeInTheDocument();
    expect(screen.getByText('Total Cold Starts')).toBeInTheDocument();
  });

  it('passes the correct data to the Pie component', () => {
    render(<ColdStartsGraphComponent data={mockData} />);
    
    expect(vi.mocked(Pie).mock.calls[0][0]).toMatchObject({
      data: {
        labels: mockData.map(fn => fn.functionName),
        datasets: [
          {
            data: mockData.map(fn => fn.numColdStarts),
            backgroundColor: [
              '#4E79A7',
              '#F28E2B',
              '#E15759',
              '#76B7B2',
              '#59A14F',
              '#EDC948',
              '#B07AA1',
              '#FF9DA7',
              '#9C755F',
              '#BAB0AC',
            ],
          },
        ],
      },
    });
  });
});