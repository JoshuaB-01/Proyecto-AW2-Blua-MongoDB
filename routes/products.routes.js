import { Router } from "express";
import { readFile } from 'fs/promises';
import { createProd, getAllProducts } from '../db/actions/product.action.js';

const router = Router();

router.post('/create', async(req, res) => {
    const {nombre, desc, precio, imagen, stock, disponible, categoria} = req.body
  
    try {
        const result = await createProd({nombre, desc, precio, imagen, stock, disponible, categoria})
        res.status(200).json(result)
    } catch(error) {
        console.error('Error al crear producto:', error);
        res.status(400).json({ error: 'Error al crear producto' })
    }
})

router.get('/', async (req, res) => {
    try {
        const products = await getAllProducts();
        console.log('Productos obtenidos:', products);
        res.status(200).json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});



export default router;