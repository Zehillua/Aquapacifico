import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import background from '../assets/background.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: email, password })
    });
    const data = await response.json();
    if (data.success) {
      alert('Inicio de sesión exitoso');
      localStorage.setItem('token', data.token);
      navigate('/menu');
    } else {
      alert('Error de inicio de sesión');
    }
  };

  return (
    <div
      className="auth-container"
      style={{ backgroundImage: `url(${background})` }}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Inicio de Sesión</h2>
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
        <button type="submit"><span>Iniciar Sesión</span></button>
        <button type="button" onClick={() => navigate('/register')} className="secondary-button"><span>Registrarse</span></button>
        <button type="button" onClick={() => navigate('/forgot-password')} className="secondary-button"><span>Olvidé mi Contraseña</span></button>
      </form>
    </div>
  );
};

export default Login;
