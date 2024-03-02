import { promises as fs, readFile } from 'fs';

export default class CartManager {
    constructor() {
        this.cart = './src/data/carrito.json';
        this.countId = 0;
    }

    async saveCart(cart) {
        await fs.writeFile(this.cart, JSON.stringify(cart, null, 2));
    };

    async readCart() {
        try {
            const cart = await fs.readFile(this.cart, 'utf-8');
            return JSON.parse(cart);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await this.saveCart([]);
                return [];
            } else {
                throw error;
            }
        }
    };

    async addCart(product, quantity = 1,) {
        let cart = await this.readCart();
        const prodIndex = cart.findIndex(item => item.product.id === product.id);
        if (prodIndex !== -1) {
            cart[prodIndex].quantity += quantity;
        } else {
            const newCartItem = {
                id: ++this.countId,
                product,
                quantity
            };
            cart.push(newCartItem);
        }
        await this.saveCart(cart);
        return cart;
    };

    async getCartById(cid) {
        try {
            const cartList = await this.readCart();
            return cartList.find(cart => cart.id === cid);
        } catch (error) {
            throw new Error('Error al obtener el carrito por su ID: ' + error.message);
        }
    };

};