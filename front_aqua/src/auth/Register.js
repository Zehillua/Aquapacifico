import React, { useState } from 'react';
import './Auth.css';
import backgroundR from '../assets/backgroundR.jpg'; // Importar la imagen desde `src/assets`

const Register = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (data.success) {
      alert('Registro exitoso');
      onBackToLogin();
    } else {
      alert('Error de registro');
    }
  };

  return (
    <div
      className="auth-container"
      style={{ backgroundImage: `url(${backgroundR})` }} // Aplicar la imagen como estilo en línea
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Registro</h2>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirmar Contraseña:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit"><span>Registrarse</span></button>
        <button type="button" onClick={onBackToLogin} className="secondary-button"><span>Volver a Inicio de Sesión</span></button>
      </form>
    </div>
  );
};

export default Register;

