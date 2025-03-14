import "../../styles/Graphs.css";

const RowComponent = ({
  functionName,
  avgBilledDur,
  coldStarts,
  percentage,
}: {
  functionName: string;
  avgBilledDur: number;
  coldStarts: number;
  percentage: number;
}) => {
  return (
    <div className="table-row">
      <div>{functionName}</div>
      <div>{avgBilledDur.toFixed(2)} ms</div>
      <div>{coldStarts}</div>
      <div>{percentage.toFixed(1)}%</div>
    </div>
  );
};

export default RowComponent;
