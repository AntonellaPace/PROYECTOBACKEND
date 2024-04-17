import ProductModel from "../models/product.model.js";

class ProductManager {

    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {

        try {
           const existeProduct = await ProductModel.findOne({ code: code })

            if (existeProduct) {
                console.log("el codigo debe de ser unico")
                return;
            }

            const newProduct = new ProductModel( {
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            });

            await newProduct.save()

        } catch (error) {
            console.error("No se pudo guardar el producto", error);
            throw error;
        }
    };

    getProducts = async () => {
        try {
            const products = await ProductModel.find()
            return products;
        } catch (error) {
            console.error("error al recuperar productos", error);
            throw error;
        }
    };

    getProductById = async (id) => {
        try {
            const product = await ProductModel.findById(id)
            if (!product) {
                console.log("producto no encontrado")
                return null;
            } else {
                console.log("producto encontrado");
                return product;
            }
        } catch (error) {
            console.error("error al buscar producto", error);
            throw error;
        }
    };

    updateProduct = async (productId, productActualizado) => {
        try {
            const updateProduct = await ProductModel.findByIdAndUpdate(productId, productActualizado);

            if (!updateProduct) {
                console.log("producto no encontrado");
                return null;
            }
            console.log("producto actualizado");
            return updateProduct;

        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            throw error;
        }
    };

    deleteProduct = async (productId) => {
        try {
            const deleteProduct = await ProductModel.findByIdAndDelete(productId);

            if (!deleteProduct) {
                console.log("producto no encontrado");
                return null;
            }
            console.log("producto eliminado");

        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            throw error;
        }
    };
};

export default ProductManager;

