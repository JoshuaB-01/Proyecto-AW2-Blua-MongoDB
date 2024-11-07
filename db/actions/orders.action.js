import { connectToDatabase } from "../connection.js"
import { Order } from '../schemas/orders.schema.js';

export const crearOrdenAction = async (req, res) => {
    try {
        const { usuario, items } = req.body;
        
        const total = items.reduce((sum, item) => sum + item.total, 0);
        
        const newOrder = await Order.create({
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email
            },
            items: items.map(item => ({
                id: item.id,
                nombre: item.nombre,
                cantidad: item.cantidad,
                precio: item.precio,
                total: item.total
            })),
            total,
            estado: 'finalizado'
        });

        res.status(201).json({ message: 'Orden creada con éxito', order: newOrder });
    } catch (error) {
        console.error('Error al crear la orden:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};