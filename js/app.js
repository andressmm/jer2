const getUser = () => JSON.parse(localStorage.getItem("user") || "null");

const BASE_URL = "https://www.cronomet.com.ar/jer/php";

const nombre = document.querySelector(".dash-name");
const rol    = document.querySelector(".dash-role");

/*---------------------------------------------------------------------*/

const cargarDatosUsuario = () => {
  const user = getUser();
  if (user) {
    nombre.textContent = `${user.nombre} ${user.apellido}`;
    rol.textContent    = user.rol;
  

  } else {
    nombre.textContent = "Invitado";
    rol.textContent    = "Sin rol asignado";
  }
};

cargarDatosUsuario();

/*---------------------------------------------------------------------*/

function openModal(id) {
  if (id === "identificarme") {
    document.getElementById("modal").classList.add("open");
    setTimeout(function() { document.getElementById("dni-input").focus(); }, 350);
    document.getElementById("ingresar-btn").textContent = "Ingresar";
  }
}

/*---------------------------------------------------------------------*/

function closeModal() {
  document.getElementById("modal").classList.remove("open");
  document.getElementById("dni-input").value = "";
  clearError();
}

/*---------------------------------------------------------------------*/

function handleOverlayClick(e) {
  if (e.target === document.getElementById("modal")) closeModal();
}

/*---------------------------------------------------------------------*/

function clearError() {
  document.getElementById("error-msg").textContent = "";
}

/*---------------------------------------------------------------------*/

const ingresarBtn = document.getElementById("ingresar-btn");

async function verificarDni() {
  const dni      = document.getElementById("dni-input").value.trim();
  const errorMsg = document.getElementById("error-msg");

  ingresarBtn.textContent = "⌛ Cargando...";

  if (!dni) {
    errorMsg.textContent    = "Por favor ingresá tu DNI.";
    ingresarBtn.textContent = "Ingresar";
    return;
  }

  try {
    const response = await fetch(BASE_URL +"/identificarme.php", {
      method:  "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:    "dni=" + encodeURIComponent(dni)
    });

    const user = await response.json();

    if (!user || (Array.isArray(user) && user.length === 0)) {
      errorMsg.textContent    = "DNI no encontrado. Verificá e intentá de nuevo.";
      ingresarBtn.textContent = "Ingresar";
      document.getElementById("dni-input").focus();
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    cargarDatosUsuario();
    closeModal();
    showScreen("dashboard");

  } catch (error) {
    console.error(error);
    errorMsg.textContent = "Error al conectar con el servidor.";
  }
}

/*---------------------------------------------------------------------*/

const SCREENS = ["home", "dashboard", "troquel", "registro", "contactos","seguimiento"];

function showScreen(name) {
  SCREENS.forEach(function(s) {
    let el = document.getElementById("screen-" + s);
    if (!el) return;
    el.style.display = "none";
    el.classList.remove("visible");
  });
  let target = document.getElementById("screen-" + name);
  
  if (!target) return;
  target.style.display = "flex";
  setTimeout(function() { target.classList.add("visible"); }, 10);
  window.scrollTo(0, 0);
  console.log(name);

 
const us = JSON.parse(localStorage.getItem("user"));


  console.log(us.rol);
if ((us.rol === "Pastor" || us.rol === "Ay.Pastor") && name === "dashboard") {
    const panel = document.querySelector(".panel");
    panel.style.display = "flex";
}


    if (name==="troquel"){
       limpiarFormTroquel(); 
    }

}



/*---------------------------------------------------------------------*/

function logout() {
  localStorage.removeItem("user");
  cargarDatosUsuario();
  showScreen("home");
}

/*---------------------------------------------------------------------*/

function toggleContact(btn) {
  btn.closest(".contact-toggle").querySelectorAll(".contact-btn").forEach(function(b) {
    b.classList.remove("active");
  });
  btn.classList.add("active");
}

/*---------------------------------------------------------------------*/

function selectTipo(btn) {
  btn.closest(".toggle-group").querySelectorAll(".toggle-btn").forEach(function(b) {
    b.classList.remove("active");
  });
  btn.classList.add("active");
}

/*---------------------------------------------------------------------*/

function showToast(msg, success) {
  success = success || false;
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.style.cssText = [
      "position:fixed", "bottom:32px", "left:50%",
      "transform:translateX(-50%) translateY(20px)",
      "background:#1e2330", "border:1px solid rgba(255,255,255,0.1)",
      "color:#f1ede4", "font-family:Outfit,sans-serif",
      "font-size:13px", "font-weight:600", "padding:12px 22px",
      "border-radius:99px", "z-index:9999",
      "box-shadow:0 8px 32px rgba(0,0,0,0.4)",
      "opacity:0", "transition:opacity 0.2s,transform 0.2s",
      "white-space:nowrap", "max-width:90vw", "text-align:center"
    ].join(";");
    document.body.appendChild(t);
  }
  t.textContent    = msg;
  t.style.border   = "1px solid " + (success ? "rgba(62,207,142,0.35)" : "rgba(224,92,122,0.35)");
  t.style.color    = success ? "#3ecf8e" : "#e05c7a";
  t.style.opacity  = "1";
  t.style.transform = "translateX(-50%) translateY(0)";
  clearTimeout(t._timer);
  t._timer = setTimeout(function() {
    t.style.opacity   = "0";
    t.style.transform = "translateX(-50%) translateY(10px)";
  }, success ? 1600 : 2800);
}

