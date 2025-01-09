import React, { useState } from 'react';
import './Auth.css';
import backgroundF from '../assets/backgroundF.avif'; // Importar la imagen desde `src/assets`

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    if (data.success) {
      alert('Se ha enviado un correo para restablecer la contraseña');
      onBackToLogin();
    } else {
      alert('Error al intentar restablecer la contraseña');
    }
  };

  return (
    <div
      className="auth-container"
      style={{ backgroundImage: `url(${backgroundF})` }} // Aplicar la imagen como estilo en línea
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Olvido de Contraseña</h2>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit"><span>Enviar Código</span></button>
        <button type="button" onClick={onBackToLogin} className="secondary-button"><span>Volver a Inicio de Sesión</span></button>
      </form>
    </div>
  );
};

export default ForgotPassword;
