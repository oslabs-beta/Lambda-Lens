import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RowComponent from '../components/RowComponent'; 

describe('RowComponent', () => {
  it('renders correctly with given props', () => {
    const sampleProps = {
      functionName: 'TestFunction',
      avgBilledDur: 123,
      coldStarts: 45,
      percentage: 67,
    };

    render(<RowComponent {...sampleProps} />);

    expect(screen.getByText('TestFunction')).toBeInTheDocument();
    expect(screen.getByText('123 ms')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('67%')).toBeInTheDocument();
  });
});