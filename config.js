// ============================================
// CONFIGURACIÓN DEL PROYECTO - 15 AÑOS SARA
// ============================================

const CONFIG = {
  // Información del evento
  evento: {
    nombre: "Sara",
    fecha: "2025-12-13", // Formato: YYYY-MM-DD
    hora: "16:00",
    lugar: "Centro Comercial Iwoka",
    direccion: "Sogamoso, Boyacá, Colombia",
    coordenadas: {
      lat: 5.7241147,
      lng: -72.9227588
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
    { hora: "16:00", actividad: "Recepción de invitados", icono: "🎉" },
    { hora: "16:30", actividad: "Ceremonia de entrada", icono: "👑" },
    { hora: "17:00", actividad: "Vals de la quinceañera", icono: "💃" },
    { hora: "17:30", actividad: "Cena", icono: "🍽️" },
    { hora: "18:30", actividad: "Baile y diversión", icono: "🎵" },
    { hora: "21:00", actividad: "Cierre del evento", icono: "✨" }
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
