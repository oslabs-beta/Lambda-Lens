import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './App.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
