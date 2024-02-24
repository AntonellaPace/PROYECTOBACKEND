import { promises as fs } from 'fs'

export default class ProductManager {
    constructor() { 
      this.products = [];
      this.id = 1;
      this.path = "./products.json";

    }

    addProduct = async (title, description, price, img, code, stock) => {

        const required = [title, description, price, img, code, stock];
            if (!required.every(field => field)) {
                console.log( "Todos los campos son obligatorios");
                return;
            }

            if (this.products.some(product => product.code === code)) {
                console.log(" Ya existe un producto con el ese código");
                return;
            }

        const newProduct = {
            id: this.id,
            title,
            description,
            price,
            img,
            code,
            stock
        };
        this.products.push(newProduct);
        this.id++;
        console.log(" producto se agrego correctamente:", newProduct);

        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        }catch (error) {
            console.error("no se pudo guardar el producto:", error);
            throw error;
        }        
    };

    getProducts = async () => {
        try{
            const items = await fs.readFile(this.path, "utf-8");
            console.log(items);
            return JSON.parse(items);
        }catch (error) {
            console.error(error);
            throw error;
        }
    };

    getProductById = async (id) => {
        try{
            const products = await this.getProducts()
        const product = products.find(product => product.id === id);
        if (product) {
            return product;
        };
        }catch (error) {
            console.error(error);
            throw error;
        }
    };

    updateProduct = async (productId, updatedFields) => {
        try {
            const products = await this.getProducts();
            const productIndex = products.findIndex(product => product.id === productId);
            if (productIndex === -1) {
                console.log(' No se encontró ningún producto con el ID');
                return;
            }
            products[productIndex] = { ...products[productIndex], ...updatedFields };
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            throw error;
        }  
    };

    deleteId = async (id) => {
        try {
            let found = false;
            const items = await this.getProducts();
            const deleteId = items.filter(i => {
            if (i.id === id) found = true;
                return (i.id != id);
            });
            console.log(`producto con ID: ${this.id} borrado `, deleteId);
            if (found) {
                await fs.writeFile("./products.json", JSON.stringify(deleteId, null, 2));
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            throw error;
        }
    };
};

