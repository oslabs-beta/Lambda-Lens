// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashboardContainer from './containers/DashboardContainer';
import CloudwatchContainer from './containers/CloudwatchContainer';
import NavbarComponent from './components/NavbarComponent';
import './App.css'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Router>
      <div>
        <NavbarComponent />
        <Routes>
          <Route path='/' element={<DashboardContainer />} />
          <Route path='/cloudwatchmetrics' element={<CloudwatchContainer />} />
        </Routes> 
      </div>
    </Router>
  )
  }
  
  export default App
  
  // <>
    {/* <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src={viteLogo} className="logo" alt="Vite logo" />
      </a>
      <a href="https://react.dev" target="_blank">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
    </div>
    <h1>Vite + React</h1>
    <div className="card">
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      <p>
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
    </div>
    <p className="read-the-docs">
      Click on the Vite and React logos to learn more
    </p> */}

  // </>