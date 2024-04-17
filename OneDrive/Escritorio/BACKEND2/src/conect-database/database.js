import mongoose from "mongoose"

mongoose.connect("mongodb+srv://antopaceescoto:coderhouse@cluster0.r4w1gui.mongodb.net/backendpace?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Conectados a la base de datos"))
    .catch((error) => console.log("error al conectarse a la base de datos", (error)))

