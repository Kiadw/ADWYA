const fs = require('fs');
const pako = require('pako');

function encode(code) {
  const data = JSON.stringify({ code: code, mermaid: { theme: 'default' } });
  const compressed = pako.deflate(data, { level: 9 });
  return Buffer.from(compressed).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
}

const text1 = fs.readFileSync('diagram1.mmd', 'utf8');
const text2 = fs.readFileSync('diagram2.mmd', 'utf8');

const url1 = `https://mermaid.ink/svg/pako:${encode(text1)}`;
const url2 = `https://mermaid.ink/svg/pako:${encode(text2)}`;

console.log("Diagram 1 URL:", url1);
console.log("Diagram 2 URL:", url2);

const https = require('https');
https.get(url1, res => res.pipe(fs.createWriteStream('public/architecture-system.svg')));
https.get(url2, res => res.pipe(fs.createWriteStream('public/architecture-ai.svg')));
