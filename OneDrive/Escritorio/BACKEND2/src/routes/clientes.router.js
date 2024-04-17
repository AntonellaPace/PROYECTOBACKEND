import { Router } from "express";
const router = Router();

import ClientesModel from "../models/cliente.model.js";

router.get ("/", async (req, res) => {
    try {
        const clientes = await ClientesModel.find();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({message: "error en el servidor"})
    }
})

router.post("/", async (req, res) => {
    try {
        const cliente = new ClientesModel(req.body);
        await cliente.save();
        res.send({message: "cliente generado exitosamente", cliente})
    } catch (error) {
        res.status(500).json({message: "error en el servidor"});
    }
})

router.put("/:id", async (req, res) => {
    try {
        const cliente = await ClientesModel.findByIdAndUpdate(req.params.id, req.body);
        
        res.status(200).send({message: "cliente actualizado"})
        
        if (!cliente) {
            return res.status(404).send({message: "cliente no encontrado"})
        }

    } catch (error) {
        res.status(500).json({message: "error en el servidor al actualizar el cliente"})
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const cliente = await ClientesModel.findByIdAndDelete(req.params.id);
        
        res.status(200).send({message: "cliente borrado"})
        
        if (!cliente) {
            return res.status(404).send({message: "cliente no encontrado"})
        }

    } catch (error) {
        res.status(500).json({message: "error en el servidor al borrar el cliente"})
    }
})


export default router;