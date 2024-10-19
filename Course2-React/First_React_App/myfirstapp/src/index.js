import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

function refresh() {
  root.render(<App />);
}

setInterval(refresh, 1000);


