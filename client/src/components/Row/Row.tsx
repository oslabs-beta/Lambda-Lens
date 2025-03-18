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
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2.5 py-3 px-4 items-center bg-gray-200 dark:bg-gray-700 rounded-lg mb-2.5 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white transition-colors">
      <div>{functionName}</div>
      <div>{avgBilledDur.toFixed(2)} ms</div>
      <div>{coldStarts}</div>
      <div>{percentage.toFixed(1)}%</div>
    </div>
  );
};

export default RowComponent;
