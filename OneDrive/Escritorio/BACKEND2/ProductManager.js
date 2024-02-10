import fs from "fs"

class ProductManager {
    constructor() {
      this.products = [];
      this.id = 1;
      this.path = "./products.json"

    }

    addProduct(title, description, price, img, code, stock) {
        const required = [title, description, price, img, code, stock];
            if (!required.every(field => field)) {
                console.log("Todos los campos son obligatorios");
                return;
            }
            if (this.products.some(product => product.code === code)) {
                console.log("Producto ya existente con ese codigo");
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
        console.log("Producto agregado: ", newProduct);

        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        }else {
            console.error("El producto no se encontró");
        }
    }

    getProducts() {
        const items = fs.readFileSync(this.path, "utf-8");
        return JSON.parse(items)
    }

    updateProduct = async (productId, updatedFields) => {
        const products = this.getProducts();
        const productIndex = products.findIndex(product => product.id === productId);
        if (productIndex === -1) {
            console.log('No se encontro el producto con ese ID');
            return;
        }
        products[productIndex] = { ...products[productIndex], ...updatedFields };
        fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
    }
    
    deleteId (id) {
        let found = false;
        const items = this.getProducts();
        const deleteId = items.filter(i => {
            if (i.id === id) found = true
            return (i.id != id)
        });
        console.log("ID Borrado", deleteId );
        if (found) fs.writeFileSync("./products.json", JSON.stringify(deleteId, null, 2));
    }

}

//Proceso de Testing:

const newProductManager = new ProductManager();

// Crear productos

newProductManager.addProduct("mueble de cocina", "descripcion", 5000, "imagen1.jpg", "001", 500);
newProductManager.addProduct("mueble de baño", "descripcion", 3000, "imagen2.jpg", "002", 35);

// Crear el producto con un campo menos, despues de forma correcta

newProductManager.addProduct("mueble de dormitorio", "descripcion", 4000, "imagen3.jpg", 55);
newProductManager.addProduct("mueble de dormitorio", "descripcion", 4000, "imagen3.jpg","003", 55);

// Crear el producto con el mismo codigo de un producto ya creado, despues de forma correcta
newProductManager.addProduct("cama de una plaza", "descripcion", 3500, "imagen4.jpg", "001", 62);
newProductManager.addProduct("cama de una plaza", "descripcion", 3500, "imagen4.jpg", "004", 62);

// Todos los productos:

console.log("Todos los productos:", newProductManager.getProducts()); 

// Buscar producto por ID

const productId = 3;
const foundProduct = newProductManager.getProductById(productId);
console.log(`Producto con ID ${productId}:`, foundProduct);

// Actualizar el producto con nuevos campos ingresados

newProductManager.updateProduct(3,{description: "descripcion del mueble de dormitorio", price: 4500});

//Borra un producto

let delId = 4;
const deletedId = newProductManager.deleteId(delId);

