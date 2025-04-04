import RowComponent from "../../../components/Row/Row";

interface FunctionData {
  functionName: string;
  avgBilledDur: number;
  numColdStarts: number;
  percentColdStarts: number;
}

interface Props {
  data: FunctionData[];
}

const ColdStartsMetricsContainer = ({ data }: Props) => {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-dark-text-prim">Cold Start Performance Metrics</h2>
      <p className="text-sm text-gray-500 dark:text-dark-text-sec mb-4">
        Function performance breakdown
      </p>
      <div className="flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"> 
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-3 py-2 bg-gray-50 dark:bg-dark-cont-s border-b border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-500 dark:text-dark-text-sec uppercase tracking-wider">
          <div>Function Name</div>
          <div className="text-right">Avg Duration</div>
          <div className="text-right"># Cold Starts</div>
          <div className="text-right">% Cold Starts</div>
        </div>
        <div className="flex flex-col bg-white dark:bg-dark-cont-l"> 
          {data.map((row, index) => (
            <RowComponent
              key={row.functionName || index}
              functionName={row.functionName}
              avgBilledDur={row.avgBilledDur}
              coldStarts={row.numColdStarts}
              percentage={row.percentColdStarts}
            />
          ))}
          {data.length === 0 && (
            <div className="text-center py-4 text-gray-500 dark:text-dark-text-sec">No data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColdStartsMetricsContainer;
