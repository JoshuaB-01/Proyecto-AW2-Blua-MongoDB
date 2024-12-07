import { Review } from '../schemas/review.schema.js';
import { connectToDatabase } from "../connection.js";

export const getProductReviews = async (productId) => {
    try {
        await connectToDatabase();
        const reviews = await Review.find({ producto: productId })
            .populate('usuario', 'nombre apellido')
            .sort({ fecha: -1 });
            
        if (!reviews) {
            return [];
        }
        
        return reviews;
    } catch (error) {
        console.error('Error al obtener reseñas:', error);
        throw error;
    }
};

export const createReview = async (reviewData) => {
    try {
        await connectToDatabase();
        const review = await Review.create(reviewData);
        return await review.populate('usuario', 'nombre apellido');
    } catch (error) {
        console.error('Error al crear reseña:', error);
        throw error;
    }
};