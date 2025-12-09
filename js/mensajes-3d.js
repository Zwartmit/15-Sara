// ============================================
// TABLERO 3D DE MENSAJES CON THREE.JS Y GSAP
// ============================================

let scene, camera, renderer, postits = [];
let isMouseDown = false;
let mouseX = 0, mouseY = 0;
let targetPositionX = 0, targetPositionY = 0;
let currentPositionX = 0, currentPositionY = 0;
let boardGroup;
const MIN_ZOOM = 5;
const MAX_ZOOM = 45;

// Colores para los post-its
const postitColors = [
  0xffd54f, // Amarillo
  0xff8a80, // Rosa
  0x80deea, // Azul
  0xce93d8, // Morado
  0xa5d6a7, // Verde
  0xffab91, // Naranja
  0x90caf9, // Azul claro
  0xf48fb1  // Rosa claro
];

// Inicializar escena 3D
function init3DScene() {
  const container = document.getElementById('canvas-container');
  const canvas = document.getElementById('messages-canvas');

  // Crear escena
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a2e);

  // Configurar cámara (zoom máximo por defecto)
  camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 10; // Zoom máximo (más cerca)

  // Configurar renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;

  // Grupo para el tablero
  boardGroup = new THREE.Group();
  scene.add(boardGroup);

  // Iluminación
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const pointLight1 = new THREE.PointLight(0xff66b2, 0.5);
  pointLight1.position.set(-10, 5, 5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x6f42c1, 0.5);
  pointLight2.position.set(10, -5, 5);
  scene.add(pointLight2);

  // Event listeners
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('wheel', onMouseWheel, { passive: false });
  canvas.addEventListener('touchstart', onTouchStart, { passive: false });
  canvas.addEventListener('touchmove', onTouchMove, { passive: false });
  canvas.addEventListener('touchend', onTouchEnd, { passive: false });

  window.addEventListener('resize', onWindowResize);

  // Botones de zoom y fullscreen
  const zoomInBtn = document.getElementById('zoom-in-btn');
  const zoomOutBtn = document.getElementById('zoom-out-btn');
  const fullscreenBtn = document.getElementById('fullscreen-btn');

  const zoomIn = () => {
    camera.position.z -= 2;
    camera.position.z = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, camera.position.z));
  };

  const zoomOut = () => {
    camera.position.z += 2;
    camera.position.z = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, camera.position.z));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (container.requestFullscreen) container.requestFullscreen();
      else if (container.mozRequestFullScreen) container.mozRequestFullScreen();
      else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();
      else if (container.msRequestFullscreen) container.msRequestFullscreen();
      if (fullscreenBtn) fullscreenBtn.textContent = '❌';
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      if (fullscreenBtn) fullscreenBtn.textContent = '⛶';
    }
  };

  // Listeners para cambio de fullscreen
  document.addEventListener('fullscreenchange', () => {
    if (fullscreenBtn) fullscreenBtn.textContent = document.fullscreenElement ? '❌' : '⛶';
  });

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', zoomIn);
    zoomInBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      zoomIn();
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', zoomOut);
    zoomOutBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      zoomOut();
    });
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    fullscreenBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFullscreen();
    });
  }

  // Iniciar animación
  animate();
}

