# 📋 Guía de Configuración - Plataforma 15 Años de Sara

¡Bienvenido! Esta guía te ayudará a configurar la plataforma completa para el evento de 15 años.

## 📦 Estructura del Proyecto

```
15-Sara/
├── index.html              # Dashboard principal
├── config.js               # Configuración central (⚠️ DEBES EDITAR ESTE ARCHIVO)
├── SETUP.md               # Esta guía
├── css/
│   └── styles.css         # Estilos personalizados
├── js/
│   ├── app.js            # Funciones generales
│   ├── galeria.js        # Funcionalidad de galería
│   └── maps.js           # Funcionalidad de mapas
├── pages/
│   ├── mapa.html         # Página de mapa interactivo
│   ├── galeria.html      # Página de galería con Drive
│   ├── mensajes.html     # Muro de felicitaciones
│   └── itinerario.html   # Cronograma del evento
└── assets/
    ├── carriage.svg      # Ícono de carruaje
    ├── castle.svg        # Ícono de castillo
```

## 🚀 Inicio Rápido

### 1. Configurar el Evento

Edita el archivo `config.js` y actualiza la información del evento:

```javascript
evento: {
  nombre: "Sara",
  fecha: "2025-12-13",        // ⚠️ Cambia esta fecha
  hora: "18:00",              // ⚠️ Cambia la hora
  lugar: "Tu Lugar",          // ⚠️ Nombre del lugar
  direccion: "Dirección",     // ⚠️ Dirección completa
  coordenadas: {
    lat: 5.7241147,           // ⚠️ Latitud del lugar
    lng: -72.9227588          // ⚠️ Longitud del lugar
  }
}
```

### 2. Obtener Coordenadas del Lugar

