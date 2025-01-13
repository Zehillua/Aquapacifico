import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';
import background from '../assets/background.jpg'; // Importar la imagen desde `src/assets`

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const navigate = useNavigate(); // Usa `useNavigate`

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email !== confirmEmail) {
      alert('Los correos electrónicos no coinciden');
      return;
    }

    const response = await fetch('http://localhost:5000/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: email })
    });
    const data = await response.json();
    if (data.success) {
      alert('Código enviado a tu correo electrónico');
      navigate('/verify-code', { state: { email: email } }); // Redirigir a la ventana para ingresar el código
    } else if (data.message === 'Correo no encontrado') {
      alert('El correo no se encuentra en el sistema');
    } else {
      alert('Error al enviar el código');
    }
  };

  return (
    <div
      className="forgot-password-container"
      style={{ backgroundImage: `url(${background})` }}
    >
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <h2>Olvidé mi Contraseña</h2>
        <div className="form-group">
          <label>Correo Electrónico:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirmar Correo Electrónico:</label>
          <input
            type="email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Enviar Código</button>
        <button type="button" onClick={() => navigate('/login')} className="secondary-button"><span>Volver a Inicio de Sesión</span></button>
      </form>
    </div>
  );
};

export default ForgotPassword;



