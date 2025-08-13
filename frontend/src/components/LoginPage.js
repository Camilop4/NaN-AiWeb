import React, { useState } from 'react';
import './LoginPage.css';
import axios from 'axios';

// Importa las imágenes
import adminIcon from '../assests/admin_icon.gif';
import sellerIcon from '../assests/seller_icon.gif';
import defaultIcon from '../assests/perfil.gif'; // Usaremos perfil como el icono por defecto
import clientIcon from '../assests/default_role_icon.png';

function LoginPage() {

  // Consolidamos todos los estados del formulario en un solo objeto
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    selectedRole: 'Administrador', // Valor por defecto
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Lógica para seleccionar la imagen correcta
  const getRoleImage = () => {
    switch (formData.selectedRole) {
      case 'Administrador':
        return adminIcon;
      case 'Vendedor':
        return sellerIcon;
      case 'Cajero': // Asumimos que "Cajero" usa el mismo ícono que el cliente
        return clientIcon;
      default:
        return defaultIcon;
    }
  };

  // Función para manejar los cambios en los campos
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Lógica para manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault(); // Evita que la página se recargue
    setError('');
    setSuccess('');

    try {
      // Nuestro backend solo espera username y password para el login
      const response = await axios.post('https://nan-aiweb.onrender.com/api/login', {
        username: formData.username,
        password: formData.password
      });

      // ¡Aquí está el cambio clave! El backend ahora devuelve un JSON con un token.
      if (response.data.token) {
        // Guardamos el token en el almacenamiento local del navegador
        localStorage.setItem('token', response.data.token);
        
        // El estado 'success' ya no es solo un string, podemos usarlo para redireccionar
        setSuccess('¡Login exitoso! Redireccionando...');
        console.log('Login Exitoso, Token:', response.data.token);
        
        // Simular una redirección después de 2 segundos (usando el rol para decidir a dónde)
        setTimeout(() => {
          if (formData.selectedRole === 'Administrador') {
            window.location.href = '/admin/dashboard'; // Redirigir al dashboard de admin
          } else {
            window.location.href = '/user/dashboard'; // Redirigir a otro dashboard
          }
        }, 2000);
        
      }
    } catch (err) {
      // Manejo de errores específicos del backend
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('No se pudo conectar con el servidor.');
      }
    }
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <h2>Iniciar Sesión</h2>
      </header>
      <main className="login-form">
        <div className="role-icon-container">
          <img src={getRoleImage()} alt="Icono de rol" className="role-icon" />
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Usuario:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Rol:</label>
            <select
              id="role"
              name="selectedRole"
              value={formData.selectedRole}
              onChange={handleChange}
            >
              <option value="Administrador">Administrador</option>
              <option value="Vendedor">Vendedor</option>
              <option value="Cajero">Cajero</option>
            </select>
          </div>
          <button type="submit" className="login-button">Acceder</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
        </form>
      </main>
    </div>
  );
}

export default LoginPage;