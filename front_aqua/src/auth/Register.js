import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './Register.css';
import backgroundR from '../assets/backgroundR.jpg'; // Importar la imagen desde `src/assets`

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cargo, setCargo] = useState('');
  const [cargos, setCargos] = useState([]);
  const navigate = useNavigate(); // Usa useNavigate

  useEffect(() => {
    const fetchCargos = async () => {
      const response = await fetch('http://localhost:5000/cargos'); // Endpoint para obtener los cargos desde la base de datos
      const data = await response.json();
      setCargos(data);
    };

    fetchCargos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: name, correo: email, password, confirmPassword, cargo })
    });
    const data = await response.json();
    if (data.success) {
      alert('Registro exitoso');
      navigate('/login'); // Redirigir al inicio de sesión
    } else {
      alert('Error de registro');
    }
  };

  return (
    <div
      className="register-container"
      style={{ backgroundImage: `url(${backgroundR})` }} // Aplicar la imagen como estilo en línea
    >
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Registro</h2>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <div className="form-group">
          <label>Cargo:</label>
          <select value={cargo} onChange={(e) => setCargo(e.target.value)} required>
            <option value="">Selecciona tu cargo</option>
            {cargos.map((cargo) => (
              <option key={cargo.id} value={cargo.nombre}>{cargo.nombre}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="button"><span>Registrarse</span></button>
        <button type="button" onClick={() => navigate('/login')} className="button secondary-button"><span>Volver a Inicio de Sesión</span></button>
      </form>
    </div>
  );
};

export default Register;
