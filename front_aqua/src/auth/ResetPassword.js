import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResetPassword.css';
import background from '../assets/background.jpg';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  // Obtener el correo verificado desde localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("verifiedEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      alert("No se encontró un correo verificado. Por favor, verifica tu código nuevamente.");
      navigate('/verify-code');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    console.log("Nueva contraseña ingresada:", newPassword); // Imprimir la nueva contraseña

    const response = await fetch('http://localhost:5000/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: email, newPassword: newPassword })
    });

    const data = await response.json();
    console.log("Datos recibidos:", data); // Imprimir los datos recibidos

    if (data.success) {
      alert('Contraseña restablecida correctamente.');
      navigate('/login');
    } else {
      alert(data.message || 'Error al restablecer la contraseña');
    }
  };

  return (
    <div className="auth-container" style={{ backgroundImage: `url(${background})` }}>
      <form className="auth-form" onSubmit={handleSubmit}>
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
        <button type="submit"><span>Restablecer Contraseña</span></button>
        <button type="button" onClick={() => navigate('/forgot-password')} className="secondary-button"><span>Regresar</span></button>
      </form>
    </div>
  );
};

export default ResetPassword;
