// routes/auth.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Ruta de registro (opcional, para agregar usuarios de forma segura)
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      role
    });
    await newUser.save();
    res.status(201).send('Usuario registrado exitosamente');
  } catch (err) {
    res.status(500).send('Error al registrar usuario: ' + err.message);
  }
});

// Ruta de login
router.post('/login', async (req, res) => {
  const { username, password } = req.body; // No pedimos el rol en el login

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    // Crear el token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Devolver el token
    res.status(200).json({ token });

  } catch (err) {
    res.status(500).json({ message: 'Error del servidor: ' + err.message });
  }
});

module.exports = router;