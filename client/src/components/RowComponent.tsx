import '../Graphs.css';

const RowComponent = ({ 
  functionName,
  avgBilledDur, 
  coldStarts, 
  percentage
}: { 
  functionName: string,
  avgBilledDur: number, 
  coldStarts: number, 
  percentage: number 
}) => {
  return (
    <div className='table-row'>
      <div>{functionName}</div>
      <div>{avgBilledDur} ms</div>
      <div>{coldStarts}</div>
      <div>{percentage}%</div>
    </div>
  );
};

export default RowComponent;