// Crear post-it 3D
function createPostit3D(message, index, total) {
  const group = new THREE.Group();

  // Geometría del post-it (más grande y legible)
  const geometry = new THREE.BoxGeometry(3.5, 4.0, 0.08);
  const color = postitColors[index % postitColors.length];
  const material = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.6,
    metalness: 0.1
  });

  const postit = new THREE.Mesh(geometry, material);
  postit.castShadow = true;
  postit.receiveShadow = true;
  group.add(postit);

  // Crear canvas para el texto (mayor resolución)
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Función auxiliar para dividir texto en líneas
  function getWrappedLines(context, text, maxWidth) {
    const words = text.split(/\s+/); // Split by whitespace handles multiple spaces better
    let lines = [];
    if (words.length === 0) return lines;

    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = context.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  // Fondo del canvas
  ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Sombra para el texto
  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // --- LAYOUT DINÁMICO ---
  let currentY = 130;
  const maxWidth = 900;
  const marginX = 60;

  // 1. AUTOR
  ctx.fillStyle = '#1a1a1a';
  ctx.textAlign = 'center';

  let authorFontSize = 90;
  ctx.font = `bold ${authorFontSize}px Poppins, sans-serif`;
  let authorMetrics = ctx.measureText(message.author);

  // Si el nombre es muy largo, reducir fuente (mínimo 60px)
  if (authorMetrics.width > maxWidth) {
    const ratio = maxWidth / authorMetrics.width;
    authorFontSize = Math.max(60, Math.floor(authorFontSize * ratio));
    ctx.font = `bold ${authorFontSize}px Poppins, sans-serif`;
  }

  // Obtener líneas (wrapping si aún no cabe)
  const authorLines = getWrappedLines(ctx, message.author, maxWidth);

  authorLines.forEach((line) => {
    ctx.fillText(line, canvas.width / 2, currentY);
    currentY += authorFontSize * 1.1;
  });

  currentY += 20; // Espacio

  // 2. EMOJI
  ctx.shadowBlur = 0;
  ctx.font = '110px Arial';

  // Ajuste visual para el emoji
  currentY += 70;
  ctx.fillText(message.avatar, canvas.width / 2, currentY);
  currentY += 70; // Espacio después del emoji

  // 3. MENSAJE (Adaptativo)
  ctx.shadowBlur = 2;
  ctx.fillStyle = '#2a2a2a';
  ctx.textAlign = 'left';

  // Calcular espacio disponible
  // Dejar espacio para la fecha en el pie (aprox en 980)
  const dateY = 980;
  const maxContentHeight = dateY - 80 - currentY; // 80px de margen antes de la fecha

  let contentFontSize = 90;
  let contentLines = [];
  let lineHeight = 0;
  let fits = false;

  // Reducir tamaño de fuente iterativamente si no cabe
  while (!fits && contentFontSize >= 45) {
    ctx.font = `${contentFontSize}px "Indie Flower", cursive`;
    lineHeight = contentFontSize * 1.0; // Un poco más de espaciado
    contentLines = getWrappedLines(ctx, message.content, maxWidth);

    const estimatedHeight = contentLines.length * lineHeight;

    if (estimatedHeight <= maxContentHeight) {
      fits = true;
    } else {
      contentFontSize -= 5;
    }
  }

  // Renderizar contenido
  ctx.font = `${contentFontSize}px "Indie Flower", cursive`;

  contentLines.forEach(line => {
    // Verificar límite inferior por seguridad
    if (currentY + lineHeight < dateY - 20) {
      ctx.fillText(line, marginX, currentY);
      currentY += lineHeight;
    }
  });

  // 4. FECHA
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#555';
  ctx.font = '60px Poppins';
  ctx.textAlign = 'center';
  ctx.fillText(formatDate(message.date), canvas.width / 2, dateY);

  // Aplicar textura con mejor calidad
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  const textMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: false
  });

  const textGeometry = new THREE.PlaneGeometry(3.4, 3.9);
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.z = 0.041;
  group.add(textMesh);

  // Posición en grid (8 columnas para más densidad)
  const cols = 8;
  const rows = Math.ceil(total / cols);
  const col = index % cols;
  const row = Math.floor(index / cols);

  const posX = (col - cols / 2) * 4.5;
  const posY = (rows / 2 - row) * 5.0;
  const posZ = Math.sin(index * 0.5) * 0.8;

  group.position.set(posX, posY, posZ);

  // Rotación aleatoria ligera
  group.rotation.z = (Math.random() - 0.5) * 0.15;

  // Animación de entrada con GSAP
  group.scale.set(0, 0, 0);
  gsap.to(group.scale, {
    x: 1,
    y: 1,
    z: 1,
    duration: 0.6,
    delay: index * 0.05,
    ease: 'back.out(1.7)'
  });

  gsap.to(group.rotation, {
    z: group.rotation.z,
    duration: 0.6,
    delay: index * 0.05,
    ease: 'elastic.out(1, 0.5)'
  });

  // Animación de flotación continua
  const floatY = group.position.y + Math.random() * 0.3 - 0.15;
  gsap.to(group.position, {
    y: floatY,
    duration: 2 + Math.random() * 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  gsap.to(group.rotation, {
    z: group.rotation.z + (Math.random() - 0.5) * 0.1,
    duration: 3 + Math.random() * 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  return group;
}

// Actualizar tablero 3D
function update3DBoard() {
  // Verificar que la escena 3D esté inicializada
  if (!boardGroup) {
    console.warn('Tablero 3D no inicializado aún');
    return;
  }

  // Limpiar post-its anteriores
  postits.forEach(postit => {
    boardGroup.remove(postit);
  });
  postits = [];

  // Si no hay mensajes, no hacer nada
  if (!messages || messages.length === 0) {
    console.log('Aún no hay mensajes.');
    return;
  }

  // Crear nuevos post-its
  messages.forEach((message, index) => {
    const postit = createPostit3D(message, index, messages.length);
    boardGroup.add(postit);
    postits.push(postit);
  });

  // Centrar el grupo solo si hay post-its
  if (postits.length > 0) {
    try {
      const box = new THREE.Box3().setFromObject(boardGroup);
      const center = box.getCenter(new THREE.Vector3());

      // Resetear posición objetivo al centrar
      targetPositionX = 0;
      targetPositionY = 0;
      currentPositionX = 0;
      currentPositionY = 0;

      // Centrar solo en Z
      boardGroup.position.set(0, 0, -center.z);
    } catch (error) {
      console.warn('Error centrando el tablero:', error);
    }
  }
}

// Animación
function animate() {
  requestAnimationFrame(animate);

  // Movimiento suave
  currentPositionX += (targetPositionX - currentPositionX) * 0.1;
  currentPositionY += (targetPositionY - currentPositionY) * 0.1;

  boardGroup.position.x = currentPositionX;
  boardGroup.position.y = currentPositionY;

  renderer.render(scene, camera);
}

// Event handlers
function onMouseDown(event) {
  isMouseDown = true;
  mouseX = event.clientX;
  mouseY = event.clientY;
}

function onMouseMove(event) {
  if (!isMouseDown) return;

  const deltaX = event.clientX - mouseX;
  const deltaY = event.clientY - mouseY;

  // Mover horizontalmente y verticalmente
  targetPositionX += deltaX * 0.02;
  targetPositionY -= deltaY * 0.02; // Invertir Y para movimiento natural

  // Limitar movimiento para no perder el tablero (límites ampliados para más notas)
  targetPositionX = Math.max(-50, Math.min(50, targetPositionX));
  targetPositionY = Math.max(-100, Math.min(100, targetPositionY));

  mouseX = event.clientX;
  mouseY = event.clientY;
}

function onMouseUp() {
  isMouseDown = false;
}

function onMouseWheel(event) {
  event.preventDefault();
  camera.position.z += event.deltaY * 0.01;
  camera.position.z = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, camera.position.z));
}

// Touch events
let touchStartX = 0, touchStartY = 0;
let initialPinchDistance = 0;

function onTouchStart(event) {
  event.preventDefault(); // Prevenir scroll de la página

  if (event.touches.length === 1) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  } else if (event.touches.length === 2) {
    // Calcular distancia inicial para pinch zoom
    const dx = event.touches[0].clientX - event.touches[1].clientX;
    const dy = event.touches[0].clientY - event.touches[1].clientY;
    initialPinchDistance = Math.sqrt(dx * dx + dy * dy);
  }
}

