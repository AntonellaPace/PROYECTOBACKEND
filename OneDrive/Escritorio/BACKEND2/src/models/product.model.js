import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: {
        type: [String],
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true
    },

})

const ProductModel = mongoose.model("product", productSchema);

export default ProductModel;