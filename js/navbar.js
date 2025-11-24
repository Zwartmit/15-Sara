// Cargar navbar dinámicamente
async function loadNavbar() {
  const navbarContainer = document.getElementById('navbar-container');
  if (!navbarContainer) return;

  try {
    // Determinar si estamos en la raíz o en una subcarpeta
    const path = window.location.pathname;
    const isInPages = path.includes('/pages/');
    const isHome = !isInPages && (path.endsWith('index.html') || path.endsWith('/') || path === '');
    const navbarPath = isInPages ? '../navbar.html' : './navbar.html';

    // Cargar el navbar
    const response = await fetch(navbarPath);
    const html = await response.text();
    navbarContainer.innerHTML = html;

    // Ajustar las rutas según la ubicación
    if (isInPages) {
      // Estamos en /pages/, ajustar rutas
      navbarContainer.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (href.startsWith('./index.html')) {
          link.setAttribute('href', '../index.html');
        } else if (href.startsWith('./pages/')) {
          link.setAttribute('href', href.replace('./pages/', './'));
        }
      });

      // Ajustar rutas de todas las imágenes del navbar
      navbarContainer.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('src');
        if (src && src.startsWith('./assets/')) {
          img.setAttribute('src', src.replace('./assets/', '../assets/'));
        }
      });
    }

    // Ocultar botones en Home (index)
    if (isHome) {
      const links = navbarContainer.querySelector('.nav-links');
      const burger = navbarContainer.querySelector('.hamburger-menu');
      const hint = navbarContainer.querySelector('.nav-hint');
      if (links) links.style.display = 'none';
      if (burger) burger.style.display = 'none';
      if (hint) hint.style.display = 'none';
    }

    // Resaltar página actual
    highlightCurrentPage();

  } catch (error) {
    console.error('Error cargando navbar:', error);
  }
}

// Resaltar la página actual en el menú
function highlightCurrentPage() {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll('.nav-links a');

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (currentPath.includes(href) ||
      (currentPath.endsWith('/') && href.includes('index.html')) ||
      (currentPath.includes('/pages/mapa') && href.includes('mapa')) ||
      (currentPath.includes('/pages/galeria') && href.includes('galeria')) ||
      (currentPath.includes('/pages/mensajes') && href.includes('mensajes')) ||
      (currentPath.includes('/pages/itinerario') && href.includes('itinerario'))) {
      link.style.borderColor = 'var(--gold)';
    }
  });
}

// Toggle menú móvil
function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  const hamburgerMenu = document.querySelector('.hamburger-menu');

  if (navLinks) navLinks.classList.toggle('active');
  if (hamburgerMenu) hamburgerMenu.classList.toggle('active');
}

// Cerrar menú al hacer clic en un enlace
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const menu = document.querySelector('.nav-links');
      const hamburgerMenu = document.querySelector('.hamburger-menu');
      if (menu && menu.classList.contains('active')) {
        menu.classList.remove('active');
        if (hamburgerMenu) hamburgerMenu.classList.remove('active');
      }
    });
  });
});

// Cargar navbar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadNavbar);
