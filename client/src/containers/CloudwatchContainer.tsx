import InvocErrComponent from '../components/InvocErrComponent';
import ThrottleComponent from '../components/ThrottleComponent';
import TotalDurationComponent from '../components/TotalDurationComponent';

const CloudwatchContainer = () => {
  return (
    <div>
      <h1>CloudWatch Metrics</h1>
      <div className="container">
        <div className="charts-column">
          <InvocErrComponent />
          <ThrottleComponent />
        </div>
        <div className="offset-graph">
          <TotalDurationComponent />
        </div>
      </div>
    </div>
  );
};

export default CloudwatchContainer;