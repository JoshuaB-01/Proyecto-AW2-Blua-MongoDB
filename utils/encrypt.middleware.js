import bcrypt from 'bcryptjs';
import User from '../db/schemas/user.schema.js';
import { connectToDatabase } from '../db/connection.js';

export const encryptPasswords = async (req, res, next) => {
    try {
    
        if (req.path === '/login') {
            return next();
        }

        if (req.body.contraseña) {
            const salt = bcrypt.genSaltSync(10);
            req.body.contraseña = bcrypt.hashSync(req.body.contraseña, salt);
        }
        next();
    } catch (error) {
        console.error('Error al encriptar:', error);
        res.status(500).json({ error: 'Error al procesar la contraseña' });
    }
};

export const encryptMongoPasswords = async () => {
    try {
        await connectToDatabase();
        
        const usuarios = await User.find({
            contraseña: { $not: /^\$2a\$/ }
        });

        if (usuarios.length === 0) {
            console.log('Todas las contraseñas en MongoDB ya están encriptadas');
            return;
        }
        
        for (const usuario of usuarios) {
            const salt = bcrypt.genSaltSync(10);
            const contraseñaEncriptada = bcrypt.hashSync(usuario.contraseña, salt);
            
            await User.updateOne(
                { _id: usuario._id },
                { contraseña: contraseñaEncriptada }
            );
        }

        console.log(`${usuarios.length} contraseñas encriptadas en MongoDB correctamente`);
    } catch (error) {
        console.error('Error al encriptar contraseñas en MongoDB:', error);
    }
};