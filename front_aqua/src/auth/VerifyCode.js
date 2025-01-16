import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VerifyCode.css';
import background from '../assets/backgroundR.jpg';

const VerifyCode = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Código ingresado:", code); // Imprimir el código ingresado

    const response = await fetch('http://localhost:5000/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code })  // Solo enviar el código
    });

    const data = await response.json();
    console.log("Datos recibidos:", data); // Imprimir los datos recibidos

    if (data.success) {
      alert('Código verificado correctamente.');
      // Guardar el correo verificado, puede ser en el estado o en localStorage
      localStorage.setItem("verifiedEmail", data.email);
      navigate('/reset-password');
    } else {
      alert(data.message || 'Error al verificar el código');
    }
  };

  return (
    <div className="auth-container" style={{ backgroundImage: `url(${background})` }}>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Verificar Código</h2>
        <div className="form-group">
          <label>Código:</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <button type="submit"><span>Verificar</span></button>
        <button type="button" onClick={() => navigate('/forgot-password')} className="secondary-button"><span>Regresar</span></button>
      </form>
    </div>
  );
};

export default VerifyCode;
