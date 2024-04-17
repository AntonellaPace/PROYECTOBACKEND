import express from 'express';
import ProductManager from '../controllers/ProductManager.js';
import CartManager from '../controllers/CartManager.js';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const pm = new ProductManager();
const cm = new CartManager();

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

router.get("/chat", (req, res) => {
   res.render("chat");
});

router.get("/products", async (req, res) => {
   try {
      const { page = 1, limit = 2 } = req.query;
      const products = await pm.getProducts({
         page: parseInt(page),
         limit: parseInt(limit)
      });

      const newArray = products.docs.map(product => {
         const { _id, ...rest } = product.toObject();
         return rest;
      });

      res.render("products", {
         products: newArray,
         hasPrevPage: products.hasPrevPage,
         hasNextPage: products.hasNextPage,
         prevPage: products.prevPage,
         nextPage: products.nextPage,
         currentPage: products.page,
         totalPages: products.totalPages
      });

   } catch (error) {
      console.error("Error al obtener productos", error);
      res.status(500).json({
         status: 'error',
         error: "Error interno del servidor "
      });
   }
});

router.get("/carts/:cid", async (req, res) => {
   const cartId = req.params.cid;

   try {
      const cart = await cm.getCartById(cartId);

      if (!cart) {
         console.log("No existe ese carrito con el id");
         return res.status(404).json({ error: "Carrito no encontrado" });
      }

      const cartList = cart.products.map(item => ({
         product: item.product.toObject(),
         quantity: item.quantity
      }));


      res.render("carts", { products: cartList });
   } catch (error) {
      console.error("Error al obtener el carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
   }
});

router.get("/register", (req, res) => {
   if(req.session.login) {
      return res.redirect("/profile")
   }
   res.render("register");
});

router.get("/login", (req, res) => {
   res.render("login")
});

router.get("/profile", (req, res) => {
   if(!req.session.login) {
      return res.redirect("/login")
   }
   res.render("profile", {user: req.session.user})
});




export default router;