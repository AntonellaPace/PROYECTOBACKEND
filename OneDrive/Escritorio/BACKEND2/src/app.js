import express from "express";
import http from "http";
import exphbs from "express-handlebars";
import { Server } from "socket.io";
import viewsRouter from './routes/view.routes.js';
import productsRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routes.js";
import ProductManager from './controllers/ProductManager.js';
import CartManager from './controllers/CartManager.js';

const app = express();
const PORT = 8080;
const server = http.createServer(app);
const io = new Server(server);

const pm = new ProductManager();
const cm = new CartManager();

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use (express.static("./src/public"));

app.use('/', viewsRouter);
app.use('/products', productsRouter);
app.use('/cart', cartRouter);

io.on('connection', (socket) => {
    console.log('Usuario Conectado');

    socket.on('addProduct', async (productdata) => {
        try {
            const { id, title, description, price, code, stock, img } = productdata;
            await pm.addProduct(title, description, price, code, stock, img);
            const product = await pm.getProductById(id);
            await cm.addCart(product);
            const products = await pm.getProducts();
            io.emit('updateProducts', products);
        } catch (error) {
            console.error('Error al agregar el producto', error);
        }
        io.emit('Producto Creado', producto);
    });

    socket.on('eliminarProducto', (productoId) => {
        io.emit('producto eliminado', productoId);
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    })
});

server.listen(PORT, () => {
    console.log(`Iniciado En el Puerto ${PORT}`);
});