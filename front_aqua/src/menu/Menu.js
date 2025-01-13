import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No autorizado. Por favor, inicie sesión.');
      navigate('/login'); // Redirigir a la página de inicio de sesión si no hay token
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Redirigir a la página de inicio de sesión al cerrar sesión
  };

  return (
    <div>
      <h1>Menú Principal</h1>
      <button onClick={handleLogout}>Cerrar Sesión</button>
      {/* Rutas protegidas y componentes del menú */}
    </div>
  );
};

export default Menu;
