// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Carga las variables del archivo .env

const authRoutes = require('./routes/auth');
const productRoutes = require('./api/productRoutes');

// Inicializa la aplicación de Express
const app = express();

// Middleware
app.use(express.json()); // Permite a Express leer el cuerpo de las peticiones en formato JSON
const corsOptions = {
  origin: 'https://tu-frontend-en-render.onrender.com', // Reemplaza con la URL que te dé Render para el frontend
  optionsSuccessStatus: 200
};
app.use(cors()); // Habilita CORS para permitir peticiones desde React

// Conectar a MongoDB
const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
  .then(() => console.log('Conexión exitosa a MongoDB Atlas'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Backend de ventas funcionando!');
});

app.use('/api', authRoutes);
app.use('/api', productRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 5000; // Usa el puerto 5000 por defecto
app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto ${PORT}`);
});