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
