import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import background from '../assets/background.jpg';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email !== confirmEmail) {
      alert('Los correos electrónicos no coinciden');
      return;
    }

    console.log("Correo electrónico enviado:", email); // Imprimir el correo electrónico enviado

    const response = await fetch('http://localhost:5000/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: email, confirmCorreo: confirmEmail })
    });

    console.log("Response recibido:", response); // Imprimir la respuesta del servidor

    const data = await response.json();
    console.log("Datos recibidos:", data); // Imprimir los datos recibidos

    if (data.success) {
      alert('Código enviado a tu correo electrónico');
      navigate('/verify-code');
    } else {
      alert(data.message || 'Error al enviar el código');
    }
  };

  return (
    <div className="auth-container" style={{ backgroundImage: `url(${background})` }}>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Esto es para reestablecer su contraseña</h2>
        <div className="form-group">
          <label>Ingrese su correo electrónico registrado:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Reescriba el correo electrónico para confirmar:</label>
          <input
            type="email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit"><span>Enviar Código a su correo</span></button>
        <button type="button" onClick={() => navigate('/login')} className="secondary-button"><span>Volver a Inicio de Sesión</span></button>
      </form>
    </div>
  );
};

export default ForgotPassword;
