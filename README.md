# ✨ Plataforma 15 Años de Sara

Plataforma web interactiva para el evento de 15 años, con funcionalidades de navegación, galería compartida, mensajes y más.

![Version](https://img.shields.io/badge/version-1.0.0-pink)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-blue)
![Google Drive API](https://img.shields.io/badge/Google%20Drive-API-green)

## 🌟 Características

- 🏠 **Dashboard Principal** - Página de inicio con contador regresivo y navegación
- 🗺️ **Mapa Interactivo** - Navegación GPS en tiempo real al lugar del evento
- 📸 **Galería Compartida** - Sube y comparte fotos/videos usando Google Drive
- 💌 **Muro de Mensajes** - Envía felicitaciones y buenos deseos
- 📅 **Itinerario** - Timeline del programa del evento
- 📱 **Responsive Design** - Funciona perfectamente en móviles y tablets
- ✨ **Diseño Elegante** - Tema visual con gradientes y animaciones

## 🚀 Inicio Rápido

### 1. Clona o Descarga el Proyecto

```bash
git clone https://github.com/tu-usuario/15-sara.git
cd 15-sara
```

### 2. Configura el Evento

Edita `config.js` con la información de tu evento:

```javascript
evento: {
  nombre: "Sara",
  fecha: "2025-12-13",
  hora: "18:00",
  lugar: "Salón de eventos La Ceibita",
  // ... más configuraciones
}
```

### 3. Ejecuta Localmente

**Opción A - Live Server (VS Code):**

- Instala la extensión "Live Server"
- Clic derecho en `index.html` > "Open with Live Server"

**Opción B - Python:**

```bash
python -m http.server 8000
```

**Opción C - Node.js:**

```bash
npx http-server -p 8000
```

Abre: `http://localhost:8000`

### 4. Configura Google Drive (Opcional, para Galería)

Lee la guía completa en [`SETUP.md`](./SETUP.md)

Resumen:

1. Crea proyecto en [Google Cloud Console](https://console.cloud.google.com/)
2. Habilita Drive API y Picker API
3. Crea credenciales OAuth 2.0
4. Crea carpeta en Drive y compártela
5. Actualiza `config.js` con el `clientId` y `folderId`

## 📁 Estructura del Proyecto

```
15-Sara/
├── index.html              # Dashboard principal
├── config.js               # ⚠️ Configuración (EDITAR AQUÍ)
├── SETUP.md               # Guía de configuración completa
├── README.md              # Este archivo
├── css/
│   └── styles.css         # Estilos personalizados
├── js/
│   ├── app.js            # Funcionalidad general
│   ├── galeria.js        # Integración Google Drive
│   └── maps.js           # Google Maps integration
├── pages/
│   ├── mapa.html         # Página de mapa
│   ├── galeria.html      # Galería de fotos/videos
│   ├── mensajes.html     # Muro de mensajes
│   └── itinerario.html   # Cronograma del evento
└── assets/
    ├── carriage.svg      # Íconos SVG
    ├── castle.svg
    └── crown.svg
```

## 🛠️ Tecnologías

- **HTML5** - Estructura
- **CSS3** - Estilos base
- **TailwindCSS** - Framework CSS (vía CDN)
- **JavaScript (Vanilla)** - Funcionalidad
- **Google Maps API** - Mapas y navegación
- **Google Drive API** - Almacenamiento de archivos
- **Google Picker API** - Selector de archivos

## 🌐 Deployment (Hosting Gratuito)

### GitHub Pages

1. Sube el proyecto a GitHub
2. Ve a Settings > Pages
3. Selecciona branch `main` > Save
4. Tu sitio estará en: `https://usuario.github.io/repo`

### Netlify / Vercel

1. Conecta tu repositorio
2. Deploy automático
3. ¡Listo!

⚠️ **Recuerda:** Agrega tu dominio público en Google Cloud Console (Orígenes autorizados)

## 📱 Funcionalidades Detalladas

### Dashboard (index.html)

- Contador regresivo hasta el evento
- Navegación principal con cards
- Información del evento
- Diseño responsive

### Mapa (pages/mapa.html)

- Mapa interactivo con Google Maps
- Navegación en tiempo real desde la ubicación del usuario
- Botones para abrir en Google Maps / Waze
- Información de distancia y tiempo estimado

### Galería (pages/galeria.html)

- Subida de fotos y videos a Google Drive
- Preview de archivos subidos
- Acceso compartido para todos
- Soporta múltiples formatos

### Mensajes (pages/mensajes.html)

- Formulario para enviar felicitaciones
- Muro de mensajes públicos
- Almacenamiento en localStorage
- Contador de caracteres

### Itinerario (pages/itinerario.html)

- Timeline visual del evento
- Horarios y actividades
- Consejos y recomendaciones
- Información del código de vestimenta

## 🎨 Personalización

### Cambiar Colores

Edita `css/styles.css`:

```css
:root {
  --primary: #d63384;    /* Rosa principal */
  --secondary: #6f42c1;  /* Morado */
  --accent: #ff66b2;     /* Rosa claro */
  --gold: #ffd700;       /* Dorado */
}
```

### Cambiar Itinerario

Edita `config.js`:

```javascript
itinerario: [
  { hora: "18:00", actividad: "Tu actividad", icono: "🎉" },
  // Agrega más...
]
```

## 🔒 Seguridad

- ⚠️ **NO subas** `config.js` con API keys reales a repositorios públicos
- Usa variables de entorno para producción
- Restringe las API keys en Google Cloud Console

## 📝 To-Do / Mejoras Futuras

- [ ] Sistema de autenticación
- [ ] Backend para mensajes persistentes
- [ ] Lista de reproducción colaborativa
- [ ] Sistema de confirmación de asistencia (RSVP)
- [ ] Generación de QR para invitaciones
- [ ] Panel de administración
- [ ] Envío de notificaciones

## 🐛 Solución de Problemas

Ver guía completa en [`SETUP.md`](./SETUP.md)

**Problema común:**

- Si la galería no funciona, verifica que:
  1. El `clientId` esté configurado
  2. El `folderId` sea correcto
  3. La carpeta de Drive esté compartida públicamente
  4. Tu dominio esté en "Orígenes autorizados"

## 📄 Licencia

Este proyecto es de código abierto. Puedes usarlo y modificarlo libremente.

## 🤝 Contribuciones

¡Mejoras y sugerencias son bienvenidas!

## 📧 Contacto

Creado con 💖 para celebrar los 15 años de Sara

---

**⭐ Si te gusta este proyecto, dale una estrella en GitHub!**
