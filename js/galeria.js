// ============================================
// GALERÍA CON CLOUDINARY
// ============================================

let uploadedFiles = [];
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CONFIG.cloudinary.cloudName}/upload`;
const CLOUDINARY_FETCH_URL = `https://res.cloudinary.com/${CONFIG.cloudinary.cloudName}/image/upload/`;

// Inicializar galería
function initGallery() {
  document.getElementById('upload-btn').disabled = false;
  loadGalleryFromCloudinary();
}

// Subir archivos (solo imágenes)
function uploadFiles() {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.accept = 'image/*';

  input.onchange = async (e) => {
    const files = Array.from(e.target.files);

    // Validar que todos los archivos sean imágenes
    const validFiles = [];
    const invalidFiles = [];

    files.forEach(file => {
      // Verificar tipo MIME
      if (file.type.startsWith('image/')) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file);
      }
    });

    // Notificar sobre archivos no válidos
    if (invalidFiles.length > 0) {
      const fileNames = invalidFiles.map(f => f.name).join(', ');
      const fileTypes = invalidFiles.map(f => {
        if (f.type.startsWith('video/')) return 'video';
        if (f.type.startsWith('audio/')) return 'audio';
        return 'archivo no permitido';
      }).join(', ');
    }

    // Subir solo los archivos válidos
    if (validFiles.length > 0) {
      await uploadFilesToCloudinary(validFiles);
    } else if (invalidFiles.length > 0) {
      // Si no hay archivos válidos, mostrar mensaje adicional
      document.getElementById('upload-status').innerHTML =
        '<p class="error">❌ Solo se permiten imágenes.</p>';
    }
  };

  input.click();
}

// Subir archivos a Cloudinary
async function uploadFilesToCloudinary(files) {
  const uploadStatus = document.getElementById('upload-status');
  uploadStatus.innerHTML = `<p>Subiendo ${files.length} archivo(s). Por favor, espera un momento.</p>`;

  let uploaded = 0;
  let failed = 0;

  for (const file of files) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CONFIG.cloudinary.uploadPreset);
      formData.append('folder', CONFIG.cloudinary.folder);
      formData.append('tags', 'sara_15_gallery'); // Tag para agrupar fotos
      formData.append('context', `original_name=${file.name}`); // Guardar nombre original

      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        uploaded++;
        uploadStatus.innerHTML = `<p class="success">✅ Subiendo... ${uploaded}/${files.length}</p>`;
      } else {
        failed++;
        console.error('Error uploading file:', file.name, await response.text());
      }
    } catch (error) {
      failed++;
      console.error('Error:', error);
    }
  }

  setTimeout(() => {
    if (failed === 0) {
      uploadStatus.innerHTML = `<p class="success">🎉 ¡${uploaded} archivo(s) subido(s) exitosamente!</p>`;
      // Recargar la galería desde el servidor para ver las nuevas fotos
      setTimeout(loadGalleryFromCloudinary, 1000);
    } else {
      uploadStatus.innerHTML = `<p class="error">⚠️ ${uploaded} subido(s), ${failed} fallido(s)</p>`;
      setTimeout(loadGalleryFromCloudinary, 1000);
    }
  }, 500);
}

// Ver galería completa en Cloudinary (opcional)
function viewGallery() {
  const cloudinaryUrl = `https://cloudinary.com/console/c-${CONFIG.cloudinary.cloudName}/media_library/folders/${CONFIG.cloudinary.folder}`;
  window.open(cloudinaryUrl, '_blank');
}

