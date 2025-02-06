import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Evaluaciones.module.css';
import logo from '../assets/LogoAquaPacifico.jpg'; // Asegúrate de que la ruta sea correcta

const Evaluaciones = () => {
  const [registros, setRegistros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegistros = async () => {
      try {
        const response = await fetch('http://localhost:5000/evaluaciones', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Incluir el token en el encabezado
          }
        });
        const data = await response.json();
        if (data.success) {
          setRegistros(data.registros);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error al obtener los registros:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistros();
  }, []);

  const handleEvaluarRenta = (registroId) => {
    navigate(`/evaluarR/${registroId}`);
  };

  return (
    <div className={styles.evaluacionesContainer}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="Logo AquaPacifico" className={styles.logo} />
      </div>
      <h1>Visualizador de Registros</h1>
      {isLoading ? (
        <p>Cargando registros...</p>
      ) : (
        <div className={styles.registrosList}>
          {registros.map((registro) => (
            <div key={registro._id} className={styles.registroItem}>
              <div className={styles.registroDetails}>
                <p>Fecha: {new Date(registro.fechaA).toLocaleDateString()}</p>
                <p>Cantidad Producida: {registro.cantidadPr}</p>
                <p>Retorno Esperado: {registro.retornoEs}</p>
                <p>Especie: {registro.especie}</p>
                <p>Costo Estimado: {registro.costoEst}</p>
                <p>Usuario: {registro.usuario}</p>
              </div>
              <div className={styles.registroImage}>
                <img src={require(`../assets/${registro.especie}.png`)} alt={registro.especie} />
              </div>
              <button className={styles.evaluarRentaButton} onClick={() => handleEvaluarRenta(registro._id)}>
                Evaluar Renta
              </button>
            </div>
          ))}
        </div>
      )}
      <button className={styles.volverButton} onClick={() => navigate('/menu')}>Volver</button>
    </div>
  );
};

export default Evaluaciones;
