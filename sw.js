(()=>{let a=[],e="";async function c(){let c=await caches.open(e);await c.addAll(a)}async function n(){let a=await caches.keys();await Promise.all(a.map(a=>a!==e&&caches.delete(a)))}a=["/index.html","/favicon.f762af2e.ico","/app-icon.35c3c3c9.png","/app-icon-retina.51343faa.png","/opensearch.f06505b2.xml","/index.c6f4a751.js","/index.9de73743.css"],e="72ee2ba8",addEventListener("install",a=>a.waitUntil(c())),addEventListener("activate",a=>a.waitUntil(n()))})();