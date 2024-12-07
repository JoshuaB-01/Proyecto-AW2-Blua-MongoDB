import mongoose from 'mongoose';
import { Order } from '../schemas/orders.schema.js';
import User from '../schemas/user.schema.js';
import { connectToDatabase } from "../connection.js";

export const crearOrdenAction = async (req, res) => {
    try {
        await connectToDatabase();
        const { usuario, items } = req.body;

        const usuarioExistente = await User.findById(usuario.id).select('nombre apellido email');
        if (!usuarioExistente) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const total = items.reduce((sum, item) => sum + item.total, 0);
        
        const newOrder = await Order.create({
            usuario: {
                id: usuarioExistente._id,
                nombre: usuarioExistente.nombre,
                apellido: usuarioExistente.apellido,
                email: usuarioExistente.email
            },
            items: items.map(item => ({
                id: new mongoose.Types.ObjectId(item._id),
                nombre: item.nombre,
                cantidad: item.cantidad,
                precio: item.precio,
                total: item.total
            })),
            total,
            estado: 'finalizado'
        });
        
        res.status(201).json({ 
            message: 'Orden creada con éxito', 
            order: newOrder 
        });
    } catch (error) {
        console.error('Error al crear la orden:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getUserPurchases = async (userId) => {
    try {
        await connectToDatabase();
        const orders = await Order.find({ 'usuario.id': userId });
        const purchasedProducts = new Set();
        
        orders.forEach(order => {
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    if (item && item.id) {
                        purchasedProducts.add(item.id.toString());
                    }
                });
            }
        });
        
        return Array.from(purchasedProducts);
    } catch (error) {
        console.error('Error al obtener compras del usuario:', error);
        throw error;
    }
};