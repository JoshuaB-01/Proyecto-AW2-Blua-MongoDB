import jwt from 'jsonwebtoken';
import User from '../db/schemas/user.schema.js';
import 'dotenv/config';

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        console.log('Headers recibidos:', req.headers);
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                status: false, 
                error: 'Token no proporcionado o formato inválido' 
            });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token recibido:', token);

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET no configurado');
            return res.status(401).json({ 
                status: false, 
                error: 'Error de configuración del servidor' 
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Token decodificado:', decoded);

            const usuario = await User.findById(decoded.id);
            if (!usuario || !usuario.activo) {
                return res.status(401).json({ 
                    status: false, 
                    error: 'Usuario no válido' 
                });
            }

            req.user = decoded;
            next();
        } catch (err) {
            console.error('Error en verificación:', err);
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    status: false, 
                    error: 'Token expirado',
                    expired: true
                });
            }
            return res.status(401).json({ 
                status: false, 
                error: 'Token inválido' 
            });
        }
    } catch (error) {
        console.error('Error general:', error);
        return res.status(500).json({ 
            status: false, 
            error: 'Error al verificar token' 
        });
    }
};