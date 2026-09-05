// ========================================
// BOA FX — ADMIN PANEL LOGIC
// ========================================

// ---- CHECK AUTH ----
function checkAuth() {
  const token = localStorage.getItem('boafx_admin_token');
  const user = localStorage.getItem('boafx_admin_user');
  
  if (!token || !user) {
    window.location.href = 'admin-login.html';
    return false;
  }
  
  document.getElementById('adminUserName').textContent = user;
  return true;
}

// ---- LOGOUT ----
function logout() {
  if (confirm('¿Estás seguro de que quieres salir?')) {
    localStorage.removeItem('boafx_admin_token');
    localStorage.removeItem('boafx_admin_user');
    window.location.href = 'admin-login.html';
  }
}

// ---- SWITCH SECTION ----
function switchSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.admin-section').forEach(el => {
    el.classList.remove('active');
  });
  
  // Remove active from nav
  document.querySelectorAll('.admin-nav-link').forEach(el => {
    el.classList.remove('active');
  });
  
  // Show selected section
  document.getElementById(sectionId).classList.add('active');
  
  // Mark nav active
  event.target.closest('.admin-nav-link').classList.add('active');
  
  // Load data if needed
  if (sectionId === 'cursos') {
    renderCursos();
  } else if (sectionId === 'preguntas') {
    renderPreguntas();
  } else if (sectionId === 'productos') {
    cargarProductosAdmin();
  }
}

// ========================================
// CURSOS
// ========================================

function loadCursos() {
  return JSON.parse(localStorage.getItem('boafx_cursos') || '[]');
}

function saveCursos(cursos) {
  localStorage.setItem('boafx_cursos', JSON.stringify(cursos));
  updateStats();
}

function addCurso(nombre, desc, precio, cat) {
  const cursos = loadCursos();
  const id = 'curso_' + Date.now();
  
  cursos.push({
    id,
    nombre,
    desc,
    precio: parseInt(precio),
    cat,
    modulos: [],
    createdAt: new Date().toLocaleString('es-MX')
  });
  
  saveCursos(cursos);
  return id;
}

function deleteCurso(id) {
  if (confirm('¿Estás seguro de que quieres eliminar este curso?')) {
    let cursos = loadCursos();
    cursos = cursos.filter(c => c.id !== id);
    saveCursos(cursos);
    renderCursos();
    showAlert('cursosAlert', 'Curso eliminado', 'success');
  }
}

function renderCursos() {
  const cursos = loadCursos();
  const list = document.getElementById('cursosList');
  
  if (cursos.length === 0) {
    list.innerHTML = '<li class="admin-list-item" style="color: var(--ghost);">Sin cursos aún. Crea uno para comenzar.</li>';
    return;
  }
  
  list.innerHTML = cursos.map(c => `
    <li class="admin-list-item">
      <div>
        <div class="admin-list-item-title">${c.nombre}</div>
        <div class="admin-list-item-meta">
          $${c.precio} MXN · ${c.cat} · ${c.modulos.length} módulos · ${c.createdAt}
        </div>
      </div>
      <div class="admin-list-item-actions">
        <button class="admin-btn admin-btn-sm" onclick="editarCurso('${c.id}')">Editar</button>
        <button class="admin-btn admin-btn-sm admin-btn-danger" onclick="deleteCurso('${c.id}')">Eliminar</button>
      </div>
    </li>
  `).join('');
}

function editarCurso(id) {
  const cursos = loadCursos();
  const curso = cursos.find(c => c.id === id);
  
  if (!curso) return;
  
  // Aquí iría la lógica para editar módulos y videos
  alert('Editar módulos para: ' + curso.nombre + '\n\n(Próximamente: interfaz de carga de videos)');
}

