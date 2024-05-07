import express from "express";
import http from "http";
import exphbs from "express-handlebars";
import { Server } from "socket.io";
import viewsRouter from './routes/view.routes.js';
import productsRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routes.js";
import clientesRouter from "./routes/clientes.router.js";
import ("./conect-database/database.js");
import MessageModel from "./models/message.model.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import sessionsRouter from "./routes/sessions.router.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";


const app = express();
const PORT = 8080;
const server = http.createServer(app);
const io = new Server(server);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs.engine({
    runtimeOptions: {
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true
    }
}));

app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.static("./src/public"));

const miClaveSecreta = "backendpace";
app.use(cookieParser(miClaveSecreta));

app.use(session({
    secret:"secretCoder",
    resave:true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl:"mongodb+srv://antopaceescoto:coderhouse@cluster0.r4w1gui.mongodb.net/backendpace?retryWrites=true&w=majority&appName=Cluster0", ttl: 10
    })
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());


app.use('/', viewsRouter);
app.use('/products', productsRouter);
app.use('/carts', cartRouter);
app.use('/clientes', clientesRouter);
app.use('/sessions', sessionsRouter);


io.on("connection", (socket) => {
    console.log("Un cliente conectado");

    socket.on("message", async (data) => {

        await MessageModel.create(data);

        const messages = await MessageModel.find();
        io.sockets.emit("message", messages) 
    });
});


/*app.get("/setcookie", (req, res) => {
    res.cookie("coderCookie" , "backend pace", {maxAge:10000}).send("cookie seteada!");
});
app.get("/leercookie", (req, res) => {
    res.send(req.cookies);
});
app.get("/borrarcookie", (req, res) => {
    res.clearCookie("coderCookie").send("cookie eliminada!!!");
});
app.get("/cookiefirmada", (req, res) => {
    res.cookie("cookieFirmada", "mensaje secreto", {signed: true}).send("cookie firmada enviada");
});
app.get("/recuperamoscookiefirmada", (req, res) => {
    const valorCookie = req.signedCookies.cookieFirmada;
    if(valorCookie) {
        res.send("cookie recuperada: " + valorCookie);
    } else {
        res.send("cookie invalida");
    }
});



app.get("/session", (req, res) => {
    if(req.session.counter) {
        req.session.counter++;
        res.send("visitaste este sitio: " + req.session.counter + " veces");
    } else {
        req.session.counter = 1;
        res.send("bienvenido!");
    }
});
app.get("/logout", (req, res) => {
    req.session.destroy( (error) => {
        if(!error) res.send("session cerrada");
        else res.send("tenemos problemas al cerrar la session");
    });
});
app.get("/login", (req, res) => {
    let {usuario, pass} = req.query;

    if (usuario === "anto" && pass === "1234") {
        req.session.user = usuario;
        req.session.admin = true;
        res.send("inicio de sesion exitoso");
    } else {
        res.send("datos incorrectos");
    }
});
function auth(req, res, next) {
    if(req.session.admin === true) {
        return next();
    };
    return res.status(403).send("error de autorizacion");
};
app.get("/privado", auth , (req, res) => {
    res.send("bienvenido admin")
});*/




/*io.on('connection', (socket) => {
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
});*/

server.listen(PORT, () => {
    console.log(`Iniciado En el Puerto ${PORT}`);
});




