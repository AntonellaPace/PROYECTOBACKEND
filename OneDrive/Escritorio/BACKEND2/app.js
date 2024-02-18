import express from 'express';

import ProductManager from './ProductManager.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

const pm = new ProductManager();

app.get('/products', async (req, res) => {
    try{
        let limit = req.query.limit;
        let products = await pm.getProducts();
        if (limit) {
            let prodLimit = products.slice(0, parseInt(limit));
            res.send(prodLimit);
        }else {
            res.send(products);
        }
    }catch (error) {
        res.status(418).send({error, message:"no funcionaa"});
    }
});

app.get('/products/:pid', async (req, res) => {
    try{
        let ProdId = req.params.pid;
        const product = await pm.getProductById(Number(ProdId));
        if (product) {
            res.send(product);
        } else {
            res.status(404).send({status: "error", message: "No se encuentra el producto con ese ID"});
        };
    } catch (error) {
        res.status(418).send({error, message:"no funciona"})
    }
});

app.listen(PORT, () => {
    console.log(`servidor funcionando en puerto ${PORT}.`);
});