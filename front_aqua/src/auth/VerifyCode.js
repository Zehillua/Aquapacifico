import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './VerifyCode.css';

const VerifyCode = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate(); // Usa `useNavigate`
  const location = useLocation(); // Usa `useLocation` para acceder al estado

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: location.state.email, code })
    });

    const data = await response.json();
    if (data.success) {
      alert('Código verificado correctamente');
      navigate('/reset-password', { state: { email: location.state.email } }); // Redirigir a la ventana para restablecer la contraseña
    } else {
      alert('Código incorrecto');
    }
  };

  return (
    <div className="verify-code-container">
      <form className="verify-code-form" onSubmit={handleSubmit}>
        <h2>Verificar Código</h2>
        <div className="form-group">
          <label>Ingresa el Código:</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <button type="submit">Verificar Código</button>
      </form>
    </div>
  );
};

export default VerifyCode;
