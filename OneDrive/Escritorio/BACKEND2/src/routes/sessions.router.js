import express from 'express';
const router = express.Router();
import UserModel from '../models/user.model.js';
import { createHash, isValidPassword } from '../utils/hashbcrypt.js';
import passport from 'passport';

/*router.post("/", async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;

    try {
        const existeUser = await UserModel.findOne({ email: email });
        if (existeUser) {
            return res.status(400).send("El correo electronico ya esta registrado!!");
        }

        //Idea para el registro de role: 
        //const role = email === "admincoder@coder.com" ? "admin" : "user"; 
        //const nuevoUsuario = await UserModel.create({first_name, last_name, email, password, age, role});  PROBAAAAAR

        const newUser = await UserModel.create({ first_name, last_name, email, password: createHash(password), age });

        req.session.login = true;
        req.session.user = { ...newUser._doc }

        res.redirect("/profile");

    } catch (error) {
        res.status(500).send("Error interno del servidor en sessionsrouter1")                         
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email: email });
        if (user) {
            if (isValidPassword(password, user)) {
                req.session.login = true;
                req.session.user = {
                    email: user.email,
                    age: user.age,
                    first_name: user.first_name,
                    last_name: user.last_name
                }
                res.redirect("/profile");
            } else {
                res.status(401).send("contraseña invalida")
            }
        } else {
            res.status(404).send("usuario no encontrado")
        }
    } catch (error) {
        res.status(500).send("Error interno del servidor en sessionsrouter2")
    }
});*/

//PARA passport:

router.post("/", passport.authenticate("register", {
    failureRedirect: "/sessions/failedregister"
 }), async (req, res) => {

     if(!req.user) return res.status(400).send("Credenciales invalidas");

     req.session.user = {
         first_name: req.user.first_name,
         last_name: req.user.last_name,
         age: req.user.age,
         email: req.user.email
     };

     req.session.login = true; 

     res.redirect("/profile");
 })

 router.get("/failedregister", (req, res) => {
     res.send("Registro fallido");
 })

router.post("/login", passport.authenticate("login", { failureRedirect:"/sessions/faillogin"}), async (req, res) => {
     if(!req.user) return res.status(400).send("Credenciales invalidas");
    
     req.session.user = {
         first_name: req.user.first_name,
         last_name: req.user.last_name,
         age: req.user.age,
         email: req.user.email
     };

     req.session.login = true; 

     res.redirect("/profile");

 })

 router.get("/faillogin", async (req, res) => {
     res.send("datos incorrectos");
 })


router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login")
});

//PARA GITHUB:

router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res) => {})

router.get("/githubcallback", passport.authenticate("github", {failureRedirect:"/login"}), async (req, res) => {

     req.session.user = req.user;
     req.session.login = true;
     res.redirect("/profile");
 })





export default router;