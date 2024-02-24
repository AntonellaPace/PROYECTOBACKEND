import express from 'express';
const router = express.Router();
import CartManager from '../controllers/CartManager.js';
import ProductManager from '../controllers/ProductManager.js';

router.use(express.json());
router.use(express.urlencoded({ extended:true }));

const cm = new CartManager();
const pm = new ProductManager();

router.get('/:cid', async (req, res) => {
    try {
        let { cid } = req.params;
        let contenido = await cm.getCartById(parseInt(cid));
        res.json(contenido)
    } catch (error) {
        res.status(500).json({message: 'Error al obtener el contenido del carrito', error: error.message});
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        let { cid, pid } =req.params;
        let product = await pm.getProductById(parseInt(pid));
        let cart = await cm.addCart(product);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar el producto al carrito', error: error.message });
    }
});

export default router;