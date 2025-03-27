import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import DashboardContainer from "../pages/PerformanceOverview/PerformanceOverview";
import CloudwatchContainer from "../pages/FunctionAnalytics/FunctionAnalytics";
import NavbarComponent from "../components/Navbar/Navbar";
import ConfigPageContainer from "../pages/Config/Config";
import ChatContainer from "../pages/PerformanceOverview/Chat/Chat";
import LandingPage from "../pages/Landing/LandingPage"; // Import the new page
import "../utils/chartSetup";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/';

  return (
    <div className="min-h-screen bg-light-cont-l dark:bg-dark-cont-l text-light-text-prim dark:text-dark-text-prim">
      {showNavbar && (
        <div className="sticky top-0 p-4 z-10">
          <NavbarComponent />
        </div>
      )}
      <div className={showNavbar ? "pt-2" : ""}>
        {children}
      </div>
    </div>
  );
};


function App() {
  return (
    <Router>
      <Layout> 
        <Routes>
          <Route path="/" element={<LandingPage />} /> 
          <Route path="/config" element={<ConfigPageContainer />} /> 
          <Route path="/dash" element={<DashboardContainer />} />
          <Route path="/cloudwatchmetrics" element={<CloudwatchContainer />} />
          <Route path="/chat" element={<ChatContainer />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;