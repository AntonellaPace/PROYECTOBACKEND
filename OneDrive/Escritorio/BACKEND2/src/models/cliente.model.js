import mongoose from "mongoose";

const clientesSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    edad: Number,
    email: {
        type:String,
        unique:true,
        require:true
    }
});
const ClientesModel = mongoose.model( "clientes", clientesSchema );

export default ClientesModel;