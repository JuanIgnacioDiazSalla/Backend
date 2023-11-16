import path from 'path';
import fs from 'fs';

const pathProducts = path.join(__dirname, '..', 'products')

let products = [];

function infoProducts() {
    if (!fs.existsSync(pathProducts)) {
        products = [];
    } else {
        products = JSON.parse(fs.readFileSync(path.join(pathProducts, 'products.json'), "utf-8"));
    };
};

const refresh = () => {
    socket.emit('changeOnProducts', "Cambio en Products");
};

const socket = io();

const lista = document.getElementById('listaRTP');

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