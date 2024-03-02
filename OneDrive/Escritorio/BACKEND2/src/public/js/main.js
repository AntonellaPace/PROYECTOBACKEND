const socket = io();

socket.on('updateProducts', (products) => {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `${product.title} - ${product.price}`;
        productList.appendChild(li);
    });
});


document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('removeBtn')) {
        const productId = event.target.dataset.id;
        socket.emit('removeProduct', productId);
    }
});


document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('addBtn')) {
        const productId = event.target.dataset.id;
        socket.emit('addProductToCart', productId);
    }
});