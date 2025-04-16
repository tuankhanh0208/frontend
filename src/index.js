// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Xử lý redirect từ 404.html cho client-side routing
(function() {
  // Kiểm tra xem có redirect trong sessionStorage không
  const redirect = sessionStorage.redirect;
  // Xóa redirect để không lặp lại việc redirect
  delete sessionStorage.redirect;
  
  // Nếu có redirect và đường dẫn hiện tại là root, điều hướng đến đường dẫn cũ
  if (redirect && redirect !== window.location.href) {
    window.history.replaceState(null, null, redirect);
  }
})();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();