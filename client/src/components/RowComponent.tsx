import '../styles.css';

const RowComponent = ({ 
  functionName, 
  coldStarts, 
  percentage
}: { 
  functionName: string, 
  coldStarts: number, 
  percentage: string 
}) => {
  return (
    <div className='data-row'>
      <div>{functionName}</div>
      <div>{coldStarts}</div>
      <div>{percentage}</div>
    </div>
  );
};

export default RowComponent;