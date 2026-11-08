// Wildbound PWA shim: local-only saves, first-run seed, persistent storage, save transfer, service worker.
(function(){
  var of=window.fetch;window.fetch=function(u,o){var s=typeof u==='string'?u:(u&&u.url)||'';
    if(/_api\//.test(s))return Promise.reject(new Error('offline build: no backend'));return of.apply(this,arguments);};
  var KEYS=['wildbound.save','wildbound.autosave','wildbound.options.v1'];
  try{var seed=window.WB_SEED||{};var empty=!Object.keys(localStorage).some(function(k){return /^wildbound\.(save|autosave)$/.test(k);});
    if(empty&&!localStorage.getItem('wildbound.pwa.seeded')){for(var k in seed)localStorage.setItem(k,seed[k]);localStorage.setItem('wildbound.pwa.seeded','1');}}catch(e){}
  try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist();}catch(e){}
  if('serviceWorker' in navigator)addEventListener('load',function(){navigator.serviceWorker.register('sw.js');});
  function code(){var o={};KEYS.forEach(function(k){var v=localStorage.getItem(k);if(v!==null)o[k]=v;});return 'WB1.'+btoa(unescape(encodeURIComponent(JSON.stringify(o))));}
  function load(c){c=(c||'').trim().replace(/^WB1\./,'');var o=JSON.parse(decodeURIComponent(escape(atob(c))));
    if(!o['wildbound.save']&&!o['wildbound.autosave'])throw new Error('no save in code');for(var k in o)if(KEYS.indexOf(k)>=0)localStorage.setItem(k,o[k]);}
  window.WBTransfer={code:code,load:load};
  addEventListener('DOMContentLoaded',function(){
    var b=document.createElement('button');b.id='wbSaves';b.textContent='SAVES';
    b.style.cssText='position:fixed;top:calc(env(safe-area-inset-top) + 6px);right:8px;z-index:50;font:600 12px system-ui;padding:6px 10px;border-radius:8px;border:1px solid #888;background:#222;color:#eee;display:none';
    document.body.appendChild(b);
    setInterval(function(){b.style.display=(window.WB&&WB.mode==='title')?'block':'none';},500);
    b.onclick=function(){var ch=prompt('IMPORT SAVE: paste a save code and tap OK.\n(Leave empty and tap OK to copy THIS device\'s save code instead.)','');
      if(ch===null)return;if(!ch.trim()){var c=code();try{navigator.clipboard.writeText(c);alert('Save code copied.');}catch(e){prompt('Copy this save code:',c);}return;}
      try{load(ch);alert('Save imported. Restarting.');location.reload();}catch(e){alert('That code did not work: '+e.message);}};
  });
})();
