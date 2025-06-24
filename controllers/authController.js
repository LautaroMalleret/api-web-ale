const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const UsuarioAutorizado = require('../models/Usuario');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verificarGoogleToken = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    const autorizado = await UsuarioAutorizado.findOne({ email });

    if (!autorizado) {
      return res.status(403).json({ error: 'Acceso no autorizado' });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '4h'
    });

    res.json({ token });
  } catch (error) {
    console.error('Error al verificar el token de Google:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = { verificarGoogleToken };
