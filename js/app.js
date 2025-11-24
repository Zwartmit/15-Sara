// ============================================
// FUNCIONES GENERALES DE LA APLICACIÓN
// ============================================

// Reloj de cuenta regresiva circular
function initCountdown() {
  const countdownElement = document.getElementById('countdown');
  if (!countdownElement) return;

  const eventDate = new Date(CONFIG.evento.fecha + ' ' + CONFIG.evento.hora).getTime();

  // Crear estructura HTML del reloj circular
  countdownElement.innerHTML = `
    <div class="countdown-clock">
      <svg class="clock-svg" viewBox="0 0 200 200">
        <!-- Círculo de fondo -->
        <circle cx="100" cy="100" r="90" class="clock-bg"></circle>
        
        <!-- Círculo de progreso - Días -->
        <circle cx="100" cy="100" r="90" class="clock-progress clock-days" id="progress-days"></circle>
        
        <!-- Círculo de progreso - Horas -->
        <circle cx="100" cy="100" r="75" class="clock-progress clock-hours" id="progress-hours"></circle>
        
        <!-- Círculo de progreso - Minutos -->
        <circle cx="100" cy="100" r="60" class="clock-progress clock-minutes" id="progress-minutes"></circle>
        
        <!-- Círculo de progreso - Segundos -->
        <circle cx="100" cy="100" r="45" class="clock-progress clock-seconds" id="progress-seconds"></circle>
      </svg>
      
      <div class="clock-center">
        <div class="clock-time">
          <span class="clock-unit1">Faltan</span>
          <br>
          <span class="clock-number" id="countdown-days">0</span>
          <span class="clock-unit2">días</span>
        </div>
        <div class="clock-time">
          <span class="clock-number" id="countdown-hours">00</span>:<span class="clock-number" id="countdown-minutes">00</span>:<span class="clock-number" id="countdown-seconds">00</span>
        </div>
      </div>
    </div>
  `;

  // Obtener referencias a los elementos
  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');
  const secondsEl = document.getElementById('countdown-seconds');

  const progressDays = document.getElementById('progress-days');
  const progressHours = document.getElementById('progress-hours');
  const progressMinutes = document.getElementById('progress-minutes');
  const progressSeconds = document.getElementById('progress-seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
      countdownElement.innerHTML = '<div class="countdown-item"><span class="countdown-number">¡HOY!</span><span class="countdown-label">Es el gran día</span></div>';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Actualizar números
    daysEl.textContent = days;
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');

    // Calcular porcentajes para los círculos de progreso
    const totalDays = 365; // Máximo de días para el círculo
    const daysPercent = (days / totalDays) * 100;
    const hoursPercent = (hours / 24) * 100;
    const minutesPercent = (minutes / 60) * 100;
    const secondsPercent = (seconds / 60) * 100;

    // Actualizar círculos de progreso (565.48 es la circunferencia del círculo)
    const circumference = 2 * Math.PI * 90; // Para el círculo más grande
    progressDays.style.strokeDashoffset = circumference - (circumference * daysPercent / 100);

    const circumferenceHours = 2 * Math.PI * 75;
    progressHours.style.strokeDashoffset = circumferenceHours - (circumferenceHours * hoursPercent / 100);

    const circumferenceMinutes = 2 * Math.PI * 60;
    progressMinutes.style.strokeDashoffset = circumferenceMinutes - (circumferenceMinutes * minutesPercent / 100);

    const circumferenceSeconds = 2 * Math.PI * 45;
    progressSeconds.style.strokeDashoffset = circumferenceSeconds - (circumferenceSeconds * secondsPercent / 100);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// Toggle mobile menu
function toggleMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
}

// Close menu when clicking on a link
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const hamburger = document.querySelector('.hamburger');
      const navLinksMenu = document.querySelector('.nav-links');
      if (hamburger && navLinksMenu) {
        hamburger.classList.remove('active');
        navLinksMenu.classList.remove('active');
      }
    });
  });
});

// Navegación suave
function initSmoothNavigation() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// Animaciones al hacer scroll
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, {
    threshold: 0.1
  });

  document.querySelectorAll('.card, .glass').forEach(el => {
    observer.observe(el);
  });
}

// Botón scroll to top
function initScrollToTop() {
  // Crear el botón
  const scrollBtn = document.createElement('button');
  scrollBtn.id = 'scroll-to-top';
  scrollBtn.innerHTML = '↑';
  scrollBtn.setAttribute('aria-label', 'Volver arriba');
  scrollBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
    border: none;
    font-size: 24px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(155, 89, 182, 0.4);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  document.body.appendChild(scrollBtn);

  // Mostrar/ocultar botón según scroll
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollBtn.style.opacity = '1';
      scrollBtn.style.visibility = 'visible';
    } else {
      scrollBtn.style.opacity = '0';
      scrollBtn.style.visibility = 'hidden';
    }
  });

  // Click para volver arriba
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Efecto hover
  scrollBtn.addEventListener('mouseenter', () => {
    scrollBtn.style.transform = 'scale(1.1)';
    scrollBtn.style.boxShadow = '0 6px 25px rgba(155, 89, 182, 0.6)';
  });

  scrollBtn.addEventListener('mouseleave', () => {
    scrollBtn.style.transform = 'scale(1)';
    scrollBtn.style.boxShadow = '0 4px 15px rgba(155, 89, 182, 0.4)';
  });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initSmoothNavigation();
  initScrollAnimations();
  initScrollToTop();
});

// Funciones auxiliares
let activeNotifications = {};

function showNotification(message, type = 'info', notificationId = null) {
  // Si hay un ID y ya existe una notificación con ese ID, solo actualizarla
  if (notificationId && activeNotifications[notificationId]) {
    const existingNotification = activeNotifications[notificationId].element;
    existingNotification.textContent = message;

    // Reiniciar el timer si existe
    if (activeNotifications[notificationId].timeout) {
      clearTimeout(activeNotifications[notificationId].timeout);
    }

    // Solo establecer nuevo timeout si no es una notificación permanente de progreso
    if (!notificationId.includes('progress')) {
      const timeout = setTimeout(() => {
        existingNotification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
          existingNotification.remove();
          delete activeNotifications[notificationId];
        }, 300);
      }, 3000);
      activeNotifications[notificationId].timeout = timeout;
    }

    return;
  }

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: ${80 + (Object.keys(activeNotifications).length * 70)}px;
    right: 20px;
    background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  // Guardar referencia si tiene ID
  if (notificationId) {
    activeNotifications[notificationId] = { element: notification, timeout: null };
  }

  // Solo auto-ocultar si no tiene ID de progreso
  if (!notificationId || !notificationId.includes('progress')) {
    const timeout = setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        notification.remove();
        if (notificationId) delete activeNotifications[notificationId];
      }, 300);
    }, 3000);

    if (notificationId) {
      activeNotifications[notificationId].timeout = timeout;
    }
  }
}

// Función para cerrar una notificación específica
function closeNotification(notificationId) {
  if (activeNotifications[notificationId]) {
    const notification = activeNotifications[notificationId].element;
    if (activeNotifications[notificationId].timeout) {
      clearTimeout(activeNotifications[notificationId].timeout);
    }
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      notification.remove();
      delete activeNotifications[notificationId];
    }, 300);
  }
}

// Estilos para las notificaciones
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Scroll al inicio al cargar la página
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});

// También al cambiar de página (para navegadores que mantienen posición)
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
