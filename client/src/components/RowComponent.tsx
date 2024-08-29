import '../styles.css';

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
    <div className='table-cell'>{functionName}</div>
    <div className='table-cell'>{avgBilledDur} ms</div>
    <div className='table-cell'>{coldStarts}</div>
    <div className='table-cell'>{percentage}%</div>
  </div>
  );
};

export default RowComponent;