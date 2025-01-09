import React, { useState } from 'react';
import './App.css';
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';

function App() {
  const [page, setPage] = useState('login');

  const handleRegister = () => setPage('register');
  const handleForgotPassword = () => setPage('forgotPassword');
  const handleLogin = () => setPage('login');

  return (
    <div className="App">
      {page === 'login' && <Login onRegister={handleRegister} onForgotPassword={handleForgotPassword} />}
      {page === 'register' && <Register onBackToLogin={handleLogin} />}
      {page === 'forgotPassword' && <ForgotPassword onBackToLogin={handleLogin} />}
    </div>
  );
}

export default App;
