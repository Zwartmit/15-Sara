// ============================================
// MENSAJES CON FIREBASE REALTIME DATABASE
// ============================================

let messages = [];
let firebaseDB = null;
let messagesRef = null;

// Inicializar Firebase
function initFirebase() {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(CONFIG.firebase);
    }
    firebaseDB = firebase.database();
    messagesRef = firebaseDB.ref('messages');
    console.log('✅ Firebase inicializado correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error inicializando Firebase:', error);
    return false;
  }
}

// Inicializar mensajes
async function initMessages() {
  // Inicializar Firebase
  if (!initFirebase()) {
    console.error('No se pudo inicializar Firebase');
    return;
  }

  // Escuchar cambios en tiempo real
  messagesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
      messages = Object.values(data).sort((a, b) => b.id - a.id);
      console.log('📨 Mensajes actualizados desde Firebase:', messages.length);

      if (typeof displayMessages === 'function') {
        displayMessages();
      }
    } else {
      messages = [];
      console.log('No hay mensajes en Firebase');
    }
  });
}

// Guardar mensaje en Firebase
async function saveMessageToFirebase(message) {
  try {
    if (!messagesRef) {
      throw new Error('Firebase no está inicializado');
    }

    // Usar el ID del mensaje como clave
    await messagesRef.child(message.id.toString()).set(message);
    console.log('✅ Mensaje guardado en Firebase');
    return true;
  } catch (error) {
    console.error('❌ Error guardando mensaje en Firebase:', error);
    return false;
  }
}

// Contador de caracteres y auto-resize
function updateCharCounter() {
  const textarea = document.getElementById('message-content');
  const content = textarea.value;
  document.getElementById('char-count').textContent = content.length;

  // Auto-resize
  textarea.style.height = 'auto';
  textarea.style.height = (textarea.scrollHeight) + 'px';
}

// Enviar mensaje
async function submitMessage(event) {
  event.preventDefault();

  const author = document.getElementById('author-name').value.trim();
  const content = document.getElementById('message-content').value.trim();

  if (!author || !content) {
    showNotification('Por favor completa todos los campos', 'error');
    return;
  }

  // Deshabilitar botón mientras se envía
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '⏳ Enviando...';

  const message = {
    id: Date.now(),
    author: author,
    content: content,
    date: new Date().toISOString(),
    avatar: getRandomEmoji()
  };

  // Guardar en Firebase
  const saved = await saveMessageToFirebase(message);

  if (saved) {
    // Limpiar formulario
    document.getElementById('message-form').reset();
    updateCharCounter();

    showNotification('¡Mensaje enviado con éxito! 💌', 'success');

    // Los mensajes se actualizarán automáticamente por el listener de Firebase
  } else {
    showNotification('Error al enviar el mensaje. Intenta de nuevo.', 'error');
  }

  // Rehabilitar botón
  submitBtn.disabled = false;
  submitBtn.innerHTML = originalText;
}

// Mostrar mensajes (será sobrescrito por mensajes-3d.js)
function displayMessages() {
  // Esta función será reemplazada por la versión 3D
  // Si no se carga el 3D, mostrará un mensaje básico
  console.log('Cargando mensajes...');
}

// Emoji aleatorio para avatar
function getRandomEmoji() {
  const emojis = ['🎉', '💖', '🎊', '✨', '🌟', '💕', '🎈', '🎁', '👑', '💐', '🦋', '🌸'];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

// Formatear fecha
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Ahora mismo';
  if (minutes < 60) return `Hace ${minutes} min`;
  if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
  if (days < 7) return `Hace ${days} día${days > 1 ? 's' : ''}`;

  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Escapar HTML para seguridad
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Firebase maneja la actualización en tiempo real automáticamente
// No necesitamos polling manual
function startMessagesSystem() {
  console.log('🔄 Sistema de mensajes en tiempo real activo (Firebase)');
}
