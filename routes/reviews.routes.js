import { Router } from "express";
import { createReview, getProductReviews } from '../db/actions/review.action.js';
import { verifyToken } from '../utils/auth.middleware.js';

const router = Router();

router.get('/product/:productId', async (req, res) => {
    try {
        const reviews = await getProductReviews(req.params.productId);
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error al obtener reseñas:', error);
        res.status(500).json({ error: 'Error al obtener reseñas', details: error.message });
    }
});

router.post('/create', verifyToken, async (req, res) => {
    try {
        const reviewData = {
            ...req.body,
            usuario: req.user.id
        };
        const result = await createReview(reviewData);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error al crear reseña:', error);
        res.status(500).json({ error: 'Error al crear reseña', details: error.message });
    }
});

export default router;