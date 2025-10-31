// Servidor de desarrollo con Hot Reload
const http = require('http');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const PORT = 8000;
const clients = [];

// Tipos MIME
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Crear servidor HTTP
const server = http.createServer((req, res) => {
  // SSE endpoint para hot reload
  if (req.url === '/hot-reload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    
    clients.push(res);
    
    req.on('close', () => {
      const index = clients.indexOf(res);
      if (index !== -1) clients.splice(index, 1);
    });
    
    return;
  }
  
  // Servir archivos estáticos
  let filePath = '.' + req.url;
  if (filePath === './') filePath = './index.html';
  
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404);
        res.end('404 - Archivo no encontrado');
      } else {
        res.writeHead(500);
        res.end('Error del servidor: ' + error.code);
      }
    } else {
      // Inyectar script de hot reload en archivos HTML
      if (extname === '.html') {
        const hotReloadScript = `
          <script>
            const evtSource = new EventSource('/hot-reload');
            evtSource.onmessage = (event) => {
              if (event.data === 'reload') {
                console.log('🔄 Cambios detectados - Recargando...');
                location.reload();
              }
            };
          </script>
        `;
        content = content.toString().replace('</body>', hotReloadScript + '</body>');
      }
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Observar cambios en archivos
const watcher = chokidar.watch(['./**/*.html', './**/*.js', './**/*.css'], {
  ignored: /(^|[\/\\])\../, // Ignorar archivos ocultos
  persistent: true,
  ignoreInitial: true
});

watcher.on('change', (filePath) => {
  console.log(`📝 Cambio detectado en: ${filePath}`);
  
  // Notificar a todos los clientes conectados
  clients.forEach(client => {
    client.write('data: reload\n\n');
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor con Hot Reload corriendo en:`);
  console.log(`   - Local: http://localhost:${PORT}`);
  console.log(`   - Red: http://<tu-ip-local>:${PORT}`);
  console.log(`👀 Observando cambios en archivos HTML, JS y CSS...`);
  console.log(`\n💡 Para ver en tu celular:`);
  console.log(`   1. Conecta tu celular a la misma red WiFi`);
  console.log(`   2. Obtén tu IP con: ipconfig (busca "IPv4")`);
  console.log(`   3. Abre en el celular: http://<tu-ip>:${PORT}\n`);
});
