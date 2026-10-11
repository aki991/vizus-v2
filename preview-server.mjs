import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
const port = Number(process.env.VIZUS_PREVIEW_PORT || 4173);
http.createServer((req,res) => {
  let relative;
  try { relative = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400);res.end();return; }
  if (relative === '/') relative = '/index.html';
  const target = path.resolve(root, '.' + relative);
  if (!target.startsWith(root + path.sep)) { res.writeHead(403);res.end();return; }
  fs.readFile(target, (error, data) => {
    if (error) { res.writeHead(404);res.end('Not found');return; }
    res.writeHead(200, {'Content-Type':mime[path.extname(target)] || 'application/octet-stream', 'Cache-Control':'no-store'});res.end(data);
  });
}).listen(port,'127.0.0.1', () => process.stdout.write(`Local: http://127.0.0.1:${port}\n`));
