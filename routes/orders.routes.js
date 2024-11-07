import { Router } from "express";
import { crearOrdenAction } from '../db/actions/orders.action.js';

const router = Router();

router.post('/create', crearOrdenAction);

export default router;