// Cargar galería desde Cloudinary (Lista JSON)
async function loadGalleryFromCloudinary() {
  const galleryGrid = document.getElementById('gallery-grid');

  try {
    // URL de la lista de recursos (JSON)
    // Se agrega un timestamp para evitar caché
    const listUrl = `https://res.cloudinary.com/${CONFIG.cloudinary.cloudName}/image/list/sara_15_gallery.json?t=${new Date().getTime()}`;

    const response = await fetch(listUrl);

    if (response.ok) {
      const data = await response.json();

      // Mapear los recursos al formato de nuestra aplicación
      uploadedFiles = data.resources.map(resource => {
        return {
          id: resource.public_id,
          // Construir URL segura
          url: `https://res.cloudinary.com/${CONFIG.cloudinary.cloudName}/image/upload/v${resource.version}/${resource.public_id}.${resource.format}`,
          thumbnail: `https://res.cloudinary.com/${CONFIG.cloudinary.cloudName}/image/upload/c_thumb,w_200,g_face/v${resource.version}/${resource.public_id}.${resource.format}`,
          type: resource.type,
          name: resource.context?.custom?.original_name || `Foto ${resource.public_id}`,
          uploadedAt: resource.created_at
        };
      });

      // Ordenar por fecha (más recientes primero)
      uploadedFiles.sort((a, b) => {
        return new Date(b.uploadedAt) - new Date(a.uploadedAt);
      });

      displayGalleryPreview(uploadedFiles);
    } else {
      // Si falla (ej. 404 porque no hay lista aún o permisos restringidos), mostrar vacío o error silencioso
      console.log('No se pudo cargar la lista de imágenes (puede que esté vacía o restringida).');
      uploadedFiles = [];
      displayGalleryPreview([]);

      // Intentar cargar de localStorage como respaldo temporal si falla Cloudinary
      const saved = localStorage.getItem('sara15_gallery');
      if (saved) {
        console.log('Cargando respaldo local...');
        uploadedFiles = JSON.parse(saved);
        displayGalleryPreview(uploadedFiles);
      }
    }
  } catch (error) {
    console.error('Error cargando galería:', error);
    displayGalleryPreview([]);
  }
}

// Verificar si una imagen existe en Cloudinary
async function checkIfImageExists(url) {
  try {
    // Crear promise con timeout de 5 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors' // Evitar problemas de CORS
    });

    clearTimeout(timeoutId);

    // Con no-cors, response.ok siempre es false, así que verificamos response.type
    // Si es 'opaque', la imagen existe pero CORS bloqueó la respuesta
    return response.type === 'opaque' || response.ok;
  } catch (error) {
    // Si es un error de abort (timeout) o red, asumir que no existe
    console.log('Error verificando imagen:', url, error.message);
    return false;
  }
}

// Variables globales para el grid paginado
let currentPage = 0;
const PHOTOS_PER_PAGE = 6;

