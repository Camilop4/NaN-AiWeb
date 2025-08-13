// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Administrador', 'Cajero', 'Vendedor'],
    required: true
  }
}, {
  timestamps: true
});

userSchema.index({ username: 1 }); // <-- Agrega este índice para que la validación sea más eficiente

module.exports = mongoose.model('User', userSchema);