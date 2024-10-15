// srcback/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';
import User from '../models/user.models.js';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Autenticación inválida' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);
    const user = await User.findById(decoded.userId).select('-password'); // Excluir contraseña
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }
    req.user = user; // Adjuntar usuario a la solicitud
    next();
  } catch (error) {
    console.error('Error en authMiddleware:', error);
    res.status(401).json({ message: 'Token inválido' });
  }
};

export default authMiddleware;
