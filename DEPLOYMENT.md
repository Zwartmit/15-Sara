# 🚀 Guía de Despliegue - Netlify

## 📋 Estado Actual
El sitio está configurado para mostrar **proximamente.html** mientras se termina el desarrollo.

## 🔄 Cómo funciona

El archivo `netlify.toml` redirige todas las rutas a `proximamente.html` usando:
```toml
[[redirects]]
  from = "/*"
  to = "/proximamente.html"
  status = 200
  force = true
```

## ✅ Activar el sitio completo

Cuando el proyecto esté listo para lanzarse:

### Opción 1: Eliminar el archivo de configuración
```bash
git rm netlify.toml
git commit -m "Activar sitio completo"
git push origin main
```

### Opción 2: Comentar la redirección
Edita `netlify.toml` y comenta o elimina la sección `[[redirects]]`:
```toml
# [[redirects]]
#   from = "/*"
#   to = "/proximamente.html"
#   status = 200
#   force = true
```

Luego:
```bash
git add netlify.toml
git commit -m "Activar sitio completo"
git push origin main
```

## 🔙 Volver a modo "Próximamente"

Si necesitas volver a mostrar la página temporal:
```bash
git revert HEAD
git push origin main
```

O simplemente restaura el contenido de `netlify.toml` con la redirección.

## 📝 Notas importantes

- Los cambios se aplican automáticamente cuando haces push a GitHub
- Netlify detecta el archivo `netlify.toml` y aplica la configuración
- No necesitas cambiar nada en el panel de Netlify
- El despliegue toma aproximadamente 1-2 minutos

## 🧪 Probar localmente

Para probar el comportamiento de redirección localmente, usa:
```bash
npm start
```

Y navega a cualquier ruta - todas deberían mostrar `proximamente.html`.
