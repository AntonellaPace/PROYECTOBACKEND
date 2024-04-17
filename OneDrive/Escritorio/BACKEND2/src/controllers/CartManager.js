import CartModel from "../models/cart.model.js";

class CartManager {

    async createCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.log("error al crear el carrito", error)
            throw error;
        }
    }

    async getCartById(cid) {
        try {
            const cartList = await CartModel.findById(cid)
            if (!cartList) {
                throw new Error(`no existe un carrito con el id: ${cid}`)
            }
            return cartList;
        } catch (error) {
            throw new Error(`Error al obtener el carrito con el id: ${cid}` + error.message);
        }
    };

    async addCart(cid, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cid);
            const existeProduct = cart.products.find(item => item.product.toString() === productId);
            if (existeProduct) {
                existeProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }
            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            console.error("error al agregar el producto", error);
            throw error;
        }
    };

    async removeProductFromCart(cid, productId) {
        try {
            const cart = await CartModel.findById(cid);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = cart.products.filter(item => item.product._id.toString() !== productId);

            await cart.save();

            return cart;
        } catch (error) {
            console.error('Error al eliminar el producto del carrito ', error);
            throw error;
        }
    };

    async updateCart (cid, updatedProducts) {
        try {
            const cart = await CartModel.findById(cid);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = updatedProducts;

            cart.markModified('products');

            await cart.save();

            return cart;
        } catch (error) {
            console.error('Error al actualizar el carrito en el gestor', error);
            throw error;
        }
    };

    async updateProductQantity (cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const productIndex = cart.products.findIndex(item => item.product._id.toString() !== productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;

                cart.markModified('products');

                await cart.save();
                return cart;
            } else {
                throw new Error('Producto no encontrado en el carrito');
            }
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto en el carrito', error);
            throw error;
        }
    };

    async emptyCart (cartId) {
        try {
            const cart = await CartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            return cart;
        } catch (error) {
            console.error('Error al vaciar el carrito en el cartmanager', error);
            throw error;
        }
    }


};


export default CartManager;