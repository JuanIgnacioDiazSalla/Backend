// Imports

const fs = require('fs');

const path = require('path');

// Clase

class ProductManager {

    constructor() {
        this.products = [];
        this.path = path.join(__dirname, './products');
    };

    actualizar() {
        const contenido = fs.readFileSync(this.path, 'utf-8');
        console.log(contenido);
    };

    actualizarProducts() {
        if (!fs.existsSync(this.path)) {
            this.products = [];
        } else {
            this.products = JSON.parse(fs.readFileSync(path.join(this.path, 'products.json'), "utf-8"));
        };
    }

    addProduct(title, description, price, thumbnail, code, stock) {

        this.actualizarProducts();

        if (this.products.length > 0) {
            let duplicateProduct = this.products.some(product => code === product.code);

            if (duplicateProduct == true) {
                console.log("El producto que intenta añadir ya se encuentra dentro de la lista de productos!");
            } else {

                // creando id y añadiendo a array

                let id = this.products[this.products.length - 1].id + 1;

                let newProduct = { title, description, price, thumbnail, code, stock, id };

                this.products.push(newProduct);

                // añadiendo al json

                const jsonProducts = JSON.stringify(this.products, null, 5);

                fs.writeFileSync(path.join(this.path, 'products.json'), jsonProducts, { encoding: "utf-8" });

                console.log("Producto agregado!");

            };
        } else {

            // creando id y añadiendo a array

            let id = 1;

            let newProduct = { title, description, price, thumbnail, code, stock, id };

            this.products.push(newProduct);

            // creando json

            const jsonProducts = JSON.stringify(this.products, null, 5);

            fs.mkdirSync(this.path)

            fs.writeFileSync(path.join(this.path, 'products.json'), jsonProducts, { encoding: "utf-8" });

            console.log("Producto agregado!");

        }
    };

    getProducts() {
        this.actualizarProducts();
        console.log(this.products);
    };

    getProductById(id) {
        this.actualizarProducts();
        let specificProduct = this.products.find(product => product.id === id);
        if (specificProduct != null) {
            console.log("Producto encontrado: ");
            console.log(specificProduct);
        } else {
            console.log("Producto no encontrado");
        };
    };

    updateProductById(id, campoACambiar, valorACambiar) {
        let updateSpecificProduct = this.products.find(product => product.id === id);
        console.log("Producto a modificar:")
        console.log(updateSpecificProduct)
        switch (campoACambiar) {
            case "title": {
                updateSpecificProduct.title = valorACambiar;
                this.actualizar();
                break;
            }
            case "description": {
                updateSpecificProduct.description = valorACambiar;
                this.actualizar();
                break;
            }
            case "price": {
                updateSpecificProduct.price = valorACambiar;
                this.actualizar();
                break;
            }
            case "thumbnail": {
                updateSpecificProduct.thumbnail = valorACambiar;
                this.actualizar();
                break;
            }
            case "code": {
                updateSpecificProduct.code = valorACambiar;
                this.actualizar();
                break;
            }
            case "stock": {
                updateSpecificProduct.stock = valorACambiar;
                this.actualizar();
                break;
            }
            default: {
                console.log("Campo a actualizar no encontrado");
                break;
            }
        };
    }

    deleteProductById(id) {
        let specificProduct = this.products.find(product => product.id === id);
        if (specificProduct != null) {
            console.log("Producto encontrado: ");
            console.log(specificProduct);
            const ubicacionArray = parseInt(specificProduct.id) - 1;
            this.products.splice(ubicacionArray, 1);
            console.log("Producto eliminado")
            this.actualizar();
        } else {
            console.log("Producto no encontrado");
        };
    }

    saludar() {
        console.log("hola");
    }
};

// Instancia

// creo instancia productManager

const productManager = new ProductManager();

// prueba

for (i = 1; i < 11; i++) {
    productManager.addProduct(`Producto Prueba ${i}`, "Este es un producto de prueba", 200, "Sin imagen", `codigo_nro_${i}`, 25);
};
