import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate(); // Usa `useNavigate`
  const location = useLocation(); // Usa `useLocation` para acceder al estado

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const response = await fetch('http://localhost:5000/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: location.state.email, newPassword })
    });

    const data = await response.json();
    if (data.success) {
      alert('Contraseña restablecida con éxito');
      navigate('/login'); // Redirigir a la página de inicio de sesión
    } else {
      alert('Error al restablecer la contraseña');
    }
  };

  return (
    <div className="reset-password-container">
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <h2>Restablecer Contraseña</h2>
        <div className="form-group">
          <label>Nueva Contraseña:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirmar Nueva Contraseña:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Confirmar</button>
      </form>
    </div>
  );
};

export default ResetPassword;
