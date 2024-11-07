import mongoose from 'mongoose';

const { Schema, models, model } = mongoose;

const ProductSchema = new Schema({
    nombre: { type: String, required: true },
    desc: { type: String, required: true },
    precio: { type: Number, required: true },
    imagen: { type: String, required: true },
    stock: { type: Number, required: true },
    disponible: { type: Boolean, default: true },
    categoria: { type: String, required: true }
});

const Product = models.product || model('product', ProductSchema);

export default Product;