// ---- FORM HANDLER ----
document.addEventListener('DOMContentLoaded', () => {
  // Check auth
  if (!checkAuth()) return;
  
  // Curso form
  const cursoForm = document.getElementById('cursoForm');
  if (cursoForm) {
    cursoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nombre = document.getElementById('cursoNombre').value.trim();
      const desc = document.getElementById('cursoDesc').value.trim();
      const precio = document.getElementById('cursoPrecio').value;
      const cat = document.getElementById('cursoCat').value;
      
      if (!nombre || !desc || !precio || !cat) {
        showAlert('cursosAlert', 'Completa todos los campos', 'error');
        return;
      }
      
      addCurso(nombre, desc, precio, cat);
      
      // Clear form
      cursoForm.reset();
      renderCursos();
      showAlert('cursosAlert', 'Curso creado exitosamente ✓', 'success');
    });
  }
  
  // Load initial data
  renderCursos();
  renderPreguntas();
  updateStats();
});

// ========================================
// PREGUNTAS
// ========================================

function loadPreguntas() {
  return JSON.parse(localStorage.getItem('boafx_preguntas') || '[]');
}

function savePreguntas(preguntas) {
  localStorage.setItem('boafx_preguntas', JSON.stringify(preguntas));
  updateStats();
}

function renderPreguntas() {
  const preguntas = loadPreguntas();
  const list = document.getElementById('preguntasList');
  
  if (preguntas.length === 0) {
    list.innerHTML = '<li class="admin-list-item" style="color: var(--ghost);">No hay preguntas aún.</li>';
    return;
  }
  
  list.innerHTML = preguntas.map(p => `
    <li class="admin-list-item">
      <div>
        <div class="admin-list-item-title">${p.pregunta}</div>
        <div class="admin-list-item-meta">
          De: ${p.email || 'Anónimo'} · ${p.curso} · ${p.fecha}
        </div>
      </div>
      <div class="admin-list-item-actions">
        <button class="admin-btn admin-btn-sm" onclick="responderPregunta('${p.id}')">Responder</button>
      </div>
    </li>
  `).join('');
}

function responderPregunta(id) {
  const preguntas = loadPreguntas();
  const pregunta = preguntas.find(p => p.id === id);
  
  if (!pregunta) return;
  
  const respuesta = prompt('Escribe tu respuesta:', pregunta.respuesta || '');
  
  if (respuesta !== null) {
    pregunta.respuesta = respuesta;
    pregunta.respondida = true;
    pregunta.respondidoEn = new Date().toLocaleString('es-MX');
    savePreguntas(preguntas);
    renderPreguntas();
    showAlert('preguntasAlert', 'Respuesta guardada ✓', 'success');
  }
}

// ========================================
// STATS
// ========================================

function updateStats() {
  const cursos = loadCursos();
  const preguntas = loadPreguntas();
  
  // Count total videos
  let totalVideos = 0;
  cursos.forEach(c => {
    c.modulos.forEach(m => {
      totalVideos += (m.videos || []).length;
    });
  });
  
  document.getElementById('statsC').textContent = cursos.length;
  document.getElementById('statsV').textContent = totalVideos;
  document.getElementById('statsQ').textContent = preguntas.length;
}

// ========================================
// ALERTS
// ========================================

function showAlert(elementId, msg, type = 'error') {
  const el = document.getElementById(elementId);
  if (!el) return;
  
  el.textContent = msg;
  el.classList.add('show');
  
  if (type === 'success') {
    el.classList.add('admin-success');
  } else {
    el.classList.remove('admin-success');
  }
  
  setTimeout(() => {
    el.classList.remove('show');
  }, 3500);
}

// ========================================
// EXPORT DATA (para backup)
// ========================================

function exportData() {
  const data = {
    cursos: loadCursos(),
    preguntas: loadPreguntas(),
    exportedAt: new Date().toLocaleString('es-MX')
  };
  
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `boafx-backup-${Date.now()}.json`;
  a.click();
}

console.log('✓ Admin panel loaded');

// ========================================
// PRODUCTOS — FIRESTORE CRUD
// ========================================

let PRODUCTOS_ADMIN = [];

async function cargarProductosAdmin() {
  try {
    const snap = await db.collection('productos').orderBy('cat').get();
    PRODUCTOS_ADMIN = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderProductosAdmin();
    updateStats();
  } catch(e) {
    showAlert('productosAlert', 'Error al cargar productos: ' + e.message);
  }
}