function onTouchMove(event) {
  event.preventDefault(); // Prevenir scroll de la página

  if (event.touches.length === 1) {
    // Arrastrar con un dedo
    const deltaX = event.touches[0].clientX - touchStartX;
    const deltaY = event.touches[0].clientY - touchStartY;

    // Mover horizontalmente y verticalmente
    targetPositionX += deltaX * 0.02;
    targetPositionY -= deltaY * 0.02;

    // Limitar movimiento (límites ampliados para más notas)
    targetPositionX = Math.max(-50, Math.min(50, targetPositionX));
    targetPositionY = Math.max(-100, Math.min(100, targetPositionY));

    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  } else if (event.touches.length === 2) {
    // Pinch zoom con dos dedos
    const dx = event.touches[0].clientX - event.touches[1].clientX;
    const dy = event.touches[0].clientY - event.touches[1].clientY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (initialPinchDistance > 0) {
      const delta = distance - initialPinchDistance;
      camera.position.z -= delta * 0.05;
      camera.position.z = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, camera.position.z));
    }

    initialPinchDistance = distance;
  }
}

function onTouchEnd(event) {
  if (event.touches.length === 0) {
    initialPinchDistance = 0;
  }
}

function onWindowResize() {
  const container = document.getElementById('canvas-container');
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

// Vista 2D desactivada - solo se usa vista 3D

// Mostrar mensajes en 2D
function displayMessages2D() {
  const container = document.getElementById('messages-container-2d');

  if (messages.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; opacity: 0.7;">
        <p class="text-xl">Aún no hay mensajes. ¡Sé el primero en felicitar a Sara! 💖</p>
      </div>
    `;
    return;
  }

  // Generar posiciones aleatorias para los post-its
  const positions = generateRandomPositions(messages.length, container);

  container.innerHTML = messages.map((msg, index) => {
    const pos = positions[index];
    return `
      <div class="message-card" data-id="${msg.id}" style="left: ${pos.x}px; top: ${pos.y}px; animation-delay: ${index * 0.1}s;">
        <div class="message-header">
          <div class="message-avatar">${msg.avatar}</div>
          <div style="flex: 1;">
            <div class="message-author">${escapeHtml(msg.author)}</div>
            <div class="message-date">${formatDate(msg.date)}</div>
          </div>
        </div>
        <div class="message-content">${escapeHtml(msg.content)}</div>
      </div>
    `;
  }).join('');

  // Animar entrada con GSAP
  gsap.from('.message-card', {
    scale: 0,
    rotation: -15,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: 'back.out(1.7)'
  });

  // Hacer los post-its arrastrables
  makeDraggable();
}

// Generar posiciones aleatorias para los post-its
function generateRandomPositions(count, container) {
  const positions = [];
  const containerWidth = container.clientWidth - 270; // Ancho del post-it + margen
  const containerHeight = Math.max(600, Math.ceil(count / 3) * 250);

  // Actualizar altura del contenedor
  container.style.minHeight = containerHeight + 'px';

  for (let i = 0; i < count; i++) {
    // Distribuir en una cuadrícula con algo de aleatoriedad
    const col = i % 3;
    const row = Math.floor(i / 3);

    const baseX = col * (containerWidth / 3) + 20;
    const baseY = row * 250 + 20;

    // Agregar variación aleatoria
    const x = baseX + (Math.random() - 0.5) * 50;
    const y = baseY + (Math.random() - 0.5) * 50;

    positions.push({ x, y });
  }

  return positions;
}

// Hacer los post-its arrastrables
function makeDraggable() {
  const cards = document.querySelectorAll('.message-card');

  cards.forEach(card => {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = parseInt(card.style.left) || 0;
    let yOffset = parseInt(card.style.top) || 0;

    card.addEventListener('mousedown', dragStart);
    card.addEventListener('touchstart', dragStart);

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);

    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);

    function dragStart(e) {
      if (e.type === 'touchstart') {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
      } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
      }

      if (e.target === card || card.contains(e.target)) {
        isDragging = true;
        card.classList.add('dragging');
      }
    }

    function drag(e) {
      if (isDragging) {
        e.preventDefault();

        if (e.type === 'touchmove') {
          currentX = e.touches[0].clientX - initialX;
          currentY = e.touches[0].clientY - initialY;
        } else {
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        card.style.left = currentX + 'px';
        card.style.top = currentY + 'px';
      }
    }

    function dragEnd(e) {
      if (isDragging) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
        card.classList.remove('dragging');
      }
    }
  });
}

// Sobrescribir displayMessages original - solo vista 3D
window.displayMessages = function () {
  console.log('displayMessages llamado, boardGroup:', !!boardGroup);

  if (boardGroup) {
    update3DBoard();
  } else {
    console.warn('Esperando inicialización de la escena 3D...');
  }
};
