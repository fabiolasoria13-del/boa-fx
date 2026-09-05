// ========================================
// BOA FX — AUTH SYSTEM
// ========================================

// ---- ADMIN CREDENTIALS ----
const ADMIN_USER = 'adminboa';
const ADMIN_PASS = 'Limited2000!';

// ---- CHECK AUTH ON LOAD ----
function initAuth() {
  const userToken = localStorage.getItem('boafx_user_token');
  const userEmail = localStorage.getItem('boafx_user_email');
  const userRole = localStorage.getItem('boafx_user_role');
  
  if (userToken && userEmail && userRole) {
    updateNavAfterLogin(userEmail, userRole);
  }
}

// ---- OPEN LOGIN MODAL ----
function openLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

// ---- CLOSE LOGIN MODAL ----
function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    document.getElementById('loginForm').reset();
    document.getElementById('loginError').classList.remove('show');
  }
}

// ---- HANDLE LOGIN ----
function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const loginType = document.getElementById('loginType').value;
  const errorEl = document.getElementById('loginError');
  const submitBtn = document.getElementById('loginSubmitBtn');
  
  errorEl.classList.remove('show');
  
  if (!email || !password) {
    showLoginError('Completa todos los campos');
    return;
  }
  
  submitBtn.disabled = true;
  submitBtn.textContent = 'Verificando...';
  
  setTimeout(() => {
    let isValid = false;
    let role = '';
    
    if (loginType === 'admin') {
      if (email === ADMIN_USER && password === ADMIN_PASS) {
        isValid = true;
        role = 'admin';
      }
    } 
    else if (loginType === 'student') {
      if (email && password.length >= 6) {
        isValid = true;
        role = 'student';
      }
    }
    
    if (isValid) {
      const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('boafx_user_token', token);
      localStorage.setItem('boafx_user_email', email);
      localStorage.setItem('boafx_user_role', role);
      
      updateNavAfterLogin(email, role);
      closeLoginModal();
      
      showLoginToast(`¡Bienvenido ${role === 'admin' ? '(Admin)' : ''}!`);
    } else {
      showLoginError('Usuario o contraseña incorrectos');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Ingresar';
    }
  }, 600);
}

// ---- UPDATE NAV AFTER LOGIN ----
function updateNavAfterLogin(email, role) {
  const navWa = document.querySelector('.nav-wa');
  const navCart = document.querySelector('.nav-cart');
  
  if (!document.getElementById('userMenuBtn')) {
    const userBtn = document.createElement('button');
    userBtn.id = 'userMenuBtn';
    userBtn.className = 'nav-user-btn';
    userBtn.innerHTML = `👤 ${email.split('@')[0]} ▾`;
    userBtn.style.cssText = `
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--bone);
      background: none;
      border: 1px solid rgba(255,255,255,0.2);
      padding: 8px 14px;
      cursor: pointer;
      transition: all 0.2s;
      border-radius: 2px;
      font-family: var(--font-body);
    `;
    
    userBtn.addEventListener('mouseover', () => {
      userBtn.style.borderColor = 'var(--ivory)';
      userBtn.style.color = 'var(--ivory)';
    });
    
    userBtn.addEventListener('mouseout', () => {
      userBtn.style.borderColor = 'rgba(255,255,255,0.2)';
      userBtn.style.color = 'var(--bone)';
    });
    
    userBtn.addEventListener('click', openUserMenu);
    
    navWa.parentNode.insertBefore(userBtn, navWa);
  }
  
  if (role === 'admin') {
    navCart.style.display = 'none';
    navWa.style.display = 'none';
  } else {
    navCart.style.display = 'block';
    navWa.style.display = 'flex';
  }
}

// ---- USER MENU ----
function openUserMenu() {
  const menu = document.getElementById('userDropdownMenu');
  if (!menu) {
    const userBtn = document.getElementById('userMenuBtn');
    const role = localStorage.getItem('boafx_user_role');
    
    const dropdown = document.createElement('div');
    dropdown.id = 'userDropdownMenu';
    dropdown.style.cssText = `
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 8px;
      background: rgba(12,11,10,0.97);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,0.08);
      min-width: 180px;
      padding: 8px 0;
      z-index: 200;
      border-radius: 2px;
    `;
    
    const menuItems = [];
    
    if (role === 'admin') {
      menuItems.push({
        label: '📊 Panel Admin',
        action: () => window.location.href = 'admin.html'
      });
      menuItems.push({
        label: '📚 Gestionar Cursos',
        action: () => alert('Gestionar Cursos')
      });
    } else {
      menuItems.push({
        label: '📚 Mis Cursos',
        action: () => alert('Mis Cursos')
      });
    }
    
    menuItems.push({
      label: '🚪 Cerrar Sesión',
      action: () => logout(),
      isDanger: true
    });
    
    menuItems.forEach(item => {
      const link = document.createElement('a');
      link.style.cssText = `
        display: block;
        padding: 10px 20px;
        font-size: 12px;
        color: ${item.isDanger ? '#ff6b5b' : 'var(--bone)'};
        letter-spacing: 0.08em;
        transition: all 0.15s;
        cursor: pointer;
        font-family: var(--font-body);
      `;
      link.textContent = item.label;
      
      link.addEventListener('mouseover', () => {
        link.style.color = item.isDanger ? '#ff8b7b' : 'var(--ivory)';
        link.style.background = 'rgba(255,255,255,0.03)';
      });
      
      link.addEventListener('mouseout', () => {
        link.style.color = item.isDanger ? '#ff6b5b' : 'var(--bone)';
        link.style.background = 'transparent';
      });
      
      link.addEventListener('click', () => {
        item.action();
        dropdown.remove();
      });
      
      dropdown.appendChild(link);
    });
    
    userBtn.parentNode.insertBefore(dropdown, userBtn.nextSibling);
  } else {
    menu.remove();
  }
}

// ---- LOGOUT ----
function logout() {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    localStorage.removeItem('boafx_user_token');
    localStorage.removeItem('boafx_user_email');
    localStorage.removeItem('boafx_user_role');
    location.reload();
  }
}

// ---- ERROR DISPLAY ----
function showLoginError(msg) {
  const errorEl = document.getElementById('loginError');
  errorEl.textContent = msg;
  errorEl.classList.add('show');
}

// ---- TOAST NOTIFICATION ----
function showLoginToast(msg) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 90px;
    right: 28px;
    background: var(--ash);
    border: 1px solid rgba(255,255,255,0.08);
    border-left: 3px solid var(--tungsten);
    padding: 12px 18px;
    font-size: 13px;
    color: var(--ivory);
    z-index: 2000;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    max-width: 260px;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 10);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', initAuth);
