// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Obtener el token de los headers de la petición
  const token = req.header('x-auth-token');

  // Si no hay token, devolver error 401
  if (!token) {
    return res.status(401).json({ message: 'No hay token, acceso denegado.' });
  }

  try {
    // Verificar el token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adjuntar los datos del usuario decodificado a la petición
    req.user = decoded;
    next(); // Continuar a la siguiente función (la ruta)

  } catch (err) {
    // Si el token no es válido, devolver error 401
    res.status(401).json({ message: 'Token no es válido.' });
  }
};

// Middleware para verificar el rol del usuario
const checkRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ message: 'Acceso no autorizado.' });
  }
  next();
};

module.exports = { authMiddleware, checkRole };