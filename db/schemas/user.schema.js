import mongoose from 'mongoose';

const { Schema, models, model } = mongoose;

const UserSchema = new Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    activo: { type: Boolean, default: true }
});

const User = models.user || model('user', UserSchema);

export default User;