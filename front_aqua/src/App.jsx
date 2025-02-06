import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';
import VerifyCode from './auth/VerifyCode';
import ResetPassword from './auth/ResetPassword';
import Menu from './menu/Menu';
import Registro from './registros/Registros';
import Evaluaciones from './evaluacionR/Evaluaciones';
import ProtectedRoute from './components/ProtectedRoute';
import FontSizeControl from './components/FontSizeControl';

const App = () => {
  return (
    <div className="App">
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
            <Route path="/registro" element={<ProtectedRoute><Registro /></ProtectedRoute>} />
            <Route path="/evaluaciones" element={<ProtectedRoute><Evaluaciones /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/login" />} /> {/* Redirigir cualquier ruta desconocida a /login */}
          </Routes>
        </Router>
      </header>
    </div>
  );
};

export default App;
