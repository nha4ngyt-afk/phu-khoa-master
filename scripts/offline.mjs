import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
function walk(d) {
  return fs
    .readdirSync(d, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)],
    );
}
const files = walk("dist")
  .map((p) => p.replace(/^dist\//, ""))
  .filter((p) => p !== "sw.js");
const version = crypto
  .createHash("sha256")
  .update(files.map((f) => fs.readFileSync("dist/" + f)).join(""))
  .digest("hex")
  .slice(0, 12);
const script = `const CACHE='phu-khoa-${version}';const FILES=${JSON.stringify(files)};self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new URL(f,self.registration.scope).href))));});self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('phu-khoa-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith(caches.open(CACHE).then(async c=>{const cached=await c.match(e.request,{ignoreSearch:true});if(cached)return cached;try{return await fetch(e.request);}catch(err){if(e.request.mode==='navigate')return await c.match(new URL('index.html',self.registration.scope).href);throw err;}}));});`;
fs.writeFileSync("dist/sw.js", script);
console.log(`Offline cache: ${files.length} tệp, ${version}`);
