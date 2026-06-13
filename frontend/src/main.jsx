import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: '#1A1C26',
          color: '#F0F1F6',
          border: '1px solid #2A2D3E',
          borderRadius: '12px',
          fontSize: '13px',
          fontFamily: 'Inter, system-ui, sans-serif',
        },
        success: {
          iconTheme: { primary: '#6366F1', secondary: '#F0F1F6' },
        },
        error: {
          iconTheme: { primary: '#EF4444', secondary: '#F0F1F6' },
        },
      }}
    />
  </React.StrictMode>
);
