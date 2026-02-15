// CARRITO
let carrito = [];
const carritoStorage = localStorage.getItem("carrito");
if (carritoStorage) {
  try {
    const parsed = JSON.parse(carritoStorage);
    if (Array.isArray(parsed)) {
      carrito = parsed;
    }
  } catch(e) {
    carrito = [];
  }
}

// ARRAY OBJETOS
let plantas = [
  { id: 1, nombre: "Monstera Deliciosa", precio: 35, imagen: "monstera-deliciosa.jpg" },
  { id: 2, nombre: "Sansevieria", precio: 25, imagen: "sansevieria.jpg"},
  { id: 3, nombre: "Pothos", precio: 20, imagen:"pothos.jpg"},
  { id: 4, nombre: "Aloe Vera", precio: 15, imagen:"aloe-vera.jpg"},
  { id: 5, nombre: "Lavanda", precio: 18, imagen:"lavanda.jpg"}
];

// CREAR CARD
function crearCard(planta) {
  const card = document.createElement("div");
  card.classList.add("col"); 

  const imagen = planta.imagen ? planta.imagen : "default.png";

  card.innerHTML = `
    <div class="card h-100 text-center">
      <img src="../assets/imagenes/plantas/${imagen}" class="card-img-top" alt="${planta.nombre}" || ./assets/imagenes/plantas/${imagen}" class="card-img-top" alt="${planta.nombre}" >
      <div class="card-body">
        <h5 class="card-title">${planta.nombre}</h5>
        <p class="card-text">USD ${planta.precio}</p>
        <button class="btn btn-success" data-id="${planta.id}">Agregar al carrito</button>
      </div>
    </div>
  `;

  return card;
}

// AGREGAR AL CARRITO
function agregarAlCarrito(id) {
  const plantaSeleccionada = plantas.find(planta => planta.id === id);
  if (!plantaSeleccionada) return;
  const plantaEnCarrito = carrito.find(planta => planta.id === id);

  if (plantaEnCarrito) {
    plantaEnCarrito.cantidad++;
  } else {
    carrito.push({...plantaSeleccionada,cantidad: 1});
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// BOTONES
document.addEventListener("click", (e) => {
  const id = parseInt(e.target.dataset.id);

  switch (true) {
    // BOTÓN AGREGAR AL CARRITO
    case e.target.tagName === "BUTTON" && !e.target.classList.contains("btn-sumar") && !e.target.classList.contains("btn-restar") && id !== undefined:
      agregarAlCarrito(id);
      renderizarCarrito();
      break;

    // BOTÓN SUMAR +
    case e.target.classList.contains("btn-sumar") && id !== undefined:
      const plantaSumar = carrito.find(p => p.id === id);
      plantaSumar.cantidad++;
      localStorage.setItem("carrito", JSON.stringify(carrito));
      renderizarCarrito();
      break;

    // BOTÓN RESTAR -
    case e.target.classList.contains("btn-restar") && id !== undefined:
      const plantaRestar = carrito.find(p => p.id === id);
      if (plantaRestar.cantidad > 1) {
        plantaRestar.cantidad--;
      } else {
        carrito = carrito.filter(p => p.id !== id);
      }
      localStorage.setItem("carrito", JSON.stringify(carrito));
      renderizarCarrito();
      break;

    default:
      break;
  }
});

// VACIAR CARRITO
const btnVaciar = document.getElementById("vaciar-carrito");

if (btnVaciar) {
  btnVaciar.addEventListener("click", () => {
    carrito = [];
    localStorage.removeItem("carrito");
    renderizarCarrito();
  });
}

// FINALIZAR COMPRA
document.getElementById("finalizar-compra")?.addEventListener("click", () => {
  let total = carrito.reduce(
    (acc, planta) => acc + planta.precio * planta.cantidad,
    0
  );

  alert(`¡Gracias por tu compra! 🌿\nTotal: USD ${total}`);

  carrito = [];
  localStorage.removeItem("carrito");
  renderizarCarrito();
});

renderizarCarrito();

// CARRITO DE COMPRAS CARRITO.HTML
function renderizarCarrito() {
  const contenedor = document.getElementById("carrito-container");
  const totalContainer = document.getElementById("total-carrito");
  const btnVaciar = document.getElementById("vaciar-carrito");
  const btnFinalizar = document.getElementById("finalizar-compra");

  if (!contenedor || !totalContainer) return;

  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    totalContainer.textContent = "El carrito está vacío";
    if(btnVaciar) btnVaciar.style.display = "none";
    if(btnFinalizar) btnFinalizar.style.display = "none";
    totalContainer.style.textAlign = "center";
    totalContainer.style.marginTop = "50px";
    return;
  } else {
    totalContainer.style.textAlign = "right";
    totalContainer.style.marginTop = "20px";
  }

  if(btnVaciar) btnVaciar.style.display = "inline-block";
  if(btnFinalizar) btnFinalizar.style.display = "inline-block";

  let total = 0;

  carrito.forEach(planta => {
    const subtotal = planta.precio * planta.cantidad;
    total += subtotal;

    const row = document.createElement("div");
    row.classList.add("carrito-row", "d-flex", "align-items-center", "justify-content-between", "mb-2", "p-2", "border-bottom");

    row.innerHTML = `
      <img src="../assets/imagenes/plantas/${planta.imagen}" alt="${planta.nombre}" class="img-carrito">

      <div class="info-carrito">
        <div class="info-texto">
          <span class="nombre-producto">${planta.nombre}</span>
          <span class="precio-unitario">USD ${planta.precio}</span>
        </div>

        <div class="info-controles">
          <div class="contador">
            <button class="btn-restar" data-id="${planta.id}">−</button>
            <span class="cantidad">${planta.cantidad}</span>
            <button class="btn-sumar" data-id="${planta.id}">+</button>
          </div>

          <span class="subtotal">USD ${subtotal}</span>
        </div>
      </div>
    `;

    contenedor.appendChild(row);
  });

  totalContainer.textContent = `Total: USD ${total}`;
}

//CREAR CARD EN DESTACADOS
function crearCardDestacados(planta) {
  const card = document.createElement("div");
  card.classList.add("col"); 

  const imagen = planta.imagen ? planta.imagen : "default.png";

  card.innerHTML = `
    <div class="card h-100 text-center">
      <img src="./assets/imagenes/plantas/${imagen}" class="card-img-top" alt="${planta.nombre}" || ./assets/imagenes/plantas/${imagen}" class="card-img-top" alt="${planta.nombre}" >
      <div class="card-body">
        <h5 class="card-title">${planta.nombre}</h5>
        <p class="card-text">USD ${planta.precio}</p>
        <button class="btn btn-success" data-id="${planta.id}">Agregar al carrito</button>
      </div>
    </div>
  `;

  return card;
} 

// DESTACADOS INDEX.HTML
const destacadosContainer = document.getElementById("destacados-container");

if (destacadosContainer) {
  plantas.slice(0, 3).forEach(planta => {
    destacadosContainer.appendChild(crearCardDestacados(planta));
  });
}

// CATALOGO TIENDA.HTML
const catalogoContainer = document.getElementById("catalogo-container");

if (catalogoContainer) {
  plantas.forEach(planta => {
    catalogoContainer.appendChild(crearCard(planta));
  });
}
