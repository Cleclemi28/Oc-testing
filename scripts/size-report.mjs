import fs from 'node:fs';
import zlib from 'node:zlib';

for (const file of ['dist/index.html']) {
  const buf = fs.readFileSync(file);
  console.log(
    file,
    'raw:',
    buf.length,
    'gzip:',
    zlib.gzipSync(buf, { level: 9 }).length,
    'brotli:',
    zlib.brotliCompressSync(buf).length
  );
}
