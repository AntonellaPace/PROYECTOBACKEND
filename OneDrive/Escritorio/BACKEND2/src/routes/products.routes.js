import { Router } from 'express';
const router = Router();
import ProductManager from '../controllers/ProductManager.js'

const pm = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const products = await pm.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        res.json({
            status: 'success',
            payload: products,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
        });

    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            status: 'error',
            error: "Error interno del servidor"
        });
    }
});

/*router.get('/', async (req, res) => {
    try{
        let { limit } = req.query;
        let products = await pm.getProducts();
        if (limit) {
            let prodLimit = products.slice(0, (limit));
            res.send(prodLimit);
        }else {
            res.send(products);
        }
    }catch (error) {
        res.status(418).send({error, message:"no funciona"});
    }
});*/

router.get('/:pid', async (req, res) => {
    const id = req.params.pid;

    try {
        const product = await pm.getProductById(id);
        if (!product) {
            return res.json ({
                error: "producto no encontrado"
            })
        }
        res.json(product)
    } catch (error) {
        console.error ("error al obrener el producto con ese ID", error);
        res.status(500).json({
            error: "Error interno del sevidor en productrouterjs"
        })
    }
  
    /*  try{
        let { pid } = req.params.pid;
        const product = await pm.getProductById(Number(pid));
        if (product) {
            res.send(product);
        } else {
            res.status(404).send({status: "error", message: "No se encuentra el ID"});
        };
    } catch (error) {
        res.status(418).send({error, message:"no funciona"})
    }*/
});

router.post("/", async (req, res) => {
    const nuevoProduct = req.body;

    try {
        await pm.addProduct(nuevoProduct);
        res.status(201).json({
            message: "Producto agregado exitosamente"
        });
    } catch (error) {
        console.error("Error al agregar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

/*router.post('/', async (req, res) => {
    const { title, description, price, code, stock, img, category, status, thumbnails } = req.body;
    try {
        await pm.addProduct(title, description, price, code, stock, img, category, status, thumbnails);
        res.status(201).json({ message: 'Producto agregado correctamente' });
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});*/

router.put('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const productActualizado = req.body;
    try {
        await pm.updateProduct(productId, productActualizado);
        res.json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

router.delete('/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        await pm.deleteProduct(productId);
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

export default router;