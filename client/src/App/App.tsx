import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashboardContainer from "../pages/FunctionPerformance/FunctionPerformance";
import CloudwatchContainer from "../pages/CloudWatchMetrics/CloudWatchMetrics";
import NavbarComponent from "../components/Navbar/Navbar";
import ConfigPageContainer from "../pages/Config/Config";
import ChatContainer from "../pages/FunctionPerformance/Chat/Chat";
import "../utils/chartSetup";

function App() {
  return (
    <Router>
      <div>
        <NavbarComponent />
        <Routes>
          <Route path="/" element={<ConfigPageContainer />} />
          <Route path="/dash" element={<DashboardContainer />} />
          <Route path="/cloudwatchmetrics" element={<CloudwatchContainer />} />
          <Route path="/chat" element={<ChatContainer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
