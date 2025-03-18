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
    <div className="table-row !grid !grid-cols-[2fr_1fr_1fr_1fr] !gap-[10px] !py-3 !px-4 !items-center !bg-[#e1e1e1] !rounded-lg !mb-[10px] !shadow-sm dark:!bg-[#363636] dark:!text-white hover:!bg-[#f0f0f0] dark:hover:!bg-[#a2a2a2]">
      <div>{functionName}</div>
      <div>{avgBilledDur.toFixed(2)} ms</div>
      <div>{coldStarts}</div>
      <div>{percentage.toFixed(1)}%</div>
    </div>
  );
};

export default RowComponent;
