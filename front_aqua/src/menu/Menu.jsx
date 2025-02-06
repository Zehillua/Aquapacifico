import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Menu.module.css'; // Asegúrate de que la ruta sea correcta
import logo from '../assets/LogoAquaPacifico.jpg'; // Asegúrate de que la ruta sea correcta

const Menu = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Redirigir a la página de inicio de sesión al cerrar sesión
  };


  return (
    <div className={styles.menuContainer}>
      <img src={logo} alt="Logo AquaPacifico" className={styles.menuLogo} />
      <div className={styles.menuContent}>
        <h2 className={styles.menuHeading}>¿Qué desea hacer?</h2>
        <div className={styles.menuButtonContainer}>
          <button className={styles.menuButton} onClick={() => navigate('/registro')}>
            Nuevo Registro
          </button>
          <button className={styles.menuButton} onClick={() => navigate('/evaluaciones')}>
            Ver Evaluaciones
          </button>
        </div>
      </div>
      <button className={styles.menuCloseButton} onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
};

export default Menu;
