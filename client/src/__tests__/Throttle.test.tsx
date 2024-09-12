import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Line } from 'react-chartjs-2';
import ThrottleComponent from '../components/ThrottleComponent'; 

vi.mock('react-chartjs-2', () => ({
  Line: vi.fn(() => null),
}));

describe('ThrottleComponent', () => {
  it('renders correctly and passes correct data to Line component', () => {
    const sampleData = {
      throttles: [10, 20, 30],
      timestamps: [
        '2024-09-10T10:00:00Z',
        '2024-09-10T10:05:00Z',
        '2024-09-10T10:10:00Z',
      ],
    };

    render(<ThrottleComponent data={sampleData} />);

    expect(Line).toHaveBeenCalled();

    expect(Line).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          labels: sampleData.timestamps.map((ts) => {
            const date = new Date(ts);
            return `${date.toLocaleDateString([], {
              year: '2-digit',
              month: '2-digit',
              day: '2-digit',
            })} ${date.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}`;
          }),
          datasets: [
            {
              label: 'Throttles',
              data: sampleData.throttles,
              borderColor: ['#437990'],
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'End time',
              },
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Throttles',
              },
              grid: {
                display: false,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      }),
      {}
    );
  });
});