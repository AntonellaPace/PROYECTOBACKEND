import express from 'express';
import ProductManager from '../controllers/ProductManager.js';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended:true }));

const pm = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const products = await pm.getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).send('Error al mostrar la vista home');
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await pm.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).send('Error al mostrar la vista realTimeProducts');
    }
});

export default router;