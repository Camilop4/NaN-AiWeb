// src/components/Dashboard.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DashBoard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el formulario de CRUD
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });

  // Función para obtener los productos del backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://nan-aiweb.onrender.com/api/products', {
        headers: {
          'x-auth-token': token,
        },
      });
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('token');
        navigate('/');
      } else {
        setError('Error al cargar productos.');
        setLoading(false);
      }
    }
  };

  // Se ejecuta una vez al cargar el componente
  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    fetchProducts();
  }, [token, navigate]);

  // Manejar el cambio en los campos del formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejar el envío del formulario (Crear o Actualizar)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Lógica para ACTUALIZAR un producto
        await axios.put(`https://nan-aiweb.onrender.com/api/products/${editingProduct._id}`, formData, {
          headers: { 'x-auth-token': token },
        });
      } else {
        // Lógica para CREAR un producto
        await axios.post('https://nan-aiweb.onrender.com/api/products', formData, {
          headers: { 'x-auth-token': token },
        });
      }
      // Volver a cargar la lista de productos
      fetchProducts();
      // Resetear el formulario
      setIsFormVisible(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', stock: '', category: '' });
    } catch (err) {
      setError('Error al guardar el producto.');
      console.error(err);
    }
  };

  // Función para ELIMINAR un producto
  const handleDeleteProduct = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await axios.delete(`https://nan-aiweb.onrender.com/api/products/${id}`, {
          headers: { 'x-auth-token': token },
        });
        fetchProducts(); // Recargar la lista de productos
      } catch (err) {
        setError('Error al eliminar el producto.');
        console.error(err);
      }
    }
  };

  // Función para editar un producto
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
    });
    setIsFormVisible(true);
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Renderizado condicional
  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Panel de Administrador</h1>
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2 className="section-title">Gestión de Productos</h2>
        <button
          onClick={() => {
            setIsFormVisible(!isFormVisible);
            setEditingProduct(null);
            setFormData({ name: '', description: '', price: '', stock: '', category: '' });
          }}
          className="add-product-button"
        >
          {isFormVisible ? 'Cancelar' : 'Agregar Nuevo Producto'}
        </button>

        {isFormVisible && (
          <form onSubmit={handleFormSubmit} className="product-form">
            <h3>{editingProduct ? 'Editar Producto' : 'Agregar Producto'}</h3>
            <div className="form-group">
              <label>Nombre:</label>
              <input type="text" name="name" value={formData.name} onChange={handleFormChange} required />
            </div>
            <div className="form-group">
              <label>Descripción:</label>
              <textarea name="description" value={formData.description} onChange={handleFormChange} />
            </div>
            <div className="form-group">
              <label>Categoría:</label>
              <input type="text" name="category" value={formData.category} onChange={handleFormChange} required />
            </div>
            <div className="form-group">
              <label>Precio:</label>
              <input type="number" name="price" value={formData.price} onChange={handleFormChange} required min="0" />
            </div>
            <div className="form-group">
              <label>Stock:</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleFormChange} required min="0" />
            </div>
            <button type="submit" className="save-button">
              {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
          </form>
        )}
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.category}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.stock}</td>
              <td className="actions-cell">
                <button onClick={() => handleEditProduct(product)} className="edit-button">
                  Editar
                </button>
                <button onClick={() => handleDeleteProduct(product._id)} className="delete-button">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;