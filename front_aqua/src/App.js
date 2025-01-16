import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';
import VerifyCode from './auth/VerifyCode';
import ResetPassword from './auth/ResetPassword';
import Menu from './menu/Menu';
import ProtectedRoute from './components/ProtectedRoute';
import FontSizeControl from './components/FontSizeControl';
import backgroundImage from './assets/background.jpg';  // Asegúrate de ajustar la ruta según tu estructura

const App = () => {
  return (
    <div className="App" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}>
      <header className="App-header">
        <FontSizeControl />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-code" element={<VerifyCode />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/login" />} /> {/* Redirigir cualquier ruta desconocida a /login */}
          </Routes>
        </Router>
      </header>
    </div>
  );
};

export default App;
