import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Registros.module.css'; // Importar los estilos modulados
import logo from '../assets/LogoAquaPacifico.jpg'; // Asegúrate de que la ruta sea correcta

const Registros = () => {
  const [especieSeleccionada, setEspecieSeleccionada] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [retorno, setRetorno] = useState('');
  const [costo, setCosto] = useState('');
  const [especies, setEspecies] = useState([]);
  const [fechaActual, setFechaActual] = useState('');
  const [imagenEspecie, setImagenEspecie] = useState('');
  const[isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No autorizado. Por favor, inicie sesión.');
      navigate('/login'); // Redirigir a la página de inicio de sesión si no hay token
    } else {
      setFechaActual(new Date().toLocaleDateString());
      fetchEspecies(); // Llamar a la función para obtener las especies desde el backend
    }
  }, [navigate]);

  const fetchEspecies = async () => {
    try {
      const response = await fetch('http://localhost:5000/especies');
      const data = await response.json();
      setEspecies(data);
    } catch (error) {
      console.error("Error al obtener las especies:", error);
      alert("Error al obtener las especies.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Redirigir a la página de inicio de sesión al cerrar sesión
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true); 

    const formData ={
      cantidadPr: cantidad,
      retornoEs: retorno,
      especie: especieSeleccionada,
      costoEst: costo
    };
    const token = localStorage.getItem('token');
    try{
      
      const response = await fetch('http://localhost:5000/registros',{ 
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 
                   'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al enviar el formulario');
      }

      const data = await response.json();

      if (data.inserted_id) {
        alert('Registro ingresado correctamente');
      }

    } catch(error){
      alert("Error al ingresar el registro.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEspecieChange = (e) => {
    const especie = e.target.value;
    setEspecieSeleccionada(especie);

    // Actualizar la imagen correspondiente a la especie seleccionada
    if (especie) {
      setImagenEspecie(require(`../assets/${especie}.png`)); // Asegúrate de que la ruta sea correcta
    } else {
      setImagenEspecie('');
    }
  };

  return (
    <div className={styles.registrosContainer}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="Logo AquaPacifico" className={styles.registrosLogo} />
      </div>
      <div className={styles.registrosHeader}>
        <h1>Registro evaluación</h1>
      </div>
      <div className={styles.formContainer}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Fecha:</label>
            <input type="text" value={fechaActual} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label>Cantidad a producir:</label>
            <input 
              type="number" 
              value={cantidad} 
              onChange={(e) => setCantidad(e.target.value)} 
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label>Retorno esperado:</label>
            <input 
              type="number" 
              value={retorno} 
              onChange={(e) => setRetorno(e.target.value)} 
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label>Seleccionar especie:</label>
            <select 
              value={especieSeleccionada} 
              onChange={handleEspecieChange} 
              required
            >
              <option value="">Seleccione una especie</option>
              {especies.map((especie) => (
                <option key={especie.id} value={especie.nombre}>{especie.nombre}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Costo estimado:</label>
            <input 
              type="number" 
              value={costo} 
              onChange={(e) => setCosto(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className={styles.submitButton}>Ingresar Registro</button>
        </form>
        <div className={styles.imageContainer}>
          {imagenEspecie && (
            <img 
              src={imagenEspecie} 
              alt={especieSeleccionada} 
              className={styles.speciesImage} 
              key={imagenEspecie}
            />
          )}
        </div>
      </div>
      <button className={styles.registrosCloseButton} onClick={() => navigate('/menu')}>
          Volver
      </button>
    </div>
  );
};

export default Registros;
