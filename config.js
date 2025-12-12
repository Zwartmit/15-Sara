// ============================================
// CONFIGURACIÓN DEL PROYECTO - 15 AÑOS SARA
// ============================================

const CONFIG = {
  // Información del evento
  evento: {
    nombre: "Sara",
    fecha: "2025-12-11", // Formato: YYYY-MM-DD
    hora: "07:22 pm",
    lugar: "Salón de eventos La Ceibita",
    coordenadas: {
      lat: 5.7008645,
      lng: -72.9183341
    }
  },

  // Google Maps API
  googleMaps: {
    apiKey: "AIzaSyBdO-5ZVOSsWWuwt3Xjco_KqX7PHR1ZmRk"
  },

  // Cloudinary - Almacenamiento de Fotos/Videos
  cloudinary: {
    cloudName: "dhqjvynhy",
    uploadPreset: "sara_15_anos",
    apiKey: "584371878739737",
    apiSecret: "sIzN02QwPEBkdBvs6MnGWb8vEZM", // Solo para desarrollo
    folder: "15-anos-sara" // Carpeta donde se guardarán los archivos
  },

  // Firebase - Almacenamiento de Mensajes en Tiempo Real
  firebase: {
    apiKey: "AIzaSyDW4Hd23EC3RHLZGXTPy74uV6XTQvZlGFM",
    authDomain: "sara-fiesta15.firebaseapp.com",
    databaseURL: "https://sara-fiesta15-default-rtdb.firebaseio.com",
    projectId: "sara-fiesta15",
    storageBucket: "sara-fiesta15.firebasestorage.app",
    messagingSenderId: "404279419159",
    appId: "1:404279419159:web:6d252e86f9a2a15ce19752"
  },

  // Itinerario del evento
  itinerario: [
    { actividad: "Entrada de la quinceañera", icono: "👸" },
    { actividad: "Cambio de zapatillas", icono: "👠" },
    { actividad: "Entrega del anillo", icono: "💍" },
    { actividad: "Entrega de accesorios", icono: "👑" },
    { actividad: "Entrega del peluche de la quinceañera a familiar menor", icono: "🧸" },
    { actividad: "Vals", icono: "💃" },
    { actividad: "Happy birthday", icono: "🎂" },
    { actividad: "Brindis", icono: "🥂" },
    { actividad: "Palabras padre y madre", icono: "🗣️" },
    { actividad: "Palabras de bienvenida por parte la quinceañera", icono: "🎤" },
    { actividad: "Registro fotográfico", icono: "📸" },
    { actividad: "Cena", icono: "🍽️" },
    { actividad: "Ponqué", icono: "🍰" },
    { actividad: "Rumba", icono: "🎵" }
  ],

  // Temas y colores
  theme: {
    primaryColor: "#d63384",
    secondaryColor: "#6f42c1",
    accentColor: "#ff66b2"
  }
};

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
