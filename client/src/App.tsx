import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashboardContainer from './containers/DashboardContainer';
import CloudwatchContainer from './containers/CloudwatchContainer';
import NavbarComponent from './components/NavbarComponent';
import ConfigPageContainer from './containers/ConfigPageContainer';
import './App.css'
import './chartSetup';

function App() {

  return (
    <Router>
      <div>
        <NavbarComponent />
        <Routes>
          <Route path='/' element={<DashboardContainer />} />
          <Route path='/cloudwatchmetrics' element={<CloudwatchContainer />} />
          <Route path='/configuration' element={<ConfigPageContainer />} />
        </Routes> 
      </div>
    </Router>
  )
  }
  
  export default App
  
  