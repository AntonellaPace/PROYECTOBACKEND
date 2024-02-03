class ProductManager {
    
    static ultId = 0; 
    
    constructor() {
        this.products = []
    }

    addProduct(title, description, price, img, code, stock) {

        if(this.products.some(item=> item.code === code)) {
            console.log("El code del producto debe ser unico");
            return; 
        }

        if(!title || !description || !price || !img || !code || !stock) {
            console.log("Todos los campos son obligatorios");
            return; 
        }

        const productoNuevo = {
            id: ++ProductManager.ultId,
            title, 
            description, 
            price,
            img,
            code,
            stock
        }


        this.products.push(productoNuevo);
    }

    getProducts() {
        return this.products;
      }

    getProductById(id) {
        const producto = this.products.find(item => item.id === id );

        if(!producto) {
            return "Producto no encontado";
        } 
        return producto; 
    }
}

const manager = new ProductManager();

console.log(manager.getProducts());

manager.addProduct("Producto de prueba", "este es un producto de prueba", 200, "sin imagen", "abc123", 25);

manager.addProduct("Producto de prueba 2", "este es un producto de prueba", 200, "sin imagen", "abc456", 25);

manager.addProduct("Producto de prueba 3", "este es un producto de prueba", 200, "sin imagen", "abc789", 25);

console.log(manager.getProducts());

manager.addProduct("Producto de prueba", "este es un producto de prueba", 200, "sin imagen", "abc123", 25);

console.log("Buscamos producto por id:");

console.log(manager.getProductById(2));