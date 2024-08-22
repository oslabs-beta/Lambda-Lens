import ColdStartsGraphComponent from "../components/ColdStartsGraphComponent";
import ColdStartsMetricsContainer from "./ColdStartsMetricsContainer";

const DashboardContainer = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <div className="dashboard-display">
        <ColdStartsGraphComponent />
        <ColdStartsMetricsContainer />
      </div>
    </div>
  )
}

export default DashboardContainer;