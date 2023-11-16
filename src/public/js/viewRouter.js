const pathProducts = path.join(__dirname, '..', 'products')

let products = [];

function infoProducts() {
    if (!fs.existsSync(pathProducts)) {
        products = [];
    } else {
        products = JSON.parse(fs.readFileSync(path.join(pathProducts, 'products.json'), "utf-8"));
    };
};

const socket = io();

/*
// intento nro 1- importando io a products.router.js y listeners en viewRouter.js 
// en este intento, agregaba io.emit("newProduct", newProduct) e io.emit("changeOnProducts", deletedProduct) dentro del products.router.js, en post y delete respectivamente.
// además agregaba module.exports = io; en app.js

const lista = document.getElementById('listaRTP');

socket.on("newProduct", (newProduct) => {

    listaProducts = document.getElementById('productsRTP')

    product = document.createElement('li')

    product.innerHTML = `<h4>Title: ${newProduct.title}</h4>
        <p>Description: ${newProduct.description}</p>
        <p>Price: ${newProduct.price}</p>
        <p>Thumbnail: ${newProduct.thumbnail}</p>
        <p>Code: ${newProduct.code}</p>
        <p>Stock: ${newProduct.stock}</p>
        <p>Category: ${newProduct.category}</p>
        <p>Status: ${newProduct.status}</p>
        <p>ID: ${newProduct.id}</p>`;

    listaProducts.appendChild(product);

    lista.appendChild(listaProducts);

});

socket.on("changeOnProducts", () => {
    lista.innerHTML = ""

    listaProducts = document.createElement('ol');

    listaProducts.setAttribute('id', 'productsRTP')

    products.forEach(i => {

        product = document.createElement('li')

        product.innerHTML = `<h4>Title: ${i.title}</h4>
        <p>Description: ${i.description}</p>
        <p>Price: ${i.price}</p>
        <p>Thumbnail: ${i.thumbnail}</p>
        <p>Code: ${i.code}</p>
        <p>Stock: ${i.stock}</p>
        <p>Category: ${i.category}</p>
        <p>Status: ${i.status}</p>`;

        listaProducts.appendChild(interior);

    });

    lista.appendChild(listaProducts);

});

// intento nro 2- boton refresh

const boton = document.getElementById('refresh');

boton.addEventListener('onclick', refresh);

socket.on('changeOnProducts', (msg) => {

    infoProducts();

    lista.innerHTML = ""

    listaProducts = document.createElement('ol');

    listaProducts.setAttribute('id', 'productsRTP')

    products.forEach(i => {

        product = document.createElement('li')

        product.innerHTML = `<h4>Title: ${i.title}</h4>
        <p>Description: ${i.description}</p>
        <p>Price: ${i.price}</p>
        <p>Thumbnail: ${i.thumbnail}</p>
        <p>Code: ${i.code}</p>
        <p>Stock: ${i.stock}</p>
        <p>Category: ${i.category}</p>
        <p>Status: ${i.status}</p>`;

        listaProducts.appendChild(product);

    });

    lista.appendChild(listaProducts);

    console.log(msg);

});
*/