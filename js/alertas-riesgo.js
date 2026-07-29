/*---------------------------------------------------------------------*/
/* === ALERTAS DE CONTACTOS EN RIESGO ===
   Requiere que este archivo se cargue DESPUÉS de app.js, ya que reutiliza
   BASE_URL, getUser() y escHtml() definidos ahí.

   Piezas necesarias en el HTML (ver snippets aparte):
     - Banner clickeable en el dashboard: #riesgo-banner + #riesgo-alerta-count
     - Modal: #modal-riesgo con el body en #riesgo-container

   Enganche en app.js: dentro de showScreen(name), cuando name === "dashboard",
   llamar a actualizarBadgeRiesgo().
*/

/* --- Badge del dashboard: solo trae el conteo, no el detalle --- */
function actualizarBadgeRiesgo() {
  var banner = document.getElementById("riesgo-banner");
  if (!banner) return;

  var user = getUser();
  if (!user || !user.dni) return;

  fetch(BASE_URL + "/getcontactosriesgo.php?dataentry=" + encodeURIComponent(user.dni))
    .then(function (res) { return res.json(); })
    .then(function (json) {
      if (!json.success) return;

      var total = json.total || 0;
      var countEl = document.getElementById("riesgo-alerta-count");

      if (total > 0) {
        if (countEl) countEl.textContent = total;
        banner.style.display = "flex";
      } else {
        banner.style.display = "none";
      }
    })
    .catch(function () { /* si falla, simplemente no mostramos el banner */ });
}

/* --- Modal de detalle --- */
function abrirModalRiesgo() {
  document.getElementById("modal-riesgo").classList.add("open");
  cargarAlertasRiesgo(true);
}

function closeModalRiesgo() {
  document.getElementById("modal-riesgo").classList.remove("open");
}

function handleRiesgoOverlay(e) {
  if (e.target === document.getElementById("modal-riesgo")) closeModalRiesgo();
}

// soloMios = true  -> solo los contactos delegados al usuario logueado
// soloMios = false -> todos (pensado para el panel de admin)
function cargarAlertasRiesgo(soloMios) {
  var cont = document.getElementById("riesgo-container");
  if (!cont) return;

  cont.innerHTML = '<p class="riesgo-cargando">Cargando alertas...</p>';

  var user = getUser();
  var url  = BASE_URL + "/getcontactosriesgo.php";

  if (soloMios && user && user.dni) {
    url += "?dataentry=" + encodeURIComponent(user.dni);
  }

  fetch(url)
    .then(function (res) { return res.json(); })
    .then(function (json) {
      if (!json.success) {
        cont.innerHTML = '<p class="riesgo-vacio">No se pudieron cargar las alertas.</p>';
        return;
      }
      renderAlertasRiesgo(json);
    })
    .catch(function () {
      cont.innerHTML = '<p class="riesgo-vacio">Error de conexión al cargar alertas.</p>';
    });
}

function renderAlertasRiesgo(json) {
  var cont = document.getElementById("riesgo-container");
  if (!cont) return;

  var c = json.conteo;

  var html =
    '<div class="riesgo-header">' +
      '<div class="riesgo-stat rose"><strong>' + c.sin_contacto + '</strong><span>Sin contacto</span></div>' +
      '<div class="riesgo-stat rose"><strong>' + c.critico + '</strong><span>Críticos</span></div>' +
      '<div class="riesgo-stat gold"><strong>' + c.atencion + '</strong><span>En atención</span></div>' +
    '</div>' +
    '<div class="riesgo-lista">';

  if (json.data.length === 0) {
    html += '<p class="riesgo-vacio">🎉 No hay contactos en riesgo por ahora.</p>';
  } else {
    json.data.forEach(function (item) {
      var telLimpio = (item.celular || "").replace(/\D/g, "");

      var badges = item.motivos.map(function (m) {
        return '<span class="riesgo-badge">' + escHtml(m) + '</span>';
      }).join("");

      html +=
        '<div class="riesgo-item nivel-' + item.nivel + '">' +
          '<div class="riesgo-info">' +
            '<strong>' + escHtml(item.nombre) + ' ' + escHtml(item.apellido) + '</strong>' +
            '<div class="riesgo-badges">' + badges + '</div>' +
            (item.localidad ? '<span class="riesgo-loc">📍 ' + escHtml(item.localidad) + '</span>' : '') +
          '</div>' +
          (telLimpio
            ? '<a class="riesgo-btn" href="https://wa.me/' + telLimpio + '" target="_blank">Contactar</a>'
            : '') +
        '</div>';
    });
  }

  html += '</div>';
  cont.innerHTML = html;
}
