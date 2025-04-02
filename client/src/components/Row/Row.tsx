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
    // Target: White background, bottom border, specific padding, no hover bg change
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 py-3 px-3 items-center bg-white dark:bg-dark-cont-l border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-dark-text-prim transition-colors">
      {/* Ensure truncation works */}
      <div className="truncate font-medium" title={functionName}>{functionName}</div>
      {/* Target: Align numbers right, potentially adjust text color */}
      <div className="text-right text-gray-700 dark:text-dark-text-sec">{avgBilledDur.toFixed(2)} ms</div>
      <div className="text-right text-gray-700 dark:text-dark-text-sec">{coldStarts}</div>
      <div className="text-right text-gray-700 dark:text-dark-text-sec">{percentage.toFixed(1)}%</div>
    </div>
  );
};

export default RowComponent;
