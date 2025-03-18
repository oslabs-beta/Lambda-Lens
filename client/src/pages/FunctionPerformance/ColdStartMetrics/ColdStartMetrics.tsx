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
    <div className="flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Cold Start Performance Metrics</h2>
      <div className="flex flex-col">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2.5 px-4 py-2.5 bg-gray-300/50 dark:bg-gray-600/50 text-gray-700 dark:text-gray-300 text-sm tracking-wide">
          <div>Function Name</div>
          <div>Average Duration</div>
          <div># Cold Starts</div>
          <div>% Cold Starts</div>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          {data.map((row, index) => (
            <RowComponent
              key={index}
              functionName={row.functionName}
              avgBilledDur={row.avgBilledDur}
              coldStarts={row.numColdStarts}
              percentage={row.percentColdStarts}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColdStartsMetricsContainer;
