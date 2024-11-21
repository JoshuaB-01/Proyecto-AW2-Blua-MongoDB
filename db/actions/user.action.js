import { connectToDatabase } from "../connection.js"
import User from "../schemas/user.schema.js"

export const createUser = async({nombre, apellido, email, contraseña, activo}) => {
    try {
        await connectToDatabase();
        
        const res = await User.create({
            nombre, 
            apellido, 
            email, 
            contraseña, 
            activo
        });
        
        return JSON.parse(JSON.stringify(res));
    } catch(error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
}

export const findUserByEmail = async (email) => {
    try {
        await connectToDatabase();
        const user = await User.findOne({ email });
        return user;
    } catch(error) {
        console.error('Error al buscar usuario:', error);
        throw error;
    }
}