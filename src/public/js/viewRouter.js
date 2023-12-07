const socket = io();
socket.on("connect", () => {
    console.log("hola")
})

socket.on("hola", (products) => {
    console.log("Emitido desde el back" + products)
})