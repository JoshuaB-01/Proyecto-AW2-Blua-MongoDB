import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    usuario: {
        id: String,
        nombre: String,
        apellido: String,
        email: String
    },
    items: [{
        id: String,
        nombre: String,
        cantidad: Number,
        precio: Number,
        total: Number
    }],
    total: Number,
    fecha: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: String,
        enum: ['pendiente', 'finalizado', 'cancelado'],
        default: 'finalizado'
    }
});

export const Order = mongoose.model('Order', orderSchema);