const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");
const paginacionDiv = document.querySelector("#paginacion");

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
  formulario.addEventListener("submit", validarFormulario);
};

function validarFormulario(e) {
  e.preventDefault();

  const terminoBusqueda = document.querySelector("#termino").value;

  if (!terminoBusqueda) {
    mostrarAlerta("Agrega un termino de búsqueda");

    return;
  }

  buscarImagenes();
}

function mostrarAlerta(mensaje) {
  const existeAlerta = document.querySelector(".bg-red-100");

  if (!existeAlerta) {
    const alerta = document.createElement("p");
    alerta.classList.add(
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "max-w-lg",
      "mx-auto",
      "mt-6",
      "text-center"
    );

    alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;

    formulario.appendChild(alerta);

    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

function buscarImagenes() {
  const termino = document.querySelector("#termino").value;

  const key = "19825179-5368322872daaf3bc7561a837";
  const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => {
      totalPaginas = calcularPagina(resultado.totalHits);
      mostrarImagenes(resultado.hits);
    });
}

function* crearPaginador(total) {
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}

function calcularPagina(total) {
  return Math.ceil(total / registrosPorPagina);
}

function mostrarImagenes(imagenes) {
  resultado.innerHTML = "";

  imagenes.forEach((imagen) => {
    const { likes, views, previewURL, largeImageURL } = imagen;
    resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 mb-4 p-3">
                <div class="bg-white ">
                    <img class="w-full" src=${previewURL} alt={tags} />
                    <div class="p-4">
                        <p class="card-text">${likes} Me Gusta</p>
                        <p class="card-text">${views} Vistas </p>
        
                        <a href=${largeImageURL} 
                        rel="noopener noreferrer" 
                        target="_blank" class="bg-blue-800 w-full p-1 block mt-5 rounded text-center font-bold uppercase hover:bg-blue-500 text-white">Ver Imagen</a>
                    </div>
                </div>
            </div>
            `;
  });
  paginacionDiv.innerHTML = "";
  imprimirPaginador();
}

function imprimirPaginador() {
  iterador = crearPaginador(totalPaginas);
  while (true) {
    const { value, done } = iterador.next();

    if (done) return;

    // Crear botón de sig
    const botonSiguiente = document.createElement("a");
    botonSiguiente.href = "#";
    botonSiguiente.dataset.pagina = value;
    botonSiguiente.textContent = value;
    botonSiguiente.classList.add(
      "siguiente",
      "bg-yellow-400",
      "px-4",
      "py-1",
      "mr-2",
      "mx-auto",
      "mb-4",
      "font-bold",
      "uppercase",
      "rounded"
    );

    botonSiguiente.onclick = () => {
      paginaActual = value;
      buscarImagenes();
    };

    paginacionDiv.appendChild(botonSiguiente);
  }
}
