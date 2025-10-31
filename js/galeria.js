// ============================================
// GALERÍA CON CLOUDINARY
// ============================================

let uploadedFiles = [];
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CONFIG.cloudinary.cloudName}/upload`;
const CLOUDINARY_FETCH_URL = `https://res.cloudinary.com/${CONFIG.cloudinary.cloudName}/image/upload/`;

// Inicializar galería
function initGallery() {
  document.getElementById('upload-btn').disabled = false;
  loadGalleryFromLocalStorage();
}

// Subir archivos
function uploadFiles() {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.accept = 'image/*,video/*';
  
  input.onchange = async (e) => {
    const files = Array.from(e.target.files);
    await uploadFilesToCloudinary(files);
  };
  
  input.click();
}

// Subir archivos a Cloudinary
async function uploadFilesToCloudinary(files) {
  const uploadStatus = document.getElementById('upload-status');
  uploadStatus.innerHTML = `<p>Subiendo ${files.length} archivo(s)...</p>`;
  
  let uploaded = 0;
  let failed = 0;

  for (const file of files) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CONFIG.cloudinary.uploadPreset);
      formData.append('folder', CONFIG.cloudinary.folder);

      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        uploaded++;
        
        // Guardar info del archivo
        const fileInfo = {
          id: data.public_id,
          url: data.secure_url,
          thumbnail: data.thumbnail_url || data.secure_url,
          type: data.resource_type,
          name: file.name,
          uploadedAt: new Date().toISOString()
        };
        
        uploadedFiles.push(fileInfo);
        saveGalleryToLocalStorage();
        
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
      showNotification('¡Archivos subidos con éxito!', 'success');
      displayGalleryPreview(uploadedFiles);
    } else {
      uploadStatus.innerHTML = `<p class="error">⚠️ ${uploaded} subido(s), ${failed} fallido(s)</p>`;
      showNotification(`${failed} archivos no se pudieron subir`, 'error');
      displayGalleryPreview(uploadedFiles);
    }
  }, 500);
}

// Ver galería completa en Cloudinary (opcional)
function viewGallery() {
  const cloudinaryUrl = `https://cloudinary.com/console/c-${CONFIG.cloudinary.cloudName}/media_library/folders/${CONFIG.cloudinary.folder}`;
  window.open(cloudinaryUrl, '_blank');
}

// Guardar galería en localStorage
function saveGalleryToLocalStorage() {
  localStorage.setItem('sara15_gallery', JSON.stringify(uploadedFiles));
}

// Cargar galería desde localStorage
function loadGalleryFromLocalStorage() {
  const saved = localStorage.getItem('sara15_gallery');
  if (saved) {
    uploadedFiles = JSON.parse(saved);
    displayGalleryPreview(uploadedFiles);
  }
}

// Mostrar preview de archivos
function displayGalleryPreview(files) {
  const galleryGrid = document.getElementById('gallery-grid');
  if (!galleryGrid) return;

  if (files.length === 0) {
    galleryGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">No hay fotos todavía. ¡Sé el primero en subir!</p>';
    return;
  }

  galleryGrid.innerHTML = files.map(file => {
    const isImage = file.type === 'image';
    const isVideo = file.type === 'video';
    const thumbnailUrl = isImage ? file.url.replace('/upload/', '/upload/w_400,h_400,c_fill/') : file.url;
    
    return `
      <div class="gallery-item glass">
        ${isImage ? `<img src="${thumbnailUrl}" alt="${file.name}" loading="lazy">` : ''}
        ${isVideo ? `<div class="video-placeholder">🎥<br>${file.name}</div>` : ''}
        <div class="gallery-item-overlay">
          <a href="${file.url}" target="_blank" class="btn-primary btn-small">Ver</a>
        </div>
      </div>
    `;
  }).join('');
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