function renderProductosAdmin() {
  const list = document.getElementById('productosAdminList');
  const count = document.getElementById('prodCount');
  const q = (document.getElementById('prodSearch')?.value || '').toLowerCase();
  const cat = document.getElementById('prodCatFilter')?.value || '';

  let filtered = PRODUCTOS_ADMIN.filter(p => {
    const matchQ = !q || p.name.toLowerCase().includes(q);
    const matchCat = !cat || p.cat === cat;
    return matchQ && matchCat;
  });

  count.textContent = `${filtered.length} PRODUCTO${filtered.length !== 1 ? 'S' : ''}`;

  if (filtered.length === 0) {
    list.innerHTML = '<li class="admin-list-item" style="color:var(--ghost);">Sin resultados.</li>';
    return;
  }

  list.innerHTML = filtered.map(p => `
    <li class="admin-list-item">
      <div style="display:flex;align-items:center;gap:12px;flex:1;min-width:0;">
        ${p.image ? `<img src="${p.image}" style="width:40px;height:40px;object-fit:cover;border-radius:2px;flex-shrink:0;">` : `<span style="font-size:22px;flex-shrink:0;">${p.icon || '📦'}</span>`}
        <div style="min-width:0;">
          <div class="admin-list-item-title" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.name}</div>
          <div class="admin-list-item-meta">${p.cat} · ${p.cotiza ? 'Cotización' : '$' + (p.price || 0) + ' MXN'}</div>
        </div>
      </div>
      <div class="admin-list-item-actions" style="flex-shrink:0;">
        <button class="admin-btn admin-btn-sm admin-btn-secondary" onclick="editarProducto('${p.id}')">Editar</button>
        <button class="admin-btn admin-btn-sm admin-btn-danger" onclick="eliminarProducto('${p.id}', '${p.name.replace(/'/g,"\\'")}')">Eliminar</button>
      </div>
    </li>
  `).join('');
}

function mostrarFormProducto(prod = null) {
  document.getElementById('prodFormCard').style.display = 'block';
  document.getElementById('prodFormTitle').textContent = prod ? 'Editar Producto' : 'Nuevo Producto';
  document.getElementById('prodId').value = prod?.id || '';
  document.getElementById('prodNombre').value = prod?.name || '';
  document.getElementById('prodPrecio').value = prod?.price || '';
  document.getElementById('prodCat').value = prod?.cat || 'Prostéticos';
  document.getElementById('prodIcon').value = prod?.icon || '';
  document.getElementById('prodImage').value = prod?.image || '';
  document.getElementById('prodCotiza').value = prod?.cotiza ? 'true' : 'false';
  document.getElementById('prodNombre').focus();
  document.getElementById('prodFormCard').scrollIntoView({ behavior: 'smooth' });
}

function cancelarFormProducto() {
  document.getElementById('prodFormCard').style.display = 'none';
  document.getElementById('prodForm').reset();
}

function editarProducto(id) {
  const prod = PRODUCTOS_ADMIN.find(p => p.id === id);
  if (prod) mostrarFormProducto(prod);
}

async function eliminarProducto(id, nombre) {
  if (!confirm(`¿Eliminar "${nombre}"?`)) return;
  try {
    await db.collection('productos').doc(id).delete();
    showAlert('productosAlert', `"${nombre}" eliminado ✓`, 'success');
    cargarProductosAdmin();
  } catch(e) {
    showAlert('productosAlert', 'Error al eliminar: ' + e.message);
  }
}

