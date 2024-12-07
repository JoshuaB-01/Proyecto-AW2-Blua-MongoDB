import { Router } from "express";
import { crearOrdenAction, getUserPurchases } from '../db/actions/orders.action.js';
import { verifyToken } from '../utils/auth.middleware.js';

const router = Router();

router.post('/create', verifyToken, crearOrdenAction);

router.get('/user-purchases', verifyToken, async (req, res) => {
    try {
        const purchasedProducts = await getUserPurchases(req.user.id);
        res.status(200).json(purchasedProducts);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos comprados' });
    }
});

export default router;