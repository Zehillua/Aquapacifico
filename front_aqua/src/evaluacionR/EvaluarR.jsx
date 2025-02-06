import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './EvaluarR.module.css';

const EvaluarR = () => {
  const { registroId } = useParams();
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRentabilidad = async () => {
      try {
        const response = await fetch(`http://localhost:5000/rentabilidad/${registroId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setData(data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error al obtener la rentabilidad:", error);
      }
    };

    fetchRentabilidad();
  }, [registroId]);

  if (!data) {
    return <p>Cargando datos del registro...</p>;
  }

  return (
    <div className={styles.evaluarRContainer}>
      <div className={styles.registroDetails}>
        <h2>Datos del Registro</h2>
        <p>Fecha: {new Date(data.registro.fechaA).toLocaleDateString()}</p>
        <p>Cantidad Producida: {data.registro.cantidadPr}</p>
        <p>Retorno Esperado: {data.registro.retornoEs}</p>
        <p>Especie: {data.registro.especie}</p>
        <p>Costo Estimado: {data.registro.costoEst}</p>
        <p>Usuario: {data.registro.usuario}</p>
      </div>
      <form className={styles.evaluarRForm}>
        <div className={styles.formGroup}>
          <label htmlFor="cantidadReal">Cantidad Real</label>
          <input
            type="number"
            id="cantidadReal"
            name="cantidadReal"
            value={data.datos_adicionales.cantidad_real}
            readOnly
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="costoReal">Costo Real</label>
          <input
            type="number"
            id="costoReal"
            name="costoReal"
            value={data.datos_adicionales.costo_real}
            readOnly
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="retornoReal">Retorno Real</label>
          <input
            type="number"
            id="retornoReal"
            name="retornoReal"
            value={data.datos_adicionales.retorno_real}
            readOnly
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="utilidadReal">Utilidad Real</label>
          <input
            type="number"
            id="utilidadReal"
            name="utilidadReal"
            value={data.datos_adicionales.utilidad_real}
            readOnly
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="diferenciaCantidades">Diferencia Cantidades</label>
          <input
            type="number"
            id="diferenciaCantidades"
            name="diferenciaCantidades"
            value={data.datos_adicionales.diferencia_cantidades}
            readOnly
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="diferenciaCostos">Diferencia Costos</label>
          <input
            type="number"
            id="diferenciaCostos"
            name="diferenciaCostos"
            value={data.datos_adicionales.diferencia_costos}
            readOnly
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="diferenciaRetornos">Diferencia Retornos</label>
          <input
            type="number"
            id="diferenciaRetornos"
            name="diferenciaRetornos"
            value={data.datos_adicionales.diferencia_retornos}
            readOnly
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="comentario">Comentario</label>
          <textarea
            id="comentario"
            name="comentario"
            value={data.datos_adicionales.comentario}
            readOnly
            className={styles.textarea}
          />
        </div>
        <button type="button" className={styles.volverButton} onClick={() => navigate('/evaluaciones')}>Volver</button>
      </form>
    </div>
  );
};

export default EvaluarR;
