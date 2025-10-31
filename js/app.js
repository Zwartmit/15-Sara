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
          <span class="clock-number" id="countdown-days">0</span>
          <span class="clock-unit">días</span>
        </div>
        <div class="clock-time">
          <span class="clock-number" id="countdown-hours">00</span>:<span class="clock-number" id="countdown-minutes">00</span>:<span class="clock-number" id="countdown-seconds">00</span>
        </div>
        <div class="clock-label">Para el gran día ✨</div>
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

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initSmoothNavigation();
  initScrollAnimations();
});

// Funciones auxiliares
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 80px;
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
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
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
