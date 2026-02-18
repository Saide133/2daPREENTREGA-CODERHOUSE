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
  { id: 1, nombre: "Monstera Deliciosa", precio: 35, imagen: "monstera-deliciosa.jpg", dificultad: "media", size: "grande", luz: "media", agua: "media", tipo: "decorativa"},
  { id: 2, nombre: "Sansevieria", precio: 25, imagen: "sansevieria.jpg", dificultad: "facil", size: "medio", luz: "baja", agua: "baja", tipo: "interior"},
  { id: 3, nombre: "Pothos", precio: 20, imagen:"pothos.jpg", dificultad: "facil", size: "medio", luz: "media", agua: "media", tipo: "interior"},
  { id: 4, nombre: "Aloe Vera", precio: 15, imagen:"aloe-vera.jpg", dificultad: "facil", size: "pequeño", luz: "alta", agua: "baja", tipo: "suculenta"},
  { id: 5, nombre: "Lavanda", precio: 18, imagen:"lavanda.jpg", dificultad: "media", size: "medio", luz: "alta", agua: "media", tipo: "aromatica"},
  { id: 6, nombre: "Ficus Lyrata", precio: 45, imagen:"ficus-lyrata.jpg", dificultad: "alta", size: "grande", luz: "alta", agua: "media", tipo: "decorativa"},
  { id: 7, nombre: "Calathea Orbifolia", precio: 38, imagen: "calathea-orbifolia.jpg", dificultad: "alta", size: "medio", luz: "baja", agua: "alta", tipo: "interior"},
  { id: 8, nombre: "Zamioculca", precio: 30, imagen: "zamioculca.jpg", dificultad: "facil", size: "medio", luz: "baja", agua: "baja", tipo: "interior"},
  { id: 9, nombre: "Philodendron", precio: 28, imagen: "philodendron.jpg", dificultad: "facil", size: "medio", luz: "media", agua: "media", tipo: "interior"},
  { id: 10, nombre: "Dracaena Marginata", precio: 32, imagen: "dracaena-marginata.jpg", dificultad: "facil", size: "grande", luz: "media", agua: "baja", tipo: "decorativa"},
  { id: 11, nombre: "Espatifilo", precio: 22, imagen: "espatifilo.jpg", dificultad: "media", size: "medio", luz: "baja", agua: "alta", tipo: "interior"},
  { id: 12, nombre: "Helecho Boston", precio: 26, imagen: "helecho-boston.jpg", dificultad: "media", size: "medio", luz: "media", agua: "alta", tipo: "interior"},
  { id: 13, nombre: "Peperomia Obtusifolia", precio: 24, imagen: "peperomia-obtusifolia.jpg", dificultad: "facil", size: "pequeño", luz: "media", agua: "baja", tipo: "decorativa"},
  { id: 14, nombre: "Cactus de interior", precio: 12, imagen: "cactus.jpg", dificultad: "facil", size: "pequeño", luz: "alta", agua: "baja", tipo: "cactus"},
  { id: 15, nombre: "Suculentas Mix", precio: 16, imagen: "suculentas-mix.jpg", dificultad: "facil", size: "pequeño", luz: "alta", agua: "baja", tipo: "suculenta"}
];

// CREAR CARD
function crearCard(planta) {
  const card = document.createElement("div");
  card.classList.add("col");

  const imagen = planta.imagen ?? "default.jpg";

  card.innerHTML = `
    <div class="card h-100 text-center">
      <img 
        src="/assets/imagenes/plantas/${imagen}"
        class="card-img-top"
        alt="${planta.nombre}"
        onerror="this.onerror=null; this.src='/assets/imagenes/plantas/default.jpg';"
      >
      <div class="card-body">
        <h5 class="card-title">${planta.nombre}</h5>
        <p class="card-text">USD ${planta.precio}</p>
        <button class="btn btn-success" data-id="${planta.id}">
          Agregar al carrito
        </button>
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
  const cardDest = document.createElement("div");
  cardDest.classList.add("col");

  const imagenD = planta.imagen ?? "default.jpg";

  cardDest.innerHTML = `
    <div class="card h-100 text-center">
      <img 
        src="./assets/imagenes/plantas/${imagenD}"
        class="card-img-top"
        alt="${planta.nombre}"
        onerror="this.onerror=null; this.src='./assets/imagenes/plantas/default.jpg';"
      >
      <div class="card-body">
        <h5 class="card-title">${planta.nombre}</h5>
        <p class="card-text">USD ${planta.precio}</p>
        <button class="btn btn-success" data-id="${planta.id}">
          Agregar al carrito
        </button>
      </div>
    </div>
  `;

  return cardDest;
}

// DESTACADOS INDEX.HTML
const destacadosContainer = document.getElementById("destacados-container");

if (destacadosContainer) {
  const plantasRandom = [...plantas].sort(() => Math.random () -0.5).slice(0,4);

  plantasRandom.forEach(planta => {
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

// FILTROS
function aplicarFiltros() {
  const dificultad = document.getElementById("filtro-dificultad").value;
  const size = document.getElementById("filtro-size").value;
  const tipo = document.getElementById("filtro-tipo").value;

  let plantasFiltradas = plantas.filter(planta => {
    return (
      (dificultad === "" || planta.dificultad === dificultad) &&
      (size === "" || planta.size === size) &&
      (tipo === "" || planta.tipo === tipo)
    );
  });

  renderizarCatalogo(plantasFiltradas);
}
function renderizarCatalogo(arrayPlantas) {
  catalogoContainer.innerHTML = "";

  arrayPlantas.forEach(planta => {
    catalogoContainer.appendChild(crearCard(planta));
  });
}

if(catalogoContainer){
  renderizarCatalogo(plantas);
  document.getElementById("filtro-dificultad").addEventListener("change", aplicarFiltros);
  document.getElementById("filtro-size").addEventListener("change", aplicarFiltros);
  document.getElementById("filtro-tipo").addEventListener("change", aplicarFiltros);
}

if (catalogoContainer) {
  renderizarCatalogo(plantas);
}

