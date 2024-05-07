import jwt  from "jsonwebtoken";

const private_key = "palabra secreta para token";

const generateToken = (user) => {
    const token = jwt.sign(user, private_key, {expiresIn: "24hs"});
    return token;
}

export default generateToken;