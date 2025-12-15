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

          // Obtener información de la ruta
          const route = response.routes[0].legs[0];

          // Crear InfoWindow con información de la ruta
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="color: #333; max-width: 200px;">
                <h3 style="margin:0 0 10px 0; color: #d63384; font-size: 16px;">📍 Información de la ruta</h3>
                <p style="margin: 5px 0; font-size: 14px;"><strong>Distancia:</strong> ${route.distance.text}</p>
                <p style="margin: 5px 0; font-size: 14px;"><strong>Tiempo:</strong> ${route.duration.text}</p>
                <p style="margin: 5px 0; font-size: 14px;"><strong>Destino:</strong> ${CONFIG.evento.lugar}</p>
              </div>
            `
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

          // Abrir InfoWindow automáticamente sobre el carruaje
          infoWindow.open(map, carruaje);

          // También permitir abrir al hacer clic en el carruaje
          carruaje.addListener('click', () => {
            infoWindow.open(map, carruaje);
          });

          // Actualizar posición en tiempo real
          // Actualizar posición en tiempo real con alta precisión
          const watchOptions = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          };

          navigator.geolocation.watchPosition((pos) => {
            const nuevaPos = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            };
            carruaje.setPosition(nuevaPos);
            // Opcional: Centrar mapa si el usuario se mueve mucho
            // map.setCenter(nuevaPos);
          }, (error) => {
            console.error("Error watching position:", error);
          }, watchOptions);

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
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        initMap(position);
      },
      (error) => {
        console.warn("Error obteniendo ubicación:", error);
        // Mostrar solo el destino sin alerta invasiva
        initMap(null);
      },
      options
    );
  } else {
    console.warn("Tu navegador no soporta geolocalización.");
    initMap(null);
  }
}

// Abrir en app de navegación con ubicación GPS fresca
function openInMaps(app) {
  const coords = CONFIG.evento.coordenadas;

  // Obtener ubicación GPS FRESCA en tiempo real antes de abrir
  if (navigator.geolocation) {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0  // No usar caché, forzar lectura GPS nueva
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Ubicación GPS fresca obtenida
        const origin = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        let url;
        switch (app) {
          case 'google':
            url = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${coords.lat},${coords.lng}`;
            break;
          case 'waze':
            // Waze usa GPS del dispositivo, pero incluimos destino preciso
            url = `https://www.waze.com/ul?ll=${coords.lat},${coords.lng}&navigate=yes&zoom=17`;
            break;
          default:
            url = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
        }

        window.open(url, '_blank');
      },
      (error) => {
        // Si falla obtener ubicación fresca, usar fallback
        console.warn("No se pudo obtener ubicación GPS fresca:", error);

        let url;
        let origin = null;

        // Intentar usar la última posición conocida del marcador
        if (typeof carruaje !== 'undefined' && carruaje && carruaje.getPosition()) {
          const pos = carruaje.getPosition();
          origin = { lat: pos.lat(), lng: pos.lng() };
        }

        switch (app) {
          case 'google':
            if (origin) {
              url = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${coords.lat},${coords.lng}`;
            } else {
              url = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
            }
            break;
          case 'waze':
            url = `https://www.waze.com/ul?ll=${coords.lat},${coords.lng}&navigate=yes&zoom=17`;
            break;
          default:
            url = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
        }

        window.open(url, '_blank');
      },
      options
    );
  } else {
    // Navegador no soporta geolocalización, abrir solo con destino
    let url;
    switch (app) {
      case 'google':
        url = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
        break;
      case 'waze':
        url = `https://www.waze.com/ul?ll=${coords.lat},${coords.lng}&navigate=yes&zoom=17`;
        break;
      default:
        url = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
    }

    window.open(url, '_blank');
  }
}

// Formatear fecha (Safari-compatible)
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  // Ensure ISO format for Safari: YYYY-MM-DDTHH:MM:SS
  const isoDate = dateString.includes('T') ? dateString : `${dateString}T12:00:00`;
  return new Date(isoDate).toLocaleDateString('es-ES', options);
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
