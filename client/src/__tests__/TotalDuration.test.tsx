import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Doughnut } from 'react-chartjs-2';
import TotalDurationComponent from '../components/TotalDurationComponent';

vi.mock('react-chartjs-2', () => ({
  Doughnut: vi.fn(() => null),
}));

describe('TotalDurationComponent', () => {
  it('renders correctly and passes correct data to Doughnut component', () => {
    const sampleData = {
      duration: [30, 60, 90],
      timestamps: [
        '2024-09-10T10:00:00Z',
        '2024-09-10T10:05:00Z',
        '2024-09-10T10:10:00Z',
      ],
    };

    render(<TotalDurationComponent data={sampleData} />);

    expect(Doughnut).toHaveBeenCalled();

    expect(Doughnut).toHaveBeenCalledWith(
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
              data: sampleData.duration,
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
                '#d0e1e9',
              ],
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: true,
              position: 'left',
              labels: {
                boxWidth: 20,
                padding: 10,
              },
            },
          },
        },
      }),
      {}
    );
  });
});