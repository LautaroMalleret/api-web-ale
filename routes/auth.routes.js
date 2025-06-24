const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

const router = express.Router();

const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email y password son obligatorios' });

  const usuario = await Usuario.findOne({ email });
  if (!usuario)
    return res.status(401).json({ error: 'Credenciales inválidas' });
console.log(usuario)
  const passwordCorrecta = await bcrypt.compare(password, usuario.passwordHash);
  if (!passwordCorrecta)
    return res.status(401).json({ error: 'Credenciales inválidas' });

  const token = jwt.sign({ email: usuario.email }, process.env.JWT_SECRET, {
    expiresIn: '4h'
  });

  res.json({ token });
});

module.exports = router;
