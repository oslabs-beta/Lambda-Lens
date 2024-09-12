import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ColdStartsMetricsContainer from '../containers/ColdStartsMetricsContainer';

interface RowComponentProps {
  functionName: string;
  avgBilledDur: number;
  coldStarts: number;
  percentage: number;
}

vi.mock('../components/RowComponent', () => {
  return {
    default: (props: RowComponentProps) => (
      <div>
        <div>{props.functionName}</div>
        <div>{props.avgBilledDur}</div>
        <div>{props.coldStarts}</div>
        <div>{props.percentage}</div>
      </div>
    ),
  };
});

describe('ColdStartsMetricsContainer', () => {
  const mockData = [
    {
      functionName: 'Function1',
      avgBilledDur: 123,
      numColdStarts: 5,
      percentColdStarts: 10,
    },
    {
      functionName: 'Function2',
      avgBilledDur: 456,
      numColdStarts: 10,
      percentColdStarts: 20,
    },
  ];

  it('renders the correct header and data rows', () => {
    render(<ColdStartsMetricsContainer data={mockData} />);

    expect(screen.getByText('Cold Start Performance Metrics')).toBeInTheDocument();
    expect(screen.getByText('Function Name')).toBeInTheDocument();
    expect(screen.getByText('Average Billed Duration')).toBeInTheDocument();
    expect(screen.getByText('# Cold Starts')).toBeInTheDocument();
    expect(screen.getByText('% Cold Starts')).toBeInTheDocument();

    expect(screen.getByText('Function1')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();


    const coldStartsElements = screen.getAllByText('5');
    expect(coldStartsElements).toHaveLength(1); 
    expect(coldStartsElements[0]).toBeInTheDocument(); 

    const percentColdStartsElements = screen.getAllByText('10');
    expect(percentColdStartsElements).toHaveLength(2); 
    expect(percentColdStartsElements[0]).toBeInTheDocument(); 
    expect(percentColdStartsElements[1]).toBeInTheDocument(); 

    const percentColdStartsElements2 = screen.getAllByText('20');
    expect(percentColdStartsElements2).toHaveLength(1); 
    expect(percentColdStartsElements2[0]).toBeInTheDocument(); 
  });
});