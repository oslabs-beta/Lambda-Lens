import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashboardContainer from '../containers/DashboardContainer';
// import CloudwatchContainer from './containers/CloudwatchContainer';
// import ConfigPageContainer from './containers/ConfigPageContainer';
// import ChatContainer from './containers/ChatContainer';

describe('App Component', () => {
  it('should render DashboardContainer on the home route', () => {
    render(
      <Router>
        <Routes>
          <Route path='/' element={<DashboardContainer />} />
        </Routes>
      </Router>
    );
    expect(screen.getByRole('heading', { name: /Function Performance/i })).toBeInTheDocument();
  });
});