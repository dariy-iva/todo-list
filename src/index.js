import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App/App';
import reportWebVitals from './reportWebVitals';
import CustomProvider from "./components/CustomProvider/CustomProvider";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CustomProvider>
    <App/>
  </CustomProvider>
);

reportWebVitals();
