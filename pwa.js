// Wildbound PWA shim: local-only saves, first-run seed, persistent storage, save transfer, service worker.
(function(){
  var of=window.fetch;window.fetch=function(u,o){var s=typeof u==='string'?u:(u&&u.url)||'';
    if(/_api\//.test(s))return Promise.reject(new Error('offline build: no backend'));return of.apply(this,arguments);};
  var KEYS=['wildbound.save','wildbound.autosave','wildbound.options.v1'];
  try{var seed=window.WB_SEED||{};var empty=!Object.keys(localStorage).some(function(k){return /^wildbound\.(save|autosave)$/.test(k);});
    if(empty&&!localStorage.getItem('wildbound.pwa.seeded')){for(var k in seed)localStorage.setItem(k,seed[k]);localStorage.setItem('wildbound.pwa.seeded','1');}}catch(e){}
  try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist();}catch(e){}
  if('serviceWorker' in navigator)addEventListener('load',function(){navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).then(function(r){r.update();});var had=!!navigator.serviceWorker.controller,done=false;navigator.serviceWorker.addEventListener('controllerchange',function(){if(had&&!done){done=true;location.reload();}});});
  function code(){var o={};KEYS.forEach(function(k){var v=localStorage.getItem(k);if(v!==null)o[k]=v;});return 'WB1.'+btoa(unescape(encodeURIComponent(JSON.stringify(o))));}
  function load(c){c=(c||'').trim().replace(/^WB1\./,'');var o=JSON.parse(decodeURIComponent(escape(atob(c))));
    if(!o['wildbound.save']&&!o['wildbound.autosave'])throw new Error('no save in code');for(var k in o)if(KEYS.indexOf(k)>=0)localStorage.setItem(k,o[k]);}
  window.WBTransfer={code:code,load:load};

})();
