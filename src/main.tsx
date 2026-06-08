import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent benign Vite development HMR or WebSocket connection failures from causing unhandled rejections or error overlays in the browser
if (typeof window !== 'undefined') {
  const isWebsocketError = (err: any) => {
    if (!err) return false;
    const msg = String(err.message || err.reason || err);
    return msg.includes('WebSocket') || msg.includes('vite') || msg.includes('hmr') || msg.includes('ws://');
  };

  window.addEventListener('unhandledrejection', (event) => {
    if (isWebsocketError(event.reason) || isWebsocketError(event)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('error', (event) => {
    if (isWebsocketError(event.error) || isWebsocketError(event.message) || isWebsocketError(event)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

