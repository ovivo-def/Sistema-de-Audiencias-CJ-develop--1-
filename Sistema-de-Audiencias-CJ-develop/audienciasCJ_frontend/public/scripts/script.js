/* script.js - Mejoras visuales sin cambiar comportamiento del backend */
let rutaActual = "";

/* Normalizador para evitar rutas corruptas */
function limpiarRuta(path) {
  return path
    .replace(/^V:/i, "")
    .replace(/^V%3A/i, "")
    .replace(/^\/*/, "")
    .replace(/\/+/g, "/")
    .trim();
}

document.addEventListener("DOMContentLoaded", () => {
  const searchEl = document.getElementById("searchQuery");
  if (searchEl) {
    searchEl.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("searchButton").click();
      }
    });
  }

  const closeBtn = document.getElementById("errorModalCloseButton");
  if (closeBtn) closeBtn.addEventListener("click", cerrarVentanaError);

  /** ← Render inicial del breadcrumb */
  renderBreadcrumb("");
});

/* Modal */
function mostrarVentanaError(mensaje) {
  const errorModal = document.getElementById("errorModal");
  const errorModalMessage = document.getElementById("errorModalMessage");
  errorModalMessage.textContent = mensaje;
  errorModal.classList.remove("hidden");
  document.getElementById("errorModalCloseButton").focus();
}

function cerrarVentanaError() {
  document.getElementById("errorModal").classList.add("hidden");
}

/* ---------------------------
   FUNCIÓN NECESARIA PARA BREADCRUMB
-----------------------------*/
function cargarContenido(ruta) {
  rutaActual = limpiarRuta(ruta || "");

  mostrarPopupCargando();

  fetch(
    `http://172.31.76.215:3000/api/files/contenido-carpeta?path=${encodeURIComponent(
      rutaActual
    )}`
  )
    .then((r) => r.text())
    .then((html) => {
      const cont = document.getElementById("resultados");
      cont.innerHTML = html;
      mostrarSoloNombresNumeros(cont);

      /** ← ACTUALIZA BREADCRUMB CADA VEZ QUE CAMBIA LA RUTA */
      renderBreadcrumb(rutaActual);
    })
    .catch((err) => {
      console.error("Error cargando carpeta:", err);
      mostrarVentanaError("No se pudo cargar la carpeta.");
    })
    .finally(() => cerrarPopupCargando());
}

/* Búsqueda */
function realizarBusqueda() {
  const query = document.getElementById("searchQuery").value;
  mostrarPopupCargando();
  fetch(
    `http://172.31.76.215:3000/api/files/buscar?query=${encodeURIComponent(query)}`
  )
    .then((response) => response.text())
    .then((html) => {
      const resultados = document.getElementById("resultados");
      resultados.innerHTML = html;
      mostrarSoloNombresNumeros(resultados);

      /** No hay ruta actual en búsquedas */
      renderBreadcrumb(query);
    })
    .catch((error) => {
      console.error("Error al realizar la búsqueda:", error);
      document.getElementById("resultados").innerHTML =
        '<p class="error">Hubo un error al realizar la búsqueda.</p>';
    })
    .finally(() => cerrarPopupCargando());
}

/* Reconstrucción de tabla */
function mostrarSoloNombresNumeros(container) {
  let nuevaTabla = "";
  const filas = container.querySelectorAll("tr.trdata1, tr.trdata2");

  if (filas.length > 0) {
    let contador = 0;
    filas.forEach((tr) => {
      if (contador >= 100) return;
      const fecha = tr.querySelector("td.modifieddata").innerText;
      const td = tr.querySelector("td.file, td.folder");

      if (!td) return;

      const enlace = td.querySelector("a");
      //const fecha = td_fecha.querySelector("nobr,nobr");

      const esCarpeta = td.classList.contains("folder");
      const icono = esCarpeta ? "📁" : "🎞️";
      const nombre = enlace ? enlace.textContent.trim() : td.textContent.trim();

      let pathCompleto = enlace?.getAttribute("href") || nombre;
      console.log("pathCompleto al mostrar: ",pathCompleto);
      pathCompleto = limpiarRuta(pathCompleto);
      console.log("pathCompleto al limpiar: ",pathCompleto);
      nuevaTabla += `
        <div class="result-item">
          <div class="icon">${icono}</div>
          <div class="meta">
            <a href="#" onclick="handleClick('${escapeForOnclick(
              pathCompleto
            )}');return false;">
              ${escapeHtml(nombre)}
            </a>
          </div>
          <div class="fecha">${fecha}</div>

        </div>
      `;
      contador++;
    });
  } else {
    nuevaTabla = '<p class="error">No se encontraron resultados.</p>';
    
  }

  container.innerHTML = nuevaTabla;
}

