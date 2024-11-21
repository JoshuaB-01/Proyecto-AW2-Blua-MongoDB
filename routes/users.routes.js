import { Router } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser } from '../db/actions/user.action.js';
import User from '../db/schemas/user.schema.js';
import 'dotenv/config';

const router = Router();

router.post('/create', async(req,res) => {
    const {nombre, apellido, email, contraseña, activo} = req.body;
    try {
        const salt = bcrypt.genSaltSync(10);
        const contraseñaEncriptada = bcrypt.hashSync(contraseña, salt);
        
        const result = await createUser({
            nombre, 
            apellido, 
            email, 
            contraseña: contraseñaEncriptada, 
            activo
        });
        
        res.status(200).json(result);
    } catch(error) {
        console.error('Error al crear usuario:', error);
        res.status(400).json({ error: 'Error al crear usuario' });
    }
});

router.post('/login', async(req, res) => {
    const { email, contraseña } = req.body;
    try {
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ 
                status: false,
                error: 'Usuario no encontrado' 
            });
        }

        const controlPass = await bcrypt.compare(contraseña, user.contraseña);
        
        if (!controlPass) {
            return res.status(401).json({ 
                status: false,
                error: 'Contraseña incorrecta' 
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                nombre: user.nombre
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );

        const userData = {
            id: user._id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            activo: user.activo
        };

        res.status(200).json({
            status: true,
            token,
            user: userData
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ 
            status: false, 
            error: 'Error interno del servidor' 
        });
    }
});

export default router;