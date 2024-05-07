import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import UserModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
import GitHubStrategy from "passport-github2"

const initializePassport = () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
            let user = await UserModel.findOne({ email });
            if (user) return done(null, false);

            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }

            let result = await UserModel.create(newUser);
            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }));


    passport.use("login", new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                console.log("Este usuario no existe");
                return done(null, false);
            }
            if (!isValidPassword(password, user)) return done(null, false);

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({ _id: id });
        done(null, user);
    });


    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.0ab8e625d9a68a1a",
        clientSecret: "2c5a84cd1f98873ccce84cd00fdb91a9c4d16b82",
        callbackURL: "http://localhost:8080/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        console.log("perfil del usuario: ", profile);
        try {
            let user = await UserModel.findOne({ email: profile._json.email });

            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    email: profile._json.email,
                    password: "",
                }
                let result = await UserModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));
}


export default initializePassport;