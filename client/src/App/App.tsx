import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashboardContainer from "../pages/PerformanceOverview/PerformanceOverview";
import CloudwatchContainer from "../pages/CloudWatchMetrics/CloudWatchMetrics";
import NavbarComponent from "../components/Navbar/Navbar";
import ConfigPageContainer from "../pages/Config/Config";
import ChatContainer from "../pages/PerformanceOverview/Chat/Chat";
import "../utils/chartSetup";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-light-cont-l dark:bg-dark-cont-l text-light-text-prim dark:text-dark-text-prim">
        <div className="sticky top-0 p-4 z-10">
          <NavbarComponent />
        </div>
        <div className="pt-2">
          <Routes>
            <Route path="/" element={<ConfigPageContainer />} />
            <Route path="/dash" element={<DashboardContainer />} />
            <Route path="/cloudwatchmetrics" element={<CloudwatchContainer />} />
            <Route path="/chat" element={<ChatContainer />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;