1. Abre [Google Maps](https://maps.google.com)
2. Busca el lugar del evento
3. Haz clic derecho en la ubicación exacta
4. Selecciona "¿Qué hay aquí?"
5. Las coordenadas aparecerán abajo (ej: 5.7241147, -72.9227588)
6. Cópialas en `config.js`

### 3. Configurar Google Drive API (Para la Galería)

#### Paso 1: Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Dale un nombre como "Sara-15-Anos"

#### Paso 2: Habilitar APIs

1. En el menú lateral, ve a **"APIs y servicios" > "Biblioteca"**
2. Busca y habilita las siguientes APIs:
   - ✅ Google Drive API
   - ✅ Google Picker API

#### Paso 3: Crear Credenciales OAuth 2.0

1. Ve a **"APIs y servicios" > "Credenciales"**
2. Haz clic en **"+ CREAR CREDENCIALES"** > **"ID de cliente de OAuth"**
3. Si es necesario, configura la pantalla de consentimiento:
   - Tipo de usuario: **Externo**
   - Nombre de la aplicación: **15 Años de Sara**
   - Correo de soporte: Tu email
   - Guardar y continuar
4. En "Tipo de aplicación" selecciona **"Aplicación web"**
5. Nombre: **15 Años Sara Web App**
6. En **"Orígenes autorizados de JavaScript"** agrega:
   ```
   http://localhost:8000
   http://localhost:5500
   http://127.0.0.1:8000
   https://tudominio.com    (cuando lo subas a un servidor)
   ```
7. Haz clic en **"CREAR"**
8. **Copia el "ID de cliente"** (algo como: `123456789-abc123.apps.googleusercontent.com`)
9. Pégalo en `config.js`:
   ```javascript
   googleDrive: {
     clientId: "TU_CLIENT_ID_AQUI.apps.googleusercontent.com",  // ⚠️ Pégalo aquí
   ```

#### Paso 4: Crear Carpeta en Google Drive

1. Abre [Google Drive](https://drive.google.com)
2. Crea una nueva carpeta, nómbrala "15 Años Sara - Galería"
3. Haz clic derecho en la carpeta > **"Compartir"**
4. Cambia el acceso a: **"Cualquier persona con el enlace puede EDITAR"**
5. Copia el enlace de la carpeta (algo como: `https://drive.google.com/drive/folders/ABC123DEF456`)
6. El **Folder ID** es la parte final de la URL: `ABC123DEF456`
7. Pégalo en `config.js`:
   ```javascript
   folderId: "TU_FOLDER_ID_AQUI",  // ⚠️ Pégalo aquí
   ```

### 4. Ejecutar el Proyecto Localmente

#### Opción A: Live Server (VS Code)

1. Instala la extensión "Live Server" en VS Code
2. Haz clic derecho en `index.html`
3. Selecciona "Open with Live Server"
4. El sitio se abrirá en `http://localhost:5500`

#### Opción B: Python HTTP Server

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Luego abre: `http://localhost:8000`

#### Opción C: Node.js (http-server)

```bash
npx http-server -p 8000
```

## 🌐 Publicar en Internet (Hosting Gratuito)

### Opción 1: GitHub Pages (Recomendado)

1. Sube el proyecto a un repositorio de GitHub
2. Ve a Settings > Pages
3. Selecciona la rama `main` y carpeta `/ (root)`
4. Guarda y espera unos minutos
5. Tu sitio estará en: `https://tuusuario.github.io/nombre-repo`

⚠️ **IMPORTANTE**: Después de publicar, agrega la URL en Google Cloud Console:

- Ve a "Credenciales" > Tu OAuth Client ID
- Agrega `https://tuusuario.github.io` a "Orígenes autorizados"

### Opción 2: Netlify

1. Ve a [Netlify](https://netlify.com)
2. Arrastra la carpeta del proyecto
3. ¡Listo! Tu sitio estará en línea

### Opción 3: Vercel

1. Ve a [Vercel](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. Deploy automático

## 📝 Personalización del Itinerario

Edita el itinerario en `config.js`:

```javascript
itinerario: [
  { hora: "18:00", actividad: "Recepción de invitados", icono: "🎉" },
  { hora: "18:30", actividad: "Ceremonia de entrada", icono: "👑" },
  // Agrega o modifica actividades aquí
]
```

## 🎨 Personalizar Colores

En `config.js` puedes cambiar los colores del tema:

```javascript
theme: {
  primaryColor: "#d63384",    // Rosa
  secondaryColor: "#6f42c1",  // Morado
  accentColor: "#ff66b2"      // Rosa claro
}
```

O edita directamente `css/styles.css`:

```css
:root {
  --primary: #d63384;
  --secondary: #6f42c1;
  --accent: #ff66b2;
  --gold: #ffd700;
}
```

## 🔧 Solución de Problemas

### La galería no funciona

1. ✅ Verifica que hayas configurado el `clientId` en `config.js`
2. ✅ Verifica que el `folderId` sea correcto
3. ✅ Asegúrate de que la carpeta de Drive esté compartida públicamente
4. ✅ Verifica que el dominio esté en "Orígenes autorizados" en Google Cloud Console
5. ✅ Abre la consola del navegador (F12) para ver errores

### El mapa no se muestra

1. ✅ Verifica que tu Google Maps API Key sea válida
2. ✅ Asegúrate de que la API de Maps esté habilitada en Google Cloud Console
3. ✅ Verifica las coordenadas del lugar

### Los mensajes no se guardan

- Los mensajes se guardan en `localStorage` del navegador
- Son temporales y específicos de cada navegador
- Para almacenamiento permanente, considera integrar Firebase

## 📱 Funcionalidades

### ✅ Implementadas

- 🏠 **Dashboard** con contador regresivo
- 🗺️ **Mapa** interactivo con navegación en tiempo real
- 📸 **Galería** con Google Drive API (subida de fotos/videos)
- 💌 **Mensajes** muro de felicitaciones
- 📅 **Itinerario** timeline del evento
- 📱 Responsive design (funciona en móviles)
- ✨ Animaciones y efectos visuales

### 🔮 Posibles Mejoras Futuras

- 🔐 Sistema de autenticación de usuarios
- 📊 Dashboard de administración
- 🎵 Lista de reproducción colaborativa
- 📧 Notificaciones por email
- 💾 Base de datos para mensajes (Firebase)
- 📷 Galería con visualización de fotos sin Drive
- 🎟️ Confirmación de asistencia (RSVP)

## 📞 Soporte

Si tienes problemas, revisa:

1. La consola del navegador (F12 > Console)
2. Que todos los archivos estén en su lugar
3. Que el servidor local esté corriendo
4. Que las configuraciones en `config.js` sean correctas

## 🎉 ¡Listo!

Ya tienes una plataforma completa para el evento de 15 años. Los invitados podrán:

- ✅ Ver cómo llegar con navegación GPS
- ✅ Subir fotos y videos del evento
- ✅ Enviar mensajes de felicitación
- ✅ Conocer el itinerario completo

---

**Hecho con 💖 para celebrar los 15 años de Sara**
