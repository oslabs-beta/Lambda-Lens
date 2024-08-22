import RowComponent from "../components/RowComponent";
// import '../styles.css';

const ColdStartsMetricsContainer = () => {
  const dummyData = [
    { functionName: 'Function A', coldStarts: 10, percentage: '15%' },
    { functionName: 'Function B', coldStarts: 5, percentage: '1%' },
    { functionName: 'Function C', coldStarts: 1, percentage: '5%' },
    { functionName: 'Function D', coldStarts: 15, percentage: '7%' },
    { functionName: 'Function E', coldStarts: 6, percentage: '9%' },
  ];

  return (
    <div>
      <h2>Cold Start Performance Metrics</h2>
      <div className="header-row">
        <div>Function Name</div>
        <div># Cold Starts</div>
        <div>% Cold Starts</div>
      </div>
      {dummyData.map((row, index) => (
        <RowComponent
        key={index}
        functionName={row.functionName}
        coldStarts={row.coldStarts}
        percentage={row.percentage}
        />
      ))}
    </div>
  );
};

export default ColdStartsMetricsContainer;