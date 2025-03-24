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
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2.5 py-3 px-4 items-center bg-[#e1e1e1] dark:bg-[#363636] hover:bg-[#d1d1d1] dark:hover:bg-[#404040] rounded-lg text-[#161616] dark:text-white transition-colors">
      <div>{functionName}</div>
      <div>{avgBilledDur.toFixed(2)} ms</div>
      <div>{coldStarts}</div>
      <div>{percentage.toFixed(1)}%</div>
    </div>
  );
};

export default RowComponent;