/* Helpers */
function escapeForOnclick(s) {
  console.log("Funcion escapeForOnClick");
  return s.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/* Navegación */
function handleClick(path) {
  const rutaLimpia = limpiarRuta(path);

  if (rutaLimpia.includes(".")) return verArchivo(rutaLimpia);

  /** ← IMPORTANTE: CENTRALIZAR NAVEGACIÓN */
  cargarContenido(rutaLimpia);
}

/* Abrir archivo */
function verArchivo(path) {
  const rutaLimpia = limpiarRuta(path);

  ocultarBarraCarga();
  mostrarBarraCarga();

  fetch(`http://172.31.76.215:3000/api/files/ver-archivo?path=${rutaLimpia}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.path?.endsWith(".mp4")) {
        openVideoModal(data.path);
        ocultarBarraCarga();
      } else if (data.path?.endsWith(".wmv")) {
        const a = document.createElement("a");
        a.href = data.path;
        a.download = "video.wmv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        mostrarVentanaError("El archivo se descargará pronto");
        ocultarBarraCarga();
      } else if (data.path?.endsWith(".pdf")) {
        mostrarVentanaError("El archivo se abrirá pronto");
        window.open(data.path, "_blank");
        ocultarBarraCarga();
      } else {
        mostrarVentanaError("Solo se pueden ver archivos en formato MP4.");
        ocultarBarraCarga();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      ocultarBarraCarga();
      mostrarVentanaError("Ocurrió un error al intentar obtener el archivo.");
    });
}

/* Carga UI */
function mostrarPopupCargando() {
  document.getElementById("popupCargando")?.classList.remove("hidden");
}

function cerrarPopupCargando() {
  document.getElementById("popupCargando")?.classList.add("hidden");
}

function mostrarBarraCarga() {
  const container = document.getElementById("barraCargaContainer");
  const barra = document.getElementById("barraCarga");
  if (!container || !barra) return;

  container.classList.remove("hidden");
  barra.style.width = "0%";
  let width = 0;

  const interval = setInterval(() => {
    if (width >= 98) {
      clearInterval(interval);
    } else {
      width += Math.floor(Math.random() * 8) + 2;
      if (width > 98) width = 98;
      barra.style.width = width + "%";
      container.setAttribute("aria-valuenow", String(width));
    }
  }, 180);
}

function ocultarBarraCarga() {
  const container = document.getElementById("barraCargaContainer");
  const barra = document.getElementById("barraCarga");
  if (barra) barra.style.width = "0%";
  if (container) container.classList.add("hidden");
}

/* Limpiar búsqueda */
document
  .getElementById("btnLimpiar")
  .addEventListener("click", limpiarBusqueda);

function limpiarBusqueda() {
  rutaActual = "";

  document.getElementById("searchQuery").value = "";
  document.getElementById("resultados").innerHTML = "";
  document.getElementById("breadcrumb").innerHTML = "";
  document.getElementById("visorContenido").innerHTML = "";

  obtenerRoot();

  /** Reiniciar breadcrumb */
  renderBreadcrumb("");
}

document.getElementById("searchQuery").addEventListener("input", () => {
  rutaActual = "";
});

/* ---------------------------
   BREADCRUMB COMPLETO
-----------------------------*/
function renderBreadcrumb(rutaActual) {
  const breadcrumbDiv = document.getElementById("breadcrumb");

  let ruta = rutaActual.replace(/\/+/g, "/").replace(/^\/|\/$/g, "");

  if (ruta === "") {
    breadcrumbDiv.innerHTML = `<span class="active">Inicio</span>`;
    return;
  }

  const partes = ruta.split("/");
  let rutaAcumulada = "";
  let html = `<span data-path="" class="breadcrumb-item">Inicio</span> / `;

  partes.forEach((parte, index) => {
    rutaAcumulada += index === 0 ? parte : "/" + parte;

    if (index === partes.length - 1) {
      html += `<span class="active">${parte}</span>`;
    } else {
      html += `<span data-path="${rutaAcumulada}" class="breadcrumb-item">${parte}</span> / `;
    }
  });

  breadcrumbDiv.innerHTML = html;

  /** Listener para navegar */
  document.querySelectorAll(".breadcrumb-item").forEach((item) => {
    item.addEventListener("click", () => {
      const ruta = item.getAttribute("data-path");
      cargarContenido(ruta);
    });
  });
}

function closeVideoModal() {
  const modal = document.getElementById("videoModal");
  const videoPlayer = document.getElementById("modalVideoPlayer");

  modal.style.display = "none";
  videoPlayer.pause(); // Pausa el video
  videoPlayer.currentTime = 0; // Opcional: lo reinicia
}
document.getElementById("closeModal").onclick = closeVideoModal;

// Si se hace clic fuera del contenido, cerrar modal
window.onclick = function (event) {
  const modal = document.getElementById("videoModal");
  if (event.target === modal) closeVideoModal();
};

function openVideoModal(rutaVideo) {
  const modal = document.getElementById("videoModal");
  const videoPlayer = document.getElementById("modalVideoPlayer");
  const videoSource = document.getElementById("modalVideoSource");

  // Asigna la ruta recibida (desde tu API)
  videoSource.src = rutaVideo;
  videoPlayer.load(); // Recarga el reproductor
  videoPlayer.play(); // Reproduce automáticamente

  modal.style.display = "block";
}
