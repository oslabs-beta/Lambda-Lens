import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import DashboardContainer from "../pages/PerformanceOverview/PerformanceOverview";
import CloudwatchContainer from "../pages/FunctionAnalytics/FunctionAnalytics";
import NavbarComponent from "../components/Navbar/Navbar";
import ConfigPageContainer from "../pages/Config/Config";
import ChatContainer from "../pages/PerformanceOverview/Chat/Chat";
import LandingPage from "../pages/Landing/LandingPage";
import LoginPage from "../pages/Login/LoginPage";
import SignupPage from "../pages/Signup/SignupPage";
import { AuthProvider, useAuth } from "../context/AuthContext"; 
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute"; 
import "../utils/chartSetup";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-light-cont-l dark:bg-dark-cont-l text-light-text-prim dark:text-dark-text-prim">
      <div className="sticky top-0 z-10">
        <NavbarComponent />
      </div>
      <div className="pt-2"> 
        {children}
      </div>
    </div>
  );
};

const AppLayout = () => {
  const location = useLocation();
  const { loading } = useAuth(); 
  const mainLayoutPaths = ['/config', '/dash', '/cloudwatchmetrics', '/chat'];
  const useMainLayout = mainLayoutPaths.some(path => location.pathname.startsWith(path));

  if (loading && useMainLayout) {
     return <div>Loading Application...</div>; 
  }

  if (useMainLayout) {
    return (
      <MainLayout>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/config" element={<ConfigPageContainer />} />
            <Route path="/dash" element={<DashboardContainer />} />
            <Route path="/cloudwatchmetrics" element={<CloudwatchContainer />} />
            <Route path="/chat" element={<ChatContainer />} />
          </Route>
        </Routes>
      </MainLayout>
    );
  } else {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    );
  }
};


function App() {
  return (
    <AuthProvider> 
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;