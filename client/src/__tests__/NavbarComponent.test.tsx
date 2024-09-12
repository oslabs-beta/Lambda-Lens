import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavbarComponent from '../components/NavbarComponent';

describe('NavbarComponent', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <NavbarComponent />
      </MemoryRouter>
    );
  });

  test('should render the NavbarComponent with logo and links', () => {
    const logoElement = screen.getByAltText('Logo');
    expect(logoElement).toBeInTheDocument();

    const functionPerformanceLink = screen.getByText('Function Performance');
    expect(functionPerformanceLink).toBeInTheDocument();

    const cloudwatchMetricsLink = screen.getByText('Cloudwatch Metrics');
    expect(cloudwatchMetricsLink).toBeInTheDocument();

    const configurationLink = screen.getByText('Configuration');
    expect(configurationLink).toBeInTheDocument();
  });

  test('should toggle dark mode on button click', () => {
    expect(document.body.classList.contains('darkmode')).toBe(false);

    const themeSwitchButton = screen.getByTestId('theme-switch');
    fireEvent.click(themeSwitchButton);

    expect(document.body.classList.contains('darkmode')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');

    fireEvent.click(themeSwitchButton);

    expect(document.body.classList.contains('darkmode')).toBe(false);
    expect(localStorage.getItem('theme')).toBe(null);
  });
});
