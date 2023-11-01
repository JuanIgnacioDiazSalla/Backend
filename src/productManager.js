// Imports

const fs = require('fs');

// Logica

class ProductManager {

    constructor(rutaDeArchivo) {
        this.products = [];
        this.path = rutaDeArchivo;
        this.specificPath = rutaDeArchivo + "/products.json"
        if (!fs.existsSync(this.path)) {
            fs.mkdirSync(this.path);
        } else {
            this.products = JSON.parse(fs.readFileSync(this.specificPath, "utf-8"));
            console.log("Lista de productos encontrada!");
        };
    };

    actualizar() {
        const arrayProducts = JSON.stringify(this.products, null, 5)
        fs.unlinkSync(this.specificPath);
        fs.writeFileSync(this.specificPath, arrayProducts, { encoding: "utf-8" });
        console.log("Lista de productos actualizada!" + `\n` + "Lista de productos:");
        console.log(this.products);
    };

    addProduct(title, description, price, thumbnail, code, stock) {

        let duplicateProduct = this.products.some(product => code === product.code);

        if (duplicateProduct == true) {
            console.log("El producto que intenta añadir ya se encuentra dentro de la lista de productos!");
        } else {

            // creando id y añadiendo a array

            let id = 1;

            if (this.products.length > 0) {
                id = this.products[this.products.length - 1].id + 1;
            };

            let newProduct = { title, description, price, thumbnail, code, stock, id };

            this.products.push(newProduct);

            // añadiendo al json
            const jsonProducts = JSON.stringify(this.products, null, 5);
            if (!fs.existsSync(this.specificPath)) { //creo el json si no esta creado
                fs.writeFileSync(this.specificPath, jsonProducts, { encoding: "utf-8" });
            } else { //edito el json creado (creo uno nuevo tomando de base el viejo)
                const contenido = JSON.parse(fs.readFileSync(this.specificPath, "utf-8"));
                contenido.push(newProduct);
                const contenidoEditado = JSON.stringify(contenido, null, 5);
                fs.unlinkSync(this.specificPath);
                fs.writeFileSync(this.specificPath, contenidoEditado, { encoding: "utf-8" });
            }

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

// Test

// productManager

const productManager = new ProductManager("./products");

// prueba

for (i = 1; i < 11; i++) {
    productManager.addProduct(`Producto Prueba ${i}`, "Este es un producto de prueba", 200, "Sin imagen", `codigo_nro_${i}`, 25);
};






