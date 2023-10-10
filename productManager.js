
// Logica

class ProductManager {

    constructor() {
        this.products = [];
    };

    addProduct(title, description, price, thumbnail, code, stock) {

        let duplicateProduct = this.products.some(product => product.code);

        if (duplicateProduct == true) {
            console.log("El producto que intenta añadir ya se encuentra dentro de la lista de productos!");
        } else {

            let id = 1;

            if (this.products.length > 0) {
                id = this.products[this.products.length - 1].id + 1;
            };

            let newProduct = { title, description, price, thumbnail, code, stock, id };

            this.products.push(newProduct);

            console.log("Producto agregado!");
        };

    };

    getProducts() {
        if (this.products.length > 0) {
            let productNumber = 0
            this.products.forEach(product => {
                productNumber++;
                console.log(`Producto numero ${productNumber}:`);
                console.log(product);
            });
        } else {
            console.log(this.products);
        };
    };

    getProductById(id) {
        let specificProduct = this.products.find(product => product.id === id);
        if (specificProduct != null) {
            console.log("Producto encontrado: ");
            console.log(specificProduct);
        } else {
            console.log("Producto no encontrado");
        };

    };

};

// Test

// productManager

const productManager = new ProductManager();

// prueba

productManager.getProducts();

productManager.addProduct("Producto Prueba", "Este es un producto de prueba", 200, "Sin imagen", "abc123", 25);

productManager.getProducts();

productManager.addProduct("Producto Prueba", "Este es un producto de prueba", 200, "Sin imagen", "abc123", 25);

productManager.getProducts();

productManager.getProductById(1);

productManager.getProductById(4);