// Datos base para importar (primera vez)
const PRODUCTOS_BASE = [
  { name:'OJO', cat:'Prostéticos', price:220, icon:'👁️', image:'imagenes/ojo.PNG' },
  { name:'PÓMULOS OPERADOS', cat:'Prostéticos', price:450, icon:'🎭' },
  { name:'NARIZ GRINCH', cat:'Prostéticos', price:600, icon:'🎭', image:'imagenes/nariz-grinch.png', imageHover:'imagenes/nariz-grinch-resultado.jpeg' },
  { name:'NARIZ QUIEN', cat:'Prostéticos', price:430, icon:'🎭', image:'imagenes/nariz-quien.png' },
  { name:'ESTRELLA DE MAR', cat:'Prostéticos', price:299, icon:'⭐', image:'imagenes/estrella-de-mar.png', imageHover:'imagenes/estrella-de-mar-resultado.PNG' },
  { name:'RASGUÑO / ARAÑAZO', cat:'Prostéticos', price:350, icon:'🩹', image:'imagenes/rasguño-arañazo.png', imageHover:'imagenes/resultado-arañazo-sarpazo.jpeg' },
  { name:'NARIZ AVATAR', cat:'Prostéticos', price:650, icon:'🎭', image:'imagenes/nariz-avatar.png' },
  { name:'ESTRELLA DIABÓLICA', cat:'Prostéticos', price:250, icon:'⭐', image:'imagenes/estrella-diabolica.png' },
  { name:'GOLPE PÁRPADO', cat:'Prostéticos', price:200, icon:'🩹', image:'imagenes/golpe-parpado.png' },
  { name:'FRENTE GRINCH', cat:'Prostéticos', price:450, icon:'🎭', image:'imagenes/frente-grinch.png' },
  { name:'LUNA 3D', cat:'Prostéticos', price:120, icon:'🌙', image:'imagenes/luna.png' },
  { name:'NARIZ ELFO RINOPLASTIA', cat:'Prostéticos', price:270, icon:'🧝', image:'imagenes/nariz-elfo.png' },
  { name:'CORTADA CUELLO', cat:'Prostéticos', price:399, icon:'🩹', image:'imagenes/cortada-cuello.png' },
  { name:'TRIPOFOBIA', cat:'Prostéticos', price:250, icon:'🎭', image:'imagenes/tripofobia.png', imageHover:'imagenes/tripofobia-resultado.JPEG' },
  { name:'FRENTE VAMPIRO', cat:'Prostéticos', price:450, icon:'🧛', image:'imagenes/frente-demonio.png' },
  { name:'NARIZ TERRIFIER BRUJA', cat:'Prostéticos', price:400, icon:'🎭', image:'imagenes/nariz-bruja-terrifier.png', imageHover:'imagenes/resultado-nariz-terrifier-bruja.jpeg' },
  { name:'BRANQUIAS (2 PZ)', cat:'Prostéticos', price:440, icon:'🐟', image:'imagenes/branquias.png', imageHover:'imagenes/branqueas-resultado.PNG' },
  { name:'ESFINGE', cat:'Prostéticos', price:170, icon:'🎭', image:'imagenes/esfinge-escarificacion.png', imageHover:'imagenes/resultado-esfinge.PNG' },
  { name:'CUERNOS (2 PZ)', cat:'Prostéticos', price:499, icon:'😈', image:'imagenes/cuernos.png', imageHover:'imagenes/cuernos-resultado.PNG' },
  { name:'NARIZ CERDO', cat:'Prostéticos', price:499, icon:'🐽', image:'imagenes/nariz-cerdo.png' },
  { name:'ANTIFAZ ZOMBIE', cat:'Prostéticos', price:590, icon:'🧟', image:'imagenes/antifaz-zombie.png' },
  { name:'BOCA ZOMBIE', cat:'Prostéticos', price:400, icon:'🧟', image:'imagenes/boca-zombie.png' },
  { name:'CUERNOS DOBLES (2 PZ)', cat:'Prostéticos', price:290, icon:'😈', image:'imagenes/cuernitos-dobles-colmillos.png' },
  { name:'HÍBRIDO HUMANO', cat:'Prostéticos', price:3000, icon:'🎭', image:'imagenes/hibrido-humano.png', imageHover:'imagenes/hibrido-humano-resultado.png' },
  { name:'HERIDA DE BALA', cat:'Prostéticos', price:299, icon:'🩹', image:'imagenes/herida-bala.png', imgFit:'contain' },
  { name:'HERIDA CHICA (Y)', cat:'Prostéticos', price:135, icon:'🩹', image:'imagenes/herida-chica.png' },
  { name:'HERIDA MEDIANA', cat:'Prostéticos', price:180, icon:'🩹', image:'imagenes/herida-md-cortada.png' },
  { name:'SUTURA INFLAMADA', cat:'Prostéticos', price:210, icon:'🩹', image:'imagenes/sutura-inflamada.png', imgFit:'contain' },
  { name:'SANGRE FALSA 250 ML', cat:'Complementos', price:275, icon:'🩸', image:'imagenes/sangre-falsa-250-ml.png' },
  { name:'SANGRE FALSA 30 ML', cat:'Complementos', price:45, icon:'🩸', image:'imagenes/sangre-falsa-30-ml.png' },
  { name:'SANGRE COAGULADA 50 ML', cat:'Complementos', price:140, icon:'🩸', image:'imagenes/sangre-coagulada-50ml.png' },
  { name:'SANGRE COAGULADA 30 ML', cat:'Complementos', price:60, icon:'🩸', image:'imagenes/sangre-coagulada-30ml.png' },
  { name:'SANGRE COMESTIBLE 15 ML', cat:'Complementos', price:95, icon:'🩸', image:'imagenes/sangre-comestible-15ml.png' },
  { name:'SANGRE COMESTIBLE 30 ML', cat:'Complementos', price:180, icon:'🩸', image:'imagenes/sangre.comestible-30ml.png' },
  { name:'CALVA LÁTEX', cat:'Complementos', price:250, icon:'💀', image:'imagenes/calva-latex.png', imageHover:'imagenes/resultado-calva-de-latex.jpeg' },
  { name:'DENTADURA KILLER CLOWN', cat:'Complementos', price:250, icon:'🦷', image:'imagenes/dentadura-killer.png' },
  { name:'PESTAÑAS EMPLUMADAS', cat:'Complementos', price:100, icon:'✨', image:'imagenes/pestaña-emplumada.png' },
  { name:'PROSAIDE 15 ML', cat:'Materiales', price:130, icon:'🧪', image:'imagenes/prosaide-15-ml.png' },
  { name:'PROSAIDE 30 ML', cat:'Materiales', price:260, icon:'🧪', image:'imagenes/prosaide-30-ml.png' },
  { name:'PROSAIDE 250 ML', cat:'Materiales', price:1050, icon:'🧪', image:'imagenes/prosaide-250.png' },
  { name:'PROSAIDE 500 ML', cat:'Materiales', price:1800, icon:'🧪', image:'imagenes/prosaide-500-ml.png' },
  { name:'PROSAIDE 1 LT', cat:'Materiales', price:3300, icon:'🧪', image:'imagenes/prosaide-1-litro.png' },
  { name:'BONDO 15 G', cat:'Materiales', price:150, icon:'🔬', image:'imagenes/bondo-15-ml.png' },
  { name:'BONDO 30 G', cat:'Materiales', price:280, icon:'🔬', image:'imagenes/bondo-30-ml.png' },
  { name:'BONDO 50 G', cat:'Materiales', price:350, icon:'🔬', image:'imagenes/bondo-50-ml.png' },
  { name:'BLENDER 15 ML', cat:'Materiales', price:50, icon:'💧', image:'imagenes/blender-15-ml.png', imgFit:'contain' },
  { name:'BLENDER 50 ML', cat:'Materiales', price:100, icon:'💧', image:'imagenes/blender-30-ml.png', imgFit:'contain' },
  { name:'REMOVEDOR 15 ML', cat:'Materiales', price:160, icon:'🧴', image:'imagenes/removedor-15-ml.png' },
  { name:'REMOVEDOR 50 ML', cat:'Materiales', price:220, icon:'🧴', image:'imagenes/removedor-50-ml.png' },
  { name:'LÁTEX NATURAL 1 LT', cat:'Materiales', price:290, icon:'💧', image:'imagenes/latex-1-litro.png' },
  { name:'LÁTEX NATURAL 500 ML', cat:'Materiales', price:150, icon:'💧', image:'imagenes/latex-500-ml.png' },
  { name:'VENDAS DE YESO GYPSONA', cat:'Materiales', price:95, icon:'🩹', image:'imagenes/vendas-gypsona.png' },
  { name:'ALCOHOL ISOPROPÍLICO 1 LT', cat:'Materiales', price:150, icon:'🧴', image:'imagenes/alcohol-isopropilico-1-litro.png', imgFit:'contain' },
  { name:'ALCOHOL ISOPROPÍLICO 500 ML', cat:'Materiales', price:80, icon:'🧴', image:'imagenes/alcohol-isopropilico-500-ml.png', imgFit:'contain' },
  { name:'ULTRACAL BULTO', cat:'Materiales', price:1350, icon:'🏺', image:'imagenes/ultracal-bulto.png' },
  { name:'ULTRACAL 1 KG', cat:'Materiales', price:80, icon:'🏺', image:'imagenes/ultracal-1-kg.png' },
  { name:'PLASTILINA ISEMARF', cat:'Materiales', price:110, icon:'🎨', image:'imagenes/platilina-escultor-isemarf.png' },
  { name:'ESPONJA TEXTURA', cat:'Materiales', price:30, icon:'🧽', image:'imagenes/esponja-textura.png' },
  { name:'ALGINATO', cat:'Materiales', price:265, icon:'🔬', image:'imagenes/alginato.png' },
  { name:'TEXTURIZADORES 5 PZ', cat:'Materiales', price:450, icon:'🖌️', image:'imagenes/texturizadores.png' },
  { name:'CEPILLO DESECHABLE 50 PZ', cat:'Materiales', price:45, icon:'🖌️', image:'imagenes/cepillos-desechables.png' },
  { name:'MINI COTONETES', cat:'Materiales', price:50, icon:'🪄', image:'imagenes/mini-cotonetes.png' },
  { name:'GUANTES DE NITRILO', cat:'Materiales', price:150, icon:'🧤', image:'imagenes/guantes-nitrilo.png' },
  { name:'GELATINA FX 30 G', cat:'Materiales', price:40, icon:'🔬', image:'imagenes/gelatina-fax.png' },
  { name:'PLASTILINA EPÓXICA', cat:'Materiales', price:220, icon:'🎨', image:'imagenes/platilina-epoxica.png' },
  { name:'CABOSIL 250 G', cat:'Materiales', price:250, icon:'🔬', image:'imagenes/cabosil.png' },
  { name:'CABOSIL BOTESITO', cat:'Materiales', price:50, icon:'🔬', image:'imagenes/cabosil-botesito.png' },
  { name:'BALDIEZ 4 OZ', cat:'Materiales', price:1050, icon:'🧪', image:'imagenes/baldiez-4-oz.png' },
  { name:'BALDIEZ 16 OZ', cat:'Materiales', price:2600, icon:'🧪', image:'imagenes/baldiez-6-oz.png' },
  { name:'GLATZAN 1 LT', cat:'Materiales', price:2700, icon:'🧪', image:'imagenes/glatzan-1-lt.png' },
  { name:'GLATZAN 500 ML', cat:'Materiales', price:1600, icon:'🧪', image:'imagenes/glatzan-500-ml.png' },
  { name:'PLATSIL GEL 10 — 2 KG', cat:'Materiales', price:3380, icon:'🧪', image:'imagenes/platsil.png' },
  { name:'DEADENER 1 KG', cat:'Materiales', price:2700, icon:'🧪', image:'imagenes/deadener.png' },
  { name:'DRAGON SKIN KIT 10 (SLOW/M/V/F)', cat:'Materiales', price:990, icon:'🦎', image:'imagenes/dragon-skin-kit.png' },
  { name:'DRAGON SKIN GALÓN 10 SLOW', cat:'Materiales', price:5700, icon:'🦎', image:'imagenes/dragon-skin-10-slow.png' },
  { name:'DRAGON SKIN GALÓN 10 MEDIUM', cat:'Materiales', price:5900, icon:'🦎', image:'imagenes/dragon-skin-galon-10-medium.png' },
  { name:'DRAGON SKIN GALÓN 10 FAST', cat:'Materiales', price:5700, icon:'🦎', image:'imagenes/dragon-skin-10-galon.png' },
  { name:'DRAGON SKIN GALÓN 10 VERY FAST', cat:'Materiales', price:5900, icon:'🦎', image:'imagenes/dragon-skin-very-fast.png' },
  { name:'PTM', cat:'Materiales', price:1850, icon:'🧪', image:'imagenes/ptm.png' },
  { name:'PTP', cat:'Materiales', price:1790, icon:'🧪', image:'imagenes/ptp.png' },
  { name:'FOAM LÁTEX 1 GALÓN MONSTER MAKER', cat:'Materiales', price:6100, icon:'🧪', image:'imagenes/kit-foam-latex.png' },
  { name:'TATUAJES TEMPORALES GLITTER', cat:'Materiales', price:45, icon:'✨', image:'imagenes/tatuaje-temporal-glitter.png' },
  { name:'PUPILENTES ROJOS', cat:'Materiales', price:170, icon:'👁️', image:'imagenes/pupilentes-rojos.png' },
  { name:'PUPILENTES DEMONIO', cat:'Materiales', price:200, icon:'👁️', image:'imagenes/pupilentes-demonio.png' },
  { name:'PUPILENTES BLANCOS REJILLA', cat:'Materiales', price:170, icon:'👁️', image:'imagenes/pupilentes-blancos-rejilla.png' },
  { name:'COLMILLOS POSTIZOS', cat:'Materiales', price:85, icon:'🦷', image:'imagenes/colmillos-par.png' },
  { name:'MÁSCARA FACIAL CYBERPUNK', cat:'Materiales', price:200, icon:'🎭', image:'imagenes/mascara-cyberpunk.png' },
  { name:'PUPILENTES ROSAS MUÑECA', cat:'Materiales', price:175, icon:'👁️', image:'imagenes/pupilentes-rosas.png' },
  { name:'SERVICIO DE MAQUILLAJE SESIÓN', cat:'Servicios', price:350, icon:'💄', image:'imagenes/servicio-maquillaje-sesion.png' },
  { name:'CARACTERIZACIÓN', cat:'Servicios', price:0, cotiza:true, icon:'💄', image:'imagenes/caracterizacion.png' },
  { name:'FACE CAST', cat:'Servicios', price:0, cotiza:true, icon:'🏺', image:'imagenes/servicio-face-cast.png' },
  { name:'PROSTÉTICO PERSONALIZADO', cat:'Servicios', price:0, cotiza:true, icon:'🎭', image:'imagenes/prostetico-personalizado.png' },
  { name:'PROP / COMPLEMENTO PARA PRODUCCIÓN O COSPLAY', cat:'Servicios', price:0, cotiza:true, icon:'🎬', image:'imagenes/prop-complemento-para-produccion.png' },
];

