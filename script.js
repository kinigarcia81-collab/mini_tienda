const productosDiv = document.getElementById("productos");
const carritoDiv = document.getElementById("carrito");
const totalP = document.getElementById("total");
const btnVaciar = document.getElementById("btnVaciar");
const buscador = document.getElementById("buscador");
const precioMax = document.getElementById("precioMax");
const precioValor = document.getElementById("precioValor");
const btnComprar = document.getElementById("btnComprar");
const mensajeCompra = document.getElementById("mensajeCompra");

// Productos inventados (luego podremos poner más o usar API)
const productos = [
  { id: 1, nombre: "Auriculares", precio: 19.99, img: "https://via.placeholder.com/300x200?text=Auriculares" },
  { id: 2, nombre: "Teclado", precio: 29.99, img: "https://via.placeholder.com/300x200?text=Teclado" },
  { id: 3, nombre: "Ratón", precio: 14.99, img: "https://via.placeholder.com/300x200?text=Raton" },
  { id: 4, nombre: "USB 64GB", precio: 9.99, img: "https://via.placeholder.com/300x200?text=USB+64GB" },
];

// Carrito: { idProducto: cantidad }
let carrito = cargarCarrito();

// ---------- LOCALSTORAGE ----------
function cargarCarrito() {
  const datos = localStorage.getItem("carrito");
  if (!datos) return {};
  try { return JSON.parse(datos); } catch { return {}; }
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// ---------- PINTAR PRODUCTOS ----------
function pintarProductos() {
  productosDiv.innerHTML = "";

  const texto = (buscador?.value || "").toLowerCase();
  const maxPrecio = Number(precioMax?.value || 9999);

  const listaFiltrada = productos.filter(p => {
    const coincideNombre = p.nombre.toLowerCase().includes(texto);
    const coincidePrecio = p.precio <= maxPrecio;
    return coincideNombre && coincidePrecio;
  });

  if (listaFiltrada.length === 0) {
    productosDiv.innerHTML = "<p>No hay productos con esos filtros.</p>";
    return;
  }

  listaFiltrada.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${p.img}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>Precio: ${p.precio.toFixed(2)} €</p>
      <button type="button" class="btnAdd">Añadir</button>
    `;

    card.querySelector(".btnAdd").addEventListener("click", () => {
      agregarAlCarrito(p.id);
    });

    productosDiv.appendChild(card);
  });
}


// ---------- LÓGICA CARRITO ----------
function agregarAlCarrito(id) {
  carrito[id] = (carrito[id] || 0) + 1;
  guardarCarrito();
  pintarCarrito();
}

function restarDelCarrito(id) {
  if (!carrito[id]) return;

  carrito[id] -= 1;
  if (carrito[id] <= 0) delete carrito[id];

  guardarCarrito();
  pintarCarrito();
}

function vaciarCarrito() {
  carrito = {};
  guardarCarrito();
  pintarCarrito();
}

// ---------- PINTAR CARRITO ----------
function pintarCarrito() {
  carritoDiv.innerHTML = "";

  const ids = Object.keys(carrito);

  if (ids.length === 0) {
    carritoDiv.innerHTML = "<p>Carrito vacío.</p>";
    totalP.textContent = "";
    return;
  }

  let total = 0;

  ids.forEach(idStr => {
    const id = Number(idStr);
    const cantidad = carrito[idStr];
    const prod = productos.find(p => p.id === id);

    const subtotal = prod.precio * cantidad;
    total += subtotal;

    const fila = document.createElement("div");
    fila.className = "fila";

    fila.innerHTML = `
      <div>
        <b>${prod.nombre}</b><br>
        ${prod.precio.toFixed(2)} € x ${cantidad} = ${subtotal.toFixed(2)} €
      </div>

      <div class="controles">
        <button type="button" class="btnMenos">-</button>
        <button type="button" class="btnMas">+</button>
      </div>
    `;

    fila.querySelector(".btnMas").addEventListener("click", () => agregarAlCarrito(id));
    fila.querySelector(".btnMenos").addEventListener("click", () => restarDelCarrito(id));

    carritoDiv.appendChild(fila);
  });

  totalP.textContent = `Total: ${total.toFixed(2)} €`;
}

btnVaciar.addEventListener("click", vaciarCarrito);

if (btnComprar) {
  btnComprar.addEventListener("click", () => {
    const ids = Object.keys(carrito);
    if (ids.length === 0) {
      mensajeCompra.textContent = "No puedes comprar: el carrito está vacío.";
      return;
    }

    mensajeCompra.textContent = "¡Compra realizada! ✅ (es una demo)";
    vaciarCarrito();
  });
}


if (buscador) {
  buscador.addEventListener("input", () => {
    pintarProductos();
  });
}

// INICIO
pintarProductos();
pintarCarrito();