// Mostrar preview de archivos en grid paginado
function displayGalleryPreview(files) {
  const galleryGrid = document.getElementById('gallery-grid');
  const galleryPagination = document.getElementById('gallery-pagination');
  const downloadAllBtn = document.getElementById('download-all-btn');

  if (!galleryGrid) return;

  if (files.length === 0) {
    galleryGrid.innerHTML = '<p style="text-align:center; padding: 40px; grid-column: 1 / -1;">No hay fotos aún. ¡Sé el primero en compartir! 📸</p>';
    galleryPagination.innerHTML = '';
    if (downloadAllBtn) downloadAllBtn.style.display = 'none';
    return;
  }

  // Mostrar botón de descarga masiva si hay fotos
  if (downloadAllBtn) downloadAllBtn.style.display = 'inline-block';

  // Calcular paginación
  const totalPages = Math.ceil(files.length / PHOTOS_PER_PAGE);
  const startIndex = currentPage * PHOTOS_PER_PAGE;
  const endIndex = Math.min(startIndex + PHOTOS_PER_PAGE, files.length);
  const currentPhotos = files.slice(startIndex, endIndex);

  // Crear grid de fotos
  galleryGrid.innerHTML = currentPhotos.map((file, index) => {
    const globalIndex = startIndex + index;
    const imageUrl = file.url.replace('/upload/', '/upload/w_600,h_600,c_fill/');

    return `
      <div class="gallery-item" onclick="viewFullImage('${file.url}', '${file.name}')" data-file-id="${file.id}">
        <img src="${imageUrl}" 
             alt="${file.name}" 
             loading="lazy"
             onerror="handleBrokenImage('${file.id}', this)">
        <div class="gallery-item-overlay">
          <button class="gallery-download-btn" onclick="event.stopPropagation(); downloadImage('${file.url}', '${file.name}')">
            📥 Descargar
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Crear controles de paginación
  if (totalPages > 1) {
    let paginationHTML = `
      <button class="pagination-btn" onclick="changePage(-1)" ${currentPage === 0 ? 'disabled' : ''}>
        ◀ Anterior
      </button>
      <span class="pagination-info">
        Página ${currentPage + 1} de ${totalPages} (${files.length} fotos)
      </span>
      <button class="pagination-btn" onclick="changePage(1)" ${currentPage === totalPages - 1 ? 'disabled' : ''}>
        Siguiente ▶
      </button>
    `;
    galleryPagination.innerHTML = paginationHTML;
  } else {
    galleryPagination.innerHTML = `<span class="pagination-info">${files.length} foto${files.length > 1 ? 's' : ''}</span>`;
  }
}

// Manejar imágenes rotas (eliminadas de Cloudinary)
function handleBrokenImage(fileId, imgElement) {
  console.log('Imagen rota detectada:', fileId);

  // Eliminar del array uploadedFiles
  const index = uploadedFiles.findIndex(f => f.id === fileId);
  if (index !== -1) {
    uploadedFiles.splice(index, 1);
    // saveGalleryToLocalStorage(); // Eliminado porque ya no usamos localStorage

    // Ocultar el elemento roto inmediatamente con animación
    const galleryItem = imgElement.closest('.gallery-item');
    if (galleryItem) {
      galleryItem.style.transition = 'opacity 0.3s ease';
      galleryItem.style.opacity = '0';

      setTimeout(() => {
        // Recalcular la página actual si es necesario
        const totalPages = Math.ceil(uploadedFiles.length / PHOTOS_PER_PAGE);
        if (currentPage >= totalPages && currentPage > 0) {
          currentPage = totalPages - 1;
        }

        // Actualizar la galería
        displayGalleryPreview(uploadedFiles);
      }, 300);
    }
  }
}

// Cambiar de página
function changePage(direction) {
  const totalPages = Math.ceil(uploadedFiles.length / PHOTOS_PER_PAGE);
  currentPage = Math.max(0, Math.min(currentPage + direction, totalPages - 1));
  displayGalleryPreview(uploadedFiles);

  // Scroll suave hasta la galería
  document.getElementById('gallery-grid').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Ver imagen en pantalla completa
function viewFullImage(url, name) {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    cursor: zoom-out;
  `;

  const img = document.createElement('img');
  img.src = url;
  img.style.cssText = `
    max-width: 95%;
    max-height: 95%;
    object-fit: contain;
    border-radius: 10px;
  `;

  modal.appendChild(img);
  modal.onclick = () => modal.remove();

  document.body.appendChild(modal);
}

// Descargar imagen
async function downloadImage(url, filename) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename || 'foto-sara-15.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Liberar el objeto URL
    window.URL.revokeObjectURL(blobUrl);

  } catch (error) {
    console.error('Error descargando imagen:', error);
    showNotification('Error al descargar la foto', 'error');
  }
}

// Descargar todas las imágenes en un archivo ZIP
async function downloadAllImages() {
  if (uploadedFiles.length === 0) {
    showNotification('No hay fotos para descargar', 'error');
    return;
  }

  try {
    showNotification('Preparando descarga... 📦', 'info', 'download-progress');

    const zip = new JSZip();
    const folder = zip.folder('Fotos-Sara-15-Anos');

    // Descargar todas las imágenes y agregarlas al ZIP
    let completed = 0;
    for (const file of uploadedFiles) {
      try {
        const response = await fetch(file.url);
        const blob = await response.blob();

        // Generar nombre único para cada archivo
        const extension = file.name.split('.').pop() || 'jpg';
        const filename = `foto-${completed + 1}.${extension}`;

        folder.file(filename, blob);
        completed++;

        // Actualizar progreso usando el mismo ID de notificación
        showNotification(`Espera un momento... ${completed}/${uploadedFiles.length}`, 'info', 'download-progress');
      } catch (error) {
        console.error('Error descargando:', file.name, error);
      }
    }

    if (completed === 0) {
      closeNotification('download-progress');
      showNotification('No se pudieron descargar las fotos', 'error');
      return;
    }

    // Actualizar mensaje antes de generar ZIP
    showNotification('Generando archivo ZIP...', 'info', 'download-progress');
    const content = await zip.generateAsync({ type: 'blob' });

    // Descargar el archivo
    const blobUrl = window.URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `Fotos-Sara-15-Anos-${new Date().toISOString().split('T')[0]}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

    // Cerrar notificación de progreso y mostrar éxito
    closeNotification('download-progress');
  } catch (error) {
    console.error('Error creando ZIP:', error);
    closeNotification('download-progress');
    showNotification('Error al crear el archivo ZIP', 'error');
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  initGallery();

  // Ocultar advertencia de configuración si existe
  const warning = document.getElementById('config-warning');
  if (warning) {
    warning.style.display = 'none';
  }
});