async function importarProductosBase() {
  if (!confirm(`¿Importar ${PRODUCTOS_BASE.length} productos a Firestore? Esto no borra los existentes.`)) return;
  const btn = document.getElementById('importBtn');
  btn.disabled = true;
  btn.textContent = 'Importando...';
  try {
    const batch = db.batch();
    PRODUCTOS_BASE.forEach(p => {
      const ref = db.collection('productos').doc();
      const data = {};
      Object.keys(p).forEach(k => { if (p[k] !== undefined) data[k] = p[k]; });
      batch.set(ref, data);
    });
    await batch.commit();
    showAlert('productosAlert', `${PRODUCTOS_BASE.length} productos importados ✓`, 'success');
    cargarProductosAdmin();
  } catch(e) {
    showAlert('productosAlert', 'Error al importar: ' + e.message);
  } finally {
    btn.disabled = false;
    btn.textContent = '↓ Importar base';
  }
}

// Guardar producto (crear o actualizar)
document.addEventListener('DOMContentLoaded', () => {
  const prodForm = document.getElementById('prodForm');
  if (prodForm) {
    prodForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('prodId').value;
      const data = {
        name: document.getElementById('prodNombre').value.trim().toUpperCase(),
        price: parseInt(document.getElementById('prodPrecio').value) || 0,
        cat: document.getElementById('prodCat').value,
        icon: document.getElementById('prodIcon').value.trim() || '📦',
        image: document.getElementById('prodImage').value.trim(),
        cotiza: document.getElementById('prodCotiza').value === 'true',
      };
      if (!data.image) delete data.image;
      if (!data.cotiza) delete data.cotiza;

      try {
        if (id) {
          await db.collection('productos').doc(id).update(data);
          showAlert('productosAlert', `"${data.name}" actualizado ✓`, 'success');
        } else {
          await db.collection('productos').add(data);
          showAlert('productosAlert', `"${data.name}" agregado ✓`, 'success');
        }
        cancelarFormProducto();
        cargarProductosAdmin();
      } catch(err) {
        showAlert('productosAlert', 'Error al guardar: ' + err.message);
      }
    });
  }
});
