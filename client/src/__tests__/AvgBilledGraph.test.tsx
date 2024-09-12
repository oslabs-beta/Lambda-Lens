import { render, screen } from '@testing-library/react';
import AvgBilledDurGraph from '../components/AvgBilledDurGraphComponent';
import { Bar } from 'react-chartjs-2';
import { vi } from 'vitest';

// Mock the Bar component from react-chartjs-2
vi.mock('react-chartjs-2', () => ({
  Bar: vi.fn(() => <div>Bar Chart</div>),
}));

const mockData = [
    { functionName: 'Function A', avgBilledDur: 100 },
    { functionName: 'Function B', avgBilledDur: 200 },
    { functionName: 'Function C', avgBilledDur: 300 },
  ];
  
  describe('AvgBilledDurGraph', () => {
    it('renders the chart with the correct data', () => {
      render(<AvgBilledDurGraph data={mockData} />);
  
      expect(screen.getByText('Bar Chart')).toBeInTheDocument();

      expect(screen.getByText('Average Billed Duration (ms)')).toBeInTheDocument();
    });
  
    it('passes the correct data to the Bar component', () => {
      render(<AvgBilledDurGraph data={mockData} />);
  
      const mockedBar = vi.mocked(Bar); 
      expect(mockedBar).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            labels: mockData.map(fn => fn.functionName),
            datasets: [
              {
                label: 'Average Billed Duration (ms)',
                data: mockData.map(fn => fn.avgBilledDur),
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
          options: expect.objectContaining({
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Function Name'
                }
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Time (ms)'
                }
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
          }),
        }),
        expect.anything()
      );
    });
  });