/*---------------------------------------------------------------------*/

// Auto-login
(function() {
  if (localStorage.getItem("user")) {
    showScreen("dashboard");
  } else {
    showScreen("home");
  }
})();

/*---------------------------------------------------------------------*/

function guardarUsuario() {
  const guardarBtn = document.getElementById("guardarBtn");
  guardarBtn.textContent = "⌛ Cargando...";

  let camposregistro = [
    { id: "r-nombre",    label: "Nombre" },
    { id: "r-apellido",  label: "Apellido" },
    { id: "r-celular",   label: "Celular" },
    { id: "r-dni",       label: "DNI" },
    { id: "r-direccion", label: "Dirección" },
  ];

  document.querySelectorAll(".field-input.error").forEach(function(el) {
    el.classList.remove("error");
  });

  let faltantes = [];
  camposregistro.forEach(function(c) {
    let el    = document.getElementById(c.id);
    let valor = el.value.toString().trim();
    if (!valor) {
      faltantes.push(c.label);
      el.classList.add("error");
      el.addEventListener("input", function() { el.classList.remove("error"); }, { once: true });
    }
  });

  if (faltantes.length > 0) {
    guardarBtn.textContent = "Guardar registro";
    showToast("Completá: " + faltantes.join(", "));
    let first = document.querySelector(".field-input.error");
    if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  let formData = new FormData();
  formData.append("nombre",    document.getElementById("r-nombre").value.trim());
  formData.append("apellido",  document.getElementById("r-apellido").value.trim());
  formData.append("celular",   document.getElementById("r-celular").value.trim());
  formData.append("dni",       document.getElementById("r-dni").value.toString().trim());
  formData.append("direccion", document.getElementById("r-direccion").value.trim());
  formData.append("rol",       document.querySelector("#rol-group .toggle-btn.active").textContent.trim());

  fetch(BASE_URL +"/guardarusuario.php", {
    method: "POST",
    body:   formData
  })
  .then(function(r) { return r.json(); })
  .then(function(result) {
    guardarBtn.textContent = "Guardar registro";
    if (result.success) {
      showToast("Usuario registrado correctamente", true);
      setTimeout(function() { showScreen("home"); }, 1800);
    } else {
      showToast("Error: " + result.message);
    }
  })
  .catch(function() {
    guardarBtn.textContent = "Guardar registro";
    showToast("Error de conexión con el servidor");
  });
}

/*---------------------------------------------------------------------*/

const guardarTroquelBtn = document.getElementById("guardarTroquelBtn");

function guardarTroquel() {
  guardarTroquelBtn.textContent = "⌛ Guardando...";

  var campos = [
    { id: "f-nombre",    label: "Nombre" },
    { id: "f-apellido",  label: "Apellido" },
    { id: "f-celular",   label: "Celular" },
    { id: "f-direccion", label: "Dirección" },
    { id: "f-localidad", label: "Localidad" },
  ];

  document.querySelectorAll(".field-input.error").forEach(function(el) {
    el.classList.remove("error");
  });

  var faltantes = [];
  campos.forEach(function(c) {
    var el    = document.getElementById(c.id);
    var valor = el.value.toString().trim();
    if (!valor) {
      faltantes.push(c.label);
      el.classList.add("error");
      el.addEventListener("input", function() { el.classList.remove("error"); }, { once: true });
    }
  });

  if (faltantes.length > 0) {
    guardarTroquelBtn.textContent = "Guardar troquel";
    showToast("Completá: " + faltantes.join(", "));
    var first = document.querySelector(".field-input.error");
    if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  var nombreVal   = document.getElementById("f-nombre").value.trim();
  var apellidoVal = document.getElementById("f-apellido").value.trim();
  var visitaVal   = document.querySelector("#visita-group .toggle-btn.active")
                    ? document.querySelector("#visita-group .toggle-btn.active").textContent.trim()
                    : "No";


                    var casadepazVal = document.querySelector("#casadepaz-group .toggle-btn.active")
                   ? document.querySelector("#casadepaz-group .toggle-btn.active").textContent.trim()
                   : "No";

var celularVal  = document.getElementById("f-celular").value.trim();


  // 1. Verificar duplicado primero
fetch(BASE_URL +"/verificartroquel.php?nombre=" + encodeURIComponent(nombreVal) + "&apellido=" + encodeURIComponent(apellidoVal) + "&celular=" + encodeURIComponent(celularVal))    .then(function(r) { return r.json(); })
    .then(function(check) {
      if (check.existe) {
        guardarTroquelBtn.textContent = "Guardar troquel";
        showToast("⚠️ ERROR, LA PERSONA YA ESTÁ CARGADA");
        return;
      }

      // 2. Si no existe, guardar
      var formData = new FormData();
      formData.append("nombre",        nombreVal);
      formData.append("apellido",      apellidoVal);
      formData.append("celular",       document.getElementById("f-celular").value.trim());
      formData.append("contacto",      document.querySelector(".toggle-contact-btn.active") ? document.querySelector(".toggle-contact-btn.active").textContent.trim() : "WhatsApp");
      formData.append("direccion",     document.getElementById("f-direccion").value.trim());
      formData.append("barrio",        document.getElementById("f-barrio").value.trim());
      formData.append("localidad",     document.getElementById("f-localidad").value.trim());
      formData.append("provincia",     document.getElementById("f-provincia") ? document.getElementById("f-provincia").value.trim() : "");
      formData.append("observaciones", document.getElementById("f-observaciones") ? document.getElementById("f-observaciones").value.trim() : "");
      formData.append("edad",          document.querySelector("#tipo-group .toggle-btn.active").textContent.trim());
      formData.append("visita",        visitaVal);
      
formData.append("casadepaz", casadepazVal);
formData.append("decision", document.querySelector("#decision-group .toggle-btn.active").textContent.trim());


      const user = getUser();
      formData.append("dataentry", user?.dni || "");

      fetch(BASE_URL +"/guardartroquel.php", {
        method: "POST",
        body:   formData
      })
      .then(function(r) { return r.json(); })
      .then(function(result) {
        guardarTroquelBtn.textContent = "Guardar troquel";
        if (result.success) {
          
          showToast("Troquel guardado correctamente", true);
         
          setTimeout(function() { showScreen("dashboard"); }, 1800);
        } else {
          showToast("Error: " + result.message);
        }
      })
      .catch(function() {
        guardarTroquelBtn.textContent = "Guardar troquel";
        showToast("Error de conexión con el servidor");
      });
    })
    .catch(function() {
      guardarTroquelBtn.textContent = "Guardar troquel";
      showToast("Error al verificar duplicados");
    });
}
/*---------------------------------------------------------------------*/
/* === MIS CONTACTOS === */

function showContactos(getOpcion) {

  console.log(getOpcion);
  showScreen("contactos");

  document.getElementById("contactos-loading").style.display = "flex";
  document.getElementById("contactos-list").style.display    = "none";
  document.getElementById("contactos-empty").style.display   = "none";
  document.getElementById("contactos-error").style.display   = "none";
  document.getElementById("contactos-subtitle").textContent  = "Cargando...";

  var userRaw = localStorage.getItem("user");
  var dni     = null;

  if (userRaw) {
    try {
      var parsed = JSON.parse(userRaw);
      dni = parsed.dni || parsed.DNI || parsed.Dni || null;
    } catch(e) {
      dni = userRaw;
    }
  }

  if (!dni) {
    document.getElementById("contactos-loading").style.display = "none";
    document.getElementById("contactos-error").style.display   = "flex";
    document.getElementById("contactos-error-msg").textContent = "No se encontró el DNI del usuario.";
    document.getElementById("contactos-subtitle").textContent  = "Error";
    return;
  }

  fetch(BASE_URL +"/miscontactos.php?dni=" + encodeURIComponent(dni))
    .then(function(res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function(data) {
      document.getElementById("contactos-loading").style.display = "none";

      var contactos = Array.isArray(data) ? data : (data.data || []);

      if (!contactos || contactos.length === 0) {
        document.getElementById("contactos-empty").style.display = "flex";
        document.getElementById("contactos-subtitle").textContent = "Sin contactos";
        return;
      }

      document.getElementById("contactos-subtitle").textContent =
        contactos.length + (contactos.length === 1 ? " contacto" : " contactos");

      var list = document.getElementById("contactos-list");
      list.innerHTML = "";

      contactos.forEach(function(c, idx) {
        let nombre   = (c.nombre   || c.Nombre   || "").trim();
        let apellido = (c.apellido || c.Apellido || "").trim();
        let fullname = [nombre, apellido].filter(Boolean).join(" ") || "Sin nombre";
        let initials = ((nombre[0] || "") + (apellido[0] || "")).toUpperCase() || "?";
        let id       = c.id || c.ID || idx;
        let oracion  = (c.oracion || "no").trim().toLowerCase();

        let botonOracion = oracion === "si"
          ? '<button class="oracion-btn oracion-activa" title="Ver oraciones" data-action="verOraciones" data-id="' + id + '" data-nombre="' + escHtml(fullname) + '">🙏</button>'
          : '<button class="oracion-btn" title="Pedido de oración" data-action="nuevaOracion" data-id="' + id + '" data-nombre="' + escHtml(fullname) + '">🙏</button>';

        let tituloMisContactos=document.querySelector(".title-miscontactos");


if (getOpcion != "oraciones") { botonOracion = ""; }
if (getOpcion === "oraciones") { botonLupa= "";  tituloMisContactos.textContent="Pedidos de oración"; }



        var item = document.createElement("div");
        item.className = "contact-item";
        item.style.animationDelay = (idx * 0.05) + "s";
        item.innerHTML =
          '<div class="contact-avatar">' + initials + '</div>' +
          '<div class="contact-info">' +
            '<p class="contact-fullname">' + escHtml(fullname) + '</p>' +
          
          '</div>' +
          '<div class="contact-actions">' +
            botonOracion +
          ' <button class="oracion-btn botLupa" title="Ver datos" data-action="verDetalle" data-id="' + id + '">🔍</button>'+
          '</div>';




        list.appendChild(item);
        if (getOpcion === "oraciones") { document.querySelectorAll(".botLupa").forEach(btn => btn.style.display = "none"); }

        
      });

      list.style.display = "block";
    })
    .catch(function(err) {
      document.getElementById("contactos-loading").style.display = "none";
      document.getElementById("contactos-error").style.display   = "flex";
      document.getElementById("contactos-error-msg").textContent = "Error: " + err.message;
      document.getElementById("contactos-subtitle").textContent  = "Error";
    });
}

/*---------------------------------------------------------------------*/

function escHtml(str) {
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

/*---------------------------------------------------------------------*/
/* === DELEGACIÓN DE EVENTOS — LISTA CONTACTOS === */

document.addEventListener("click", function(e) {
  var btn = e.target.closest("[data-action]");
  if (!btn) return;

  console.log("btn encontrado:", btn);
  console.log("action:", btn.dataset.action);
  console.log("id:", btn.dataset.id);

  var action = btn.dataset.action;
  var id     = btn.dataset.id;
  var nombre = btn.dataset.nombre || "";

  if (action === "nuevaOracion") showOracion(id, nombre);
  if (action === "verOraciones") showOraciones(id, nombre);
  if (action === "verDetalle")   showDetalle(id);
});/*---------------------------------------------------------------------*/
/* === MODAL ORACIÓN NUEVA === */

var oracionContactoId = null;

function showOracion(id, nombre) {
  oracionContactoId = id;
  document.getElementById("oracion-nombre-target").textContent = nombre || "Contacto";
  document.querySelectorAll("#modal-oracion input[type='checkbox']")
    .forEach(function(cb) { cb.checked = false; });
  document.querySelectorAll("#modal-oracion details")
    .forEach(function(d) { d.removeAttribute("open"); });
  document.getElementById("modal-oracion").classList.add("open");
}

function closeOracion() {
  document.getElementById("modal-oracion").classList.remove("open");
  oracionContactoId = null;
}

function handleOracionOverlay(e) {
  if (e.target === document.getElementById("modal-oracion")) closeOracion();
}

function guardarOracion() {
  var seleccionados = [];
  document.querySelectorAll("#modal-oracion input[type='checkbox']:checked")
    .forEach(function(cb) { seleccionados.push(cb.value); });

  if (seleccionados.length === 0) {
    showToast("Seleccioná al menos un pedido de oración.");
    return;
  }

  var btn = document.querySelector(".btn-oracion-submit");
  btn.textContent = "Guardando...";
  btn.disabled    = true;

  var formData = new FormData();
  formData.append("id_contacto", oracionContactoId);
  formData.append("motivos",     JSON.stringify(seleccionados));

  fetch(BASE_URL +"/guardaroracion.php", {
    method: "POST",
    body:   formData
  })
  .then(function(res) {
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.text();
  })
  .then(function(text) {
    var data = JSON.parse(text);
    if (data.success) {
      closeOracion();
      showToast("✅ " + data.message, true);
      setTimeout(function() { showScreen("dashboard"); }, 1800);
    } else {
      showToast("⚠️ " + data.message);
    }
  })
  .catch(function(err) {
    showToast("❌ Error: " + err.message);
  })
  .finally(function() {
    btn.textContent = "Guardar pedido 🙏";
    btn.disabled    = false;
  });
}

/*---------------------------------------------------------------------*/
/* === MODAL DETALLE === */

function showDetalle(id) {
  console.log(id);
  document.getElementById("modal-detalle").classList.add("open");
  document.getElementById("detalle-nombre").textContent    = "Cargando...";
  document.getElementById("detalle-avatar").textContent    = "--";
  document.getElementById("detalle-localidad").textContent = "";
  document.getElementById("detalle-body").innerHTML =
    '<div class="contactos-loading"><div class="loading-spinner"></div><p>Cargando datos...</p></div>';

  fetch(BASE_URL +"/detallecontacto.php?id=" + encodeURIComponent(id))
    .then(function(res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function(d) {
      if (!d.success) throw new Error(d.message || "Sin datos");

      let c        = d.data;
      let nombre   = (c.nombre   || "").trim();
      let apellido = (c.apellido || "").trim();
      let decision = (c.decision || "").trim();

      let fullname = [nombre, apellido].filter(Boolean).join(" ") || "Sin nombre";
      let initials = ((nombre[0] || "") + (apellido[0] || "")).toUpperCase() || "?";

      document.getElementById("detalle-avatar").textContent    = initials;
      document.getElementById("detalle-nombre").textContent    = fullname;
      document.getElementById("detalle-localidad").textContent = c.localidad || "";

      var oracionBadge = (c.oracion === "si")
        ? '<span class="detalle-badge badge-si">✔ Sí</span>'
        : '<span class="detalle-badge badge-no">No</span>';


        var visitaBadge = (c.quierevisita === "Sí" || c.quierevisita === "Si" || c.quierevisita === "si")
  ? '<span class="detalle-badge badge-si">✔ Sí</span>'
  : '<span class="detalle-badge badge-no">No</span>';

      var casadepazBadge = (c.casadepaz === "Sí" || c.casadepaz === "Si" || c.casadepaz === "si")
  ? '<span class="detalle-badge badge-si">✔ Sí</span>'
  : '<span class="detalle-badge badge-no">No</span>';

      document.getElementById("detalle-body").innerHTML =
        '<div class="detalle-section">' +
          '<p class="detalle-section-title">Contacto</p>' +
          fila("Celular",   c.celular  || "—") +
          fila("Vía",       c.contacto || "—") +
        '</div>' +
        '<div class="detalle-section">' +
          '<p class="detalle-section-title">Ubicación</p>' +
          fila("Dirección", c.direccion  || "—") +
          fila("Barrio",    c.barrio     || "—") +
          fila("Localidad", c.localidad  || "—") +
          fila("Provincia", c.provincia  || "—") +
         
  '<div class="detalle-row"><span class="detalle-label">¿Quiere visita?</span><span class="detalle-value">' + visitaBadge + '</span></div>' +

  '<div class="detalle-row"><span class="detalle-label">¿Casa de paz?</span><span class="detalle-value">' + casadepazBadge + '</span></div>' +
'</div>' +
        '</div>' +
        '<div class="detalle-section">' +
          '<p class="detalle-section-title">Otros</p>' +
          fila("Edad/Tipo", c.edad || "—") +
          fila("Decisión", c.decision || "—") +
          '<div class="detalle-row"><span class="detalle-label">Oración</span><span class="detalle-value">' + oracionBadge + '</span></div>' +
          fila("Obs.",      c.observaciones || "—") +
        '</div>';
    })
    .catch(function(err) {
      document.getElementById("detalle-body").innerHTML =
        '<div class="contactos-empty"><p style="color:var(--rose)">Error al cargar</p><span>' + err.message + '</span></div>';
    });
}

function fila(label, value) {
  return '<div class="detalle-row">' +
    '<span class="detalle-label">' + label + '</span>' +
    '<span class="detalle-value">' + escHtml(String(value)) + '</span>' +
  '</div>';
}

function closeDetalle() {
  document.getElementById("modal-detalle").classList.remove("open");
}

function handleDetalleOverlay(e) {
  if (e.target === document.getElementById("modal-detalle")) closeDetalle();
}

/*---------------------------------------------------------------------*/
/* === MODAL ORACIONES GUARDADAS === */

function showOraciones(id, nombre) {
  document.getElementById("modal-oraciones").classList.add("open");
  document.getElementById("oraciones-nombre").textContent = nombre || "Contacto";

  var initials = nombre.split(" ").map(function(p) { return p[0] || ""; }).join("").substring(0, 2).toUpperCase();
  document.getElementById("oraciones-avatar").textContent = initials || "?";

  document.getElementById("oraciones-body").innerHTML =
    '<div class="contactos-loading"><div class="loading-spinner"></div><p>Cargando pedidos...</p></div>';

  fetch(BASE_URL +"/getoraciones.php?id_contacto=" + encodeURIComponent(id))
    .then(function(res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function(data) {
      if (!data.success) throw new Error(data.message || "Sin datos");

      var lista = data.data || [];

      if (lista.length === 0) {
        document.getElementById("oraciones-body").innerHTML =
          '<div class="contactos-empty">' +
            '<p>Sin pedidos registrados</p>' +
            '<span>Todavía no hay pedidos de oración para este contacto.</span>' +
          '</div>';
        return;
      }

      var categorias = {
        "Finanzas": ["Aumento de ingresos","Salir de deudas","Conseguir trabajo / ascenso laboral","Por una casa o auto"],
        "Familiar": ["Matrimonio feliz","Problemas familiares","Familiar con adicciones","Familiar enfermo"],
        "Personal": ["Sanar enfermedad","Libertad de vicios","Depresión y desánimo","Soledad","Ser libre de opresiones","Protección contra maldad y hechicería"],
        "Otros":    ["Por una injusticia","Cosas demoradas o trabadas","Examen o materia"]
      };
      var emojis = { "Finanzas":"💰", "Familiar":"👨‍👩‍👧", "Personal":"🙋", "Otros":"✳️" };

      var motivos = lista.map(function(r) { return r.motivo; });
      var html2   = "";

      Object.keys(categorias).forEach(function(cat) {
        var enCat = motivos.filter(function(m) {
          return categorias[cat].indexOf(m) !== -1;
        });
        if (enCat.length === 0) return;
        html2 += '<div class="detalle-section">' +
          '<p class="detalle-section-title">' + emojis[cat] + " " + cat + '</p>';
        enCat.forEach(function(m) {
          html2 += '<div class="detalle-row">' +
            '<span style="font-size:15px;flex-shrink:0">🙏</span>' +
            '<span class="detalle-value">' + escHtml(m) + '</span>' +
          '</div>';
        });
        html2 += '</div>';
      });

      // Motivos que no cayeron en ninguna categoría
      var sinCat = motivos.filter(function(m) {
        return !Object.values(categorias).some(function(arr) { return arr.indexOf(m) !== -1; });
      });
      if (sinCat.length > 0) {
        html2 += '<div class="detalle-section"><p class="detalle-section-title">Otros pedidos</p>';
        sinCat.forEach(function(m) {
          html2 += '<div class="detalle-row">' +
            '<span style="font-size:15px;flex-shrink:0">🙏</span>' +
            '<span class="detalle-value">' + escHtml(m) + '</span>' +
          '</div>';
        });
        html2 += '</div>';
      }

      document.getElementById("oraciones-body").innerHTML = html2 ||
        '<div class="contactos-empty"><p>Sin pedidos</p></div>';
    })
    .catch(function(err) {
      document.getElementById("oraciones-body").innerHTML =
        '<div class="contactos-empty">' +
          '<p style="color:var(--rose)">Error al cargar</p>' +
          '<span>' + err.message + '</span>' +
        '</div>';
    });
}

function closeOraciones() {
  document.getElementById("modal-oraciones").classList.remove("open");
}

function handleOracionesOverlay(e) {
  if (e.target === document.getElementById("modal-oraciones")) closeOraciones();
}



/* ---------------------------------------------------------------------*/

function limpiarFormTroquel() {
  // Inputs de texto
  document.getElementById("f-nombre").value       = "";
  document.getElementById("f-apellido").value      = "";
  document.getElementById("f-celular").value       = "";
  document.getElementById("f-direccion").value     = "";
  document.getElementById("f-barrio").value        = "";
  document.getElementById("f-localidad").value     = "";
  document.getElementById("f-provincia").value     = "";
  document.getElementById("f-observaciones").value = "";

  

  // Resetear toggle contacto → WhatsApp activo
  document.querySelectorAll(".toggle-contact-btn").forEach(function(b) {
    b.classList.remove("active");
  });
  document.querySelector(".toggle-contact-btn").classList.add("active");

  // Resetear tipo de persona → Adulto activo
  document.querySelectorAll("#tipo-group .toggle-btn").forEach(function(b) {
    b.classList.remove("active");
  });
  document.querySelector("#tipo-group .toggle-btn").classList.add("active");



  document.querySelectorAll("#casadepaz-group .toggle-btn").forEach(function(b) {
  b.classList.remove("active");
});
document.querySelector("#casadepaz-group .toggle-btn").classList.add("active");

  // Resetear visita → Sí activo
  document.querySelectorAll("#visita-group .toggle-btn").forEach(function(b) {
    b.classList.remove("active");
  });
  document.querySelector("#visita-group .toggle-btn").classList.add("active");
}





/*---------------------------------------------------------------------*/
/* === SEGUIMIENTO === */

function showSeguimiento() {
  showScreen("seguimiento");

  document.getElementById("seguimiento-loading").style.display = "flex";
  document.getElementById("seguimiento-body").style.display    = "none";
  document.getElementById("seguimiento-empty").style.display   = "none";
  document.getElementById("seguimiento-error").style.display   = "none";
  document.getElementById("seguimiento-subtitle").textContent  = "Cargando...";

  var userRaw = localStorage.getItem("user");
  var dni = null;
  if (userRaw) {
    try {
      var parsed = JSON.parse(userRaw);
      dni = parsed.dni || parsed.DNI || null;
    } catch(e) { dni = userRaw; }
  }

  if (!dni) {
    document.getElementById("seguimiento-loading").style.display = "none";
    document.getElementById("seguimiento-error").style.display   = "flex";
    document.getElementById("seguimiento-error-msg").textContent = "No se encontró el DNI.";
    return;
  }

  fetch(BASE_URL + "/seguimientocontactos.php?dni=" + encodeURIComponent(dni))
    .then(function(res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function(data) {
      document.getElementById("seguimiento-loading").style.display = "none";

      var contactos = Array.isArray(data) ? data : (data.data || []);

      if (!contactos || contactos.length === 0) {
        document.getElementById("seguimiento-empty").style.display = "flex";
        document.getElementById("seguimiento-subtitle").textContent = "Sin contactos";
        return;
      }

      document.getElementById("seguimiento-subtitle").textContent = contactos.length + " contacto(s)";

      // Separar en secciones
      var secciones = {
        "casadepaz": { label: "⛪ Casa de paz",  items: [], filtro: function(c) { return norm(c.casadepaz) === "sí" || norm(c.casadepaz) === "si"; } },
        "visita":    { label: "🏠 Visita",        items: [], filtro: function(c) { return (norm(c.quierevisita) === "sí" || norm(c.quierevisita) === "si") && norm(c.casadepaz) !== "sí" && norm(c.casadepaz) !== "si"; } },
        "whatsapp":  { label: "💬 WhatsApp",      items: [], filtro: function(c) { return norm(c.contacto) === "whatsapp" && norm(c.casadepaz) !== "sí" && norm(c.casadepaz) !== "si" && norm(c.quierevisita) !== "sí" && norm(c.quierevisita) !== "si"; } },
        "llamada":   { label: "📞 Llamada",       items: [], filtro: function(c) { return norm(c.contacto) === "llamada"  && norm(c.casadepaz) !== "sí" && norm(c.casadepaz) !== "si" && norm(c.quierevisita) !== "sí" && norm(c.quierevisita) !== "si"; } },
      };

      contactos.forEach(function(c) {
        Object.keys(secciones).forEach(function(key) {
          if (secciones[key].filtro(c)) secciones[key].items.push(c);
        });
      });

      var body = document.getElementById("seguimiento-body");
      body.innerHTML = "";

      Object.keys(secciones).forEach(function(key) {
        var sec = secciones[key];
        if (sec.items.length === 0) return;

        var secDiv = document.createElement("div");
        secDiv.className = "seg-seccion";

        var titulo = document.createElement("p");
        titulo.className = "seg-seccion-titulo";
        titulo.textContent = sec.label + " (" + sec.items.length + ")";
        secDiv.appendChild(titulo);

        sec.items.forEach(function(c, idx) {
          var nombre   = (c.nombre   || "").trim();
          var apellido = (c.apellido || "").trim();
          var phone = (c.celular || "").trim();
          var address = (c.direccion || "").trim();
          var fullname = [nombre, apellido].filter(Boolean).join(" ") || "Sin nombre";
          var initials = ((nombre[0] || "") + (apellido[0] || "")).toUpperCase() || "?";
          var id       = c.id || idx;

          var item = document.createElement("div");
          item.className = "contact-item";
          item.style.animationDelay = (idx * 0.04) + "s";
          item.innerHTML =
            '<div class="contact-avatar">' + initials + '</div>' +
            '<div class="contact-info">' +
              '<p class="contact-fullname">' + escHtml(fullname) + '</p>' +
              
              '<p class="contact-meta">📞' + escHtml(phone) + '</p>' +   
              '<p class="contact-meta">🏠' + escHtml(address) + '</p>' +   
            '</div>' +
            '<button class="oracion-btn" title="Registrar acción" data-action="registrarSeg" data-id="' + id + '" data-nombre="' + escHtml(fullname) + '" data-seccion="' + key + '">✏️</button>';

          secDiv.appendChild(item);
        });

        body.appendChild(secDiv);
      });

      body.style.display = "block";
    })
    .catch(function(err) {
      document.getElementById("seguimiento-loading").style.display = "none";
      document.getElementById("seguimiento-error").style.display   = "flex";
      document.getElementById("seguimiento-error-msg").textContent = "Error: " + err.message;
    });
}

function norm(val) {
  return (val || "").toString().trim().toLowerCase();
}

/*---------------------------------------------------------------------*/
/* === DELEGACIÓN SEGUIMIENTO === */

document.getElementById("seguimiento-body").addEventListener("click", function(e) {
  var btn = e.target.closest("[data-action='registrarSeg']");
  if (!btn) return;
  abrirModalSeguimiento(btn.dataset.id, btn.dataset.nombre, btn.dataset.seccion);
});

/*---------------------------------------------------------------------*/
/* === MODAL ACCIÓN SEGUIMIENTO === */

var segContactoId   = null;
var segContactoNombre = null;

function abrirModalSeguimiento(id, nombre, seccion) {
  segContactoId     = id;
  segContactoNombre = nombre;

  document.getElementById("seg-nombre-target").textContent = nombre || "Contacto";

  // Preseleccionar el tipo según la sección
  var map = { casadepaz: "⛪ Casa de paz", visita: "🏠 Visita", whatsapp: "💬 WhatsApp", llamada: "📞 Llamada" };
  document.querySelectorAll("#seg-medio-group .toggle-btn").forEach(function(b) {
    b.classList.remove("active");
    if (b.textContent.trim() === (map[seccion] || "")) b.classList.add("active");
  });
  if (!document.querySelector("#seg-medio-group .toggle-btn.active")) {
    document.querySelector("#seg-medio-group .toggle-btn").classList.add("active");
  }

  // Fecha y hora actuales como default
  var now   = new Date();
  var fecha = now.toISOString().split("T")[0];
  var hora  = now.toTimeString().slice(0, 5);
  document.getElementById("seg-fecha").value         = fecha;
  document.getElementById("seg-hora").value          = hora;
  document.getElementById("seg-observaciones").value = "";

  document.getElementById("modal-seguimiento").classList.add("open");
}

function closeSeguimiento() {
  document.getElementById("modal-seguimiento").classList.remove("open");
  segContactoId = null;
}

function handleSeguimientoOverlay(e) {
  if (e.target === document.getElementById("modal-seguimiento")) closeSeguimiento();
}

function guardarSeguimiento() {
  var medioBtn = document.querySelector("#seg-medio-group .toggle-btn.active");
  var medio    = medioBtn ? medioBtn.textContent.trim() : "";
  var fecha    = document.getElementById("seg-fecha").value;
  var hora     = document.getElementById("seg-hora").value;
  var obs      = document.getElementById("seg-observaciones").value.trim();

  if (!fecha || !hora) {
    showToast("Completá la fecha y hora.");
    return;
  }

  var btn = document.getElementById("seg-submit-btn");
  btn.textContent = "Guardando...";
  btn.disabled    = true;

  var user    = getUser();
  var formData = new FormData();
  formData.append("dni_usuario",    user?.dni || "");
  formData.append("id_contacto",    segContactoId);
  formData.append("medio",          medio);
  formData.append("fecha",          fecha);
  formData.append("hora",           hora);
  formData.append("observaciones",  obs);

  fetch(BASE_URL + "/guardarseguimiento.php", {
    method: "POST",
    body:   formData
  })
  .then(function(r) { return r.json(); })
  .then(function(result) {
    if (result.success) {
      closeSeguimiento();
      showToast("✅ Acción registrada", true);
    } else {
      showToast("⚠️ " + result.message);
    }
  })
  .catch(function() {
    showToast("❌ Error de conexión");
  })
  .finally(function() {
    btn.textContent = "Guardar ✏️";
    btn.disabled    = false;
  });
}


/*---------------------------------------------------------------------*/
/* === MODAL ÚLTIMAS ACTIVIDADES === */

function showUltimasActividades() {
  document.getElementById("modal-actividades").classList.add("open");
  document.getElementById("actividades-subtitle").textContent = "Cargando...";
  document.getElementById("actividades-body").innerHTML =
    '<div class="contactos-loading"><div class="loading-spinner"></div><p>Cargando actividades...</p></div>';

  var user = getUser();
  var dni  = user?.dni || "";

  fetch(BASE_URL + "/getactividades.php?dni=" + encodeURIComponent(dni))
    .then(function(res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function(data) {
      if (!data.success) throw new Error(data.message || "Sin datos");

      var lista = data.data || [];

      document.getElementById("actividades-subtitle").textContent =
        lista.length + " actividad" + (lista.length !== 1 ? "es" : "");

      if (lista.length === 0) {
        document.getElementById("actividades-body").innerHTML =
          '<div class="contactos-empty">' +
            '<p>Sin actividades</p>' +
            '<span>Todavía no registraste ninguna acción.</span>' +
          '</div>';
        return;
      }

      var medioIconos = {
        "Llamada":     "📞",
        "WhatsApp":    "💬",
        "Visita":      "🏠",
        "Casa de paz": "⛪"
      };

      var body = document.getElementById("actividades-body");
      body.innerHTML = "";

      var section = document.createElement("div");
      section.className = "detalle-section";

      lista.forEach(function(a) {
        var icono   = medioIconos[a.medio] || "📋";
        var fecha   = a.fecha  || "—";
        var hora    = a.hora   ? a.hora.slice(0, 5) : "—";
        var nombre  = ((a.nombre || "") + " " + (a.apellido || "")).trim() || "Contacto";
        var obs     = a.observaciones || "";

        var row = document.createElement("div");
        row.className = "detalle-row";
        row.style.cssText = "align-items:center;gap:12px;cursor:pointer;";
        row.innerHTML =
          '<span style="font-size:22px;flex-shrink:0;">' + icono + '</span>' +
          '<div style="flex:1;min-width:0;">' +
            '<p style="font-size:13px;font-weight:700;color:var(--text);">' + escHtml(a.medio) + '</p>' +
            '<p style="font-size:12px;color:var(--text-muted);margin-top:2px;">' + escHtml(nombre) + '</p>' +
            '<p style="font-size:11px;color:var(--text-muted);margin-top:1px;">' + fecha + ' · ' + hora + '</p>' +
          '</div>' +
          '<button class="oracion-btn" style="flex-shrink:0;" ' +
            'data-medio="'    + escHtml(a.medio)  + '" ' +
            'data-nombre="'   + escHtml(nombre)   + '" ' +
            'data-fecha="'    + escHtml(fecha)     + '" ' +
            'data-hora="'     + escHtml(hora)      + '" ' +
            'data-obs="'      + escHtml(obs)       + '" ' +
            'data-icono="'    + icono              + '" ' +
            'data-action="verDetalleActividad">🔍</button>';

        section.appendChild(row);
      });

      body.appendChild(section);
    })
    .catch(function(err) {
      document.getElementById("actividades-body").innerHTML =
        '<div class="contactos-empty">' +
          '<p style="color:var(--rose)">Error al cargar</p>' +
          '<span>' + err.message + '</span>' +
        '</div>';
    });
}

function closeActividades() {
  document.getElementById("modal-actividades").classList.remove("open");
}

function handleActividadesOverlay(e) {
  if (e.target === document.getElementById("modal-actividades")) closeActividades();
}

/*---------------------------------------------------------------------*/
/* === DELEGACIÓN ACTIVIDADES === */

document.getElementById("actividades-body").addEventListener("click", function(e) {
  var btn = e.target.closest("[data-action='verDetalleActividad']");
  if (!btn) return;
  abrirDetalleActividad(
    btn.dataset.medio,
    btn.dataset.nombre,
    btn.dataset.fecha,
    btn.dataset.hora,
    btn.dataset.obs,
    btn.dataset.icono
  );
});

/*---------------------------------------------------------------------*/
/* === MODAL DETALLE ACTIVIDAD === */

function abrirDetalleActividad(medio, nombre, fecha, hora, obs, icono) {
  var medioIconos = {
    "Llamada":     "📞",
    "WhatsApp":    "💬",
    "Visita":      "🏠",
    "Casa de paz": "⛪"
  };

  document.getElementById("act-icono").textContent    = medioIconos[medio] || "📋";
  document.getElementById("act-medio").textContent    = medio   || "Actividad";
  document.getElementById("act-contacto").textContent = nombre  || "Contacto";
  document.getElementById("act-medio-val").textContent  = medio  || "—";
  document.getElementById("act-nombre-val").textContent = nombre || "—";
  document.getElementById("act-fecha-val").textContent  = fecha  || "—";
  document.getElementById("act-hora-val").textContent   = hora   || "—";
  document.getElementById("act-obs-val").textContent    = obs    || "Sin observaciones";

  document.getElementById("modal-detalle-actividad").classList.add("open");
}

function closeDetalleActividad() {
  document.getElementById("modal-detalle-actividad").classList.remove("open");
}

function handleDetalleActividadOverlay(e) {
  if (e.target === document.getElementById("modal-detalle-actividad")) closeDetalleActividad();
}
