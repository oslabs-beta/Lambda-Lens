import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ConcurrExecComponent from '../components/ConcurrExecComponent';
import { Bar } from 'react-chartjs-2';

vi.mock('react-chartjs-2', () => ({
  Bar: vi.fn(() => <div>Bar Chart</div>),
}));

const mockData = {
  concurrentExecutions: [5, 10, 15],
  timestamps: [
    '2024-09-10T08:00:00Z',
    '2024-09-10T09:00:00Z',
    '2024-09-10T10:00:00Z',
  ],
};

describe('ConcurrExecComponent', () => {
  it('renders the chart with the correct data', () => {
    render(<ConcurrExecComponent data={mockData} />);
    expect(screen.getByText('Bar Chart')).toBeInTheDocument();
    expect(screen.getByText('Total Concurrent Executions (5min period)')).toBeInTheDocument();
  });

  it('passes the correct data to the Bar component', () => {
    render(<ConcurrExecComponent data={mockData} />);
    
    expect(vi.mocked(Bar).mock.calls[0][0]).toMatchObject({
      data: {
        labels: mockData.timestamps.map(ts => {
          const date = new Date(ts);
          const formattedDate = date.toLocaleDateString([], {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
          });
          const formattedTime = date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          });
          return `${formattedDate} ${formattedTime}`;
        }),
        datasets: [
          {
            label: 'Executions',
            data: mockData.concurrentExecutions,
            backgroundColor: [
              '#437990',
              '#4c88a1',
              '#5796af',
              '#68a0b7',
              '#79abc0',
              '#8bb6c8',
              '#9cc1d0',
              '#adccd8',
              '#bfd7e0',
              '#d0e1e9'
            ],
            borderRadius: 4
          },
        ],
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            title: {
              display: true,
              text: 'Executions'
            },
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'End time'
            },
            grid: {
              display: false
            }
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      }
    });
  });
});