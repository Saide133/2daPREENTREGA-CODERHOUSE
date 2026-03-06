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
let plantas = [];

async function cargarPlantas() {

  try{    
    if(catalogoContainer){
      console.log("Cargando plantas...");
      catalogoContainer.innerHTML = "<p id= 'loader'>Cargando plantas...</p>";
    }
    const response = await fetch("../data/plantas.json");

    if(!response.ok){
      throw new Error("No se pudo cargar el JSON");
    } 

  plantas = await response.json();
  console.log("Plantas cargadas:", plantas);
  renderizarCatalogo(plantas); 
  renderizarDestacados();

  }catch(error){
    console.error("Error cargando plantas:", error);
    if(catalogoContainer){
      catalogoContainer.innerHTML = "<p id='error'>No se pudo cargar el catálogo</p>";
    }
  }  
}


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
  
  Toastify({
    text: "Producto agregado al carrito 🌿",
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor: "#6e931f",
    stopOnFocus: true
}).showToast();
}

// BOTONES AGREGAR, +, -
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
    
    Swal.fire({
        title: "¿Vaciar carrito?",
        text: "Se eliminarán todos los productos",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, vaciar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#6e931f",
        cancelButtonColor: "#c62828"
    }).then((result) => {

        if (result.isConfirmed) {

            carrito = [];

            localStorage.removeItem("carrito");

            renderCarrito();

            Swal.fire({
                title: "Carrito vacío",
                text: "Todos los productos fueron eliminados",
                icon: "success",
                confirmButtonColor: "#6e931f"
            });

        }

    });
  });
}

// FINALIZAR COMPRA
document.getElementById("finalizar-compra")?.addEventListener("click", () => {
  let total = carrito.reduce(
    (acc, planta) => acc + planta.precio * planta.cantidad,
    0
  );

  Swal.fire({
    title: "Confirmar compra",
    text: `Total a pagar: USD ${total}`,
    icon: "question",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Pagar",
    background: "#1f2f2f",
    color: "#ffffff",
    cancelButtonColor: "#d33",
    confirmButtonColor: "#6e931f"    
  }).then((result) => {

    if (result.isConfirmed) {

      Swal.fire({
        title: "¡Compra realizada!",
        text: "Gracias por elegir Urban Jungle 🌿",
        icon: "success",
        confirmButtonColor: "#6e931f"
      });

      carrito = [];
      localStorage.removeItem("carrito");
      renderizarCarrito();

    }
  });
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
function renderizarDestacados(){
  const destacadosContainer = document.getElementById("destacados-container");

  if (destacadosContainer) {
    destacadosContainer.innerHTML = "";
    const plantasRandom = [...plantas].sort(() => Math.random () -0.5).slice(0,4);

    plantasRandom.forEach(planta => {
      destacadosContainer.appendChild(crearCardDestacados(planta));
    });
  }
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
  const ordenar = document.getElementById("ordenar").value;

  let plantasFiltradas = plantas.filter(planta => {
    return (
      (dificultad === "" || planta.dificultad === dificultad) &&
      (size === "" || planta.size === size) &&
      (tipo === "" || planta.tipo === tipo)
    );
  });

  let plantasOrdenadas = [...plantasFiltradas];

  if(ordenar === "precioAsc"){
    plantasOrdenadas.sort((a,b) => a.precio - b.precio);
  }else if(ordenar === "precioDesc"){
    plantasOrdenadas.sort((a,b) => b.precio - a.precio);
  }

  renderizarCatalogo(plantasOrdenadas);
}

function renderizarCatalogo(arrayPlantas) {

  if(!catalogoContainer) return;

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
  document.getElementById("ordenar").addEventListener("change", aplicarFiltros)
}

cargarPlantas();
