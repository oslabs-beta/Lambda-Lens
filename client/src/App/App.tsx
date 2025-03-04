import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashboardContainer from "../containers/FunctionPerformance//DashboardContainer";
import CloudwatchContainer from "../containers/CloudWatchMetrics/CloudwatchContainer";
import NavbarComponent from "../components/Navbar/NavbarComponent";
import ConfigPageContainer from "../containers/ConfigPage/ConfigPageContainer";
import ChatContainer from "../containers/FunctionPerformance/Chat/ChatContainer";
import "./App.css";
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
