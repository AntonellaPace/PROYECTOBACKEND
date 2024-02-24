import express from 'express';

import cartRoutes from './scr/routes/cart.routes.js';
import productRoutes from './scr/routes/products.routes.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.get('/', async (req, res) => {
    try{
        res.send("Bienvenido a ~GOMEZ&ASOCIADOS~")
    }catch (error) {
        res.status(418).send({error, message:"No funciona"});
    }
});

app.use("api/products", productRoutes);
app.use('api/carts', cartRoutes);

app.listen(PORT, () => {
    console.log(`Servidor funcionando en Puerto ${PORT}.`);
});
