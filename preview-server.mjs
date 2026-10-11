import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.mp4':'video/mp4'};
const port = Number(process.env.VIZUS_PREVIEW_PORT || 4173);
http.createServer((req,res) => {
  let relative;
  try { relative = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400);res.end();return; }
  if (relative === '/') relative = '/index.html';
  const target = path.resolve(root, '.' + relative);
  if (!target.startsWith(root + path.sep)) { res.writeHead(403);res.end();return; }
  fs.stat(target, (error, stat) => {
    if (error) { res.writeHead(404);res.end('Not found');return; }
    const headers = {'Content-Type':mime[path.extname(target)] || 'application/octet-stream','Cache-Control':'no-store','Accept-Ranges':'bytes'};
    const range = req.headers.range;
    let start = 0, end = stat.size - 1;
    if (range) {
      const match = /^bytes=(\d+)-(\d*)$/.exec(range);
      if (!match) { res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});res.end();return; }
      start = Number(match[1]); end = match[2] ? Math.min(Number(match[2]),end) : end;
      if (start > end || start >= stat.size) { res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});res.end();return; }
      headers['Content-Range'] = `bytes ${start}-${end}/${stat.size}`;
    }
    headers['Content-Length'] = end - start + 1;
    res.writeHead(range ? 206 : 200,headers);
    if (req.method === 'HEAD') res.end(); else fs.createReadStream(target,{start,end}).pipe(res);
  });
}).listen(port,'127.0.0.1', () => process.stdout.write(`Local: http://127.0.0.1:${port}\n`));
