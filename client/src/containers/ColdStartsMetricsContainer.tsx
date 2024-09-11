import RowComponent from "../components/RowComponent";

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
    <div className="cold-starts-container">
      <h2>Cold Start Performance Metrics</h2>
      <div className="table">
        <div className="header-row">
          <div>Function Name</div>
          <div>Average Billed Duration</div>
          <div># Cold Starts</div>
          <div>% Cold Starts</div>
        </div>
        <div className="table-body">
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