// ============================================
// FUNCIONALIDAD DEL MAPA
// ============================================

let map;
let directionsService;
let directionsRenderer;
let carruaje;

// Inicializar el mapa
function initMap(position) {
  const origen = position ? {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  } : CONFIG.evento.coordenadas;

  const destino = CONFIG.evento.coordenadas;

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: origen,
    styles: [
      {
        featureType: "all",
        elementType: "geometry",
        stylers: [{ saturation: -20 }]
      }
    ]
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: "#ff66b2",
      strokeWeight: 5,
    },
  });
  directionsRenderer.setMap(map);

  // Si tenemos ubicación del usuario, calcular ruta
  if (position) {
    directionsService.route(
      {
        origin: origen,
        destination: destino,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(response);

          // Marcador del destino (castillo)
          new google.maps.Marker({
            position: destino,
            map,
            icon: {
              url: "../castle.svg",
              scaledSize: new google.maps.Size(60, 60),
            },
            title: CONFIG.evento.lugar,
          });

          // Marcador del origen (carruaje)
          carruaje = new google.maps.Marker({
            position: origen,
            map,
            icon: {
              url: "../carriage.svg",
              scaledSize: new google.maps.Size(50, 50),
            },
            title: "Tu ubicación",
          });

          // Actualizar posición en tiempo real
          navigator.geolocation.watchPosition((pos) => {
            const nuevaPos = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            };
            carruaje.setPosition(nuevaPos);
            map.setCenter(nuevaPos);
          });

          // Mostrar información de la ruta
          const route = response.routes[0].legs[0];
          document.getElementById('route-info').innerHTML = `
            <div class="glass" style="padding: 20px; margin: 20px 0;">
              <h3>📍 Información de la Ruta</h3>
              <p><strong>Distancia:</strong> ${route.distance.text}</p>
              <p><strong>Tiempo estimado:</strong> ${route.duration.text}</p>
              <p><strong>Destino:</strong> ${CONFIG.evento.lugar}</p>
            </div>
          `;
        } else {
          console.error("Error calculando ruta:", status);
          showSimpleMap(destino);
        }
      }
    );
  } else {
    showSimpleMap(destino);
  }
}

// Mostrar mapa simple sin ruta
function showSimpleMap(destino) {
  new google.maps.Marker({
    position: destino,
    map,
    icon: {
      url: "../castle.svg",
      scaledSize: new google.maps.Size(60, 60),
    },
    title: CONFIG.evento.lugar,
  });

  // Info del lugar
  const infoWindow = new google.maps.InfoWindow({
    content: `
      <div style="color: #333; padding: 10px;">
        <h3 style="margin:0 0 10px 0; color: #d63384;">${CONFIG.evento.lugar}</h3>
        <p style="margin: 5px 0;"><strong>📅 Fecha:</strong> ${formatDate(CONFIG.evento.fecha)}</p>
        <p style="margin: 5px 0;"><strong>🕐 Hora:</strong> ${CONFIG.evento.hora}</p>
        <p style="margin: 5px 0;"><strong>📍 Dirección:</strong> ${CONFIG.evento.direccion}</p>
      </div>
    `
  });

  const marker = new google.maps.Marker({
    position: destino,
    map,
    title: CONFIG.evento.lugar,
  });

  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });
}

// Obtener ubicación del usuario
function getMyLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        initMap(position);
      },
      () => {
        alert("No se pudo obtener tu ubicación. Mostrando solo el destino.");
        initMap(null);
      }
    );
  } else {
    alert("Tu navegador no soporta geolocalización.");
    initMap(null);
  }
}

// Abrir en app de navegación
function openInMaps(app) {
  const coords = CONFIG.evento.coordenadas;
  let url;

  switch(app) {
    case 'google':
      url = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
      break;
    case 'waze':
      url = `https://www.waze.com/ul?ll=${coords.lat},${coords.lng}&navigate=yes`;
      break;
    default:
      url = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
  }

  window.open(url, '_blank');
}

// Formatear fecha
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString + 'T12:00:00').toLocaleDateString('es-ES', options);
}

// Función callback para Google Maps (se llama automáticamente cuando la API está lista)
function initializeMap() {
  // Asegurar que el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startMapInitialization);
  } else {
    startMapInitialization();
  }
}

// Inicializar cuando cargue el DOM y Google Maps esté listo
function startMapInitialization() {
  const startBtn = document.getElementById('start-route-btn');
  if (startBtn) {
    startBtn.addEventListener('click', getMyLocation);
  }

  // Si ya existe el mapa, pedir ubicación automáticamente
  if (document.getElementById('map')) {
    getMyLocation();
  }
}

// Compatibilidad: si no se usa callback, inicializar normalmente
document.addEventListener('DOMContentLoaded', () => {
  // Solo inicializar si Google Maps ya está cargado y no se ha inicializado
  if (typeof google !== 'undefined' && google.maps && !map) {
    startMapInitialization();
  }
});
