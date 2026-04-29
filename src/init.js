/* =========================================
   NEM Life — Initialization Loader
   Loads CSS + JS modules from CDN or local dev server.
   ========================================= */
(function() {
  'use strict';

  var INIT_SCRIPT_SRC = (document.currentScript && document.currentScript.src) || '';

  // Source-switch: ?dev=on persists to localStorage; ?dev=off clears it
  // Optional: ?dev-port=XXXX persists the local server port (default 8080)
  (function() {
    try {
      var params = new URLSearchParams(window.location.search);
      var dev = params.get('dev');
      if (dev === 'on') localStorage.setItem('nem-dev', 'local');
      else if (dev === 'off') { localStorage.removeItem('nem-dev'); localStorage.removeItem('nem-port'); }
      var port = params.get('dev-port');
      if (port && /^\d{4,5}$/.test(port)) localStorage.setItem('nem-port', port);
    } catch(e) { /* storage blocked */ }
  })();

  var CONFIG = {
    version: '2026.4.29.1',
    baseUrlTemplate: 'https://cdn.jsdelivr.net/gh/studiozissou/nem-life@COMMIT/src',

    // CSS (loaded before JS)
    css: [
      'global.css'
    ],

    // JS modules (loaded in order)
    modules: [
      'blog-share.js',
      'back-to-top.js'
    ]
  };

  function loadStylesheet(href) {
    return new Promise(function(resolve, reject) {
      var existing = document.querySelector('link[href="' + href + '"]');
      if (existing) { resolve(); return; }
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resolve;
      link.onerror = function() { reject(new Error('CSS failed: ' + href)); };
      document.head.appendChild(link);
    });
  }

  function loadScript(src) {
    return new Promise(function(resolve, reject) {
      var existing = document.querySelector('script[src="' + src + '"]');
      if (existing) { resolve(); return; }
      var script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = resolve;
      script.onerror = function() { reject(new Error('Script failed: ' + src)); };
      document.head.appendChild(script);
    });
  }

  function getBaseUrl() {
    // Inline override (e.g. for ngrok on mobile)
    if (window.__NEM_BASE) return window.__NEM_BASE;

    try {
      if (localStorage.getItem('nem-dev') === 'local') {
        var port = localStorage.getItem('nem-port') || '8080';
        return 'https://localhost:' + port + '/src';
      }
    } catch(e) { /* localStorage blocked */ }

    var scriptSrc = INIT_SCRIPT_SRC;

    // Local dev detection
    var isLocal = scriptSrc && (
      /^(https?:)?\/\/localhost(:\d+)?(\/|$)/i.test(scriptSrc) ||
      /^file:\/\//i.test(scriptSrc) ||
      /\.ngrok-free\.dev(\/|$)/i.test(scriptSrc) ||
      (!scriptSrc.includes('@') && scriptSrc.indexOf(window.location.origin) === 0)
    );
    if (isLocal) {
      return scriptSrc.replace(/\?.*$/, '').replace(/\/[^/]*$/, '');
    }

    // CDN: extract commit hash from script URL
    var match = scriptSrc.match(/@([a-f0-9]{7,40})(?:\/|$)/i);
    var commit = match ? match[1] : 'main';
    return CONFIG.baseUrlTemplate.replace('COMMIT', commit);
  }

  async function init() {
    try {
      var baseUrl = getBaseUrl();
      var versionParam = 'v=' + CONFIG.version;

      var isDevMode = /localhost(:\d+)?(\/|$)/i.test(baseUrl) || /\.ngrok-free\.dev(\/|$)/i.test(baseUrl);
      if (isDevMode) {
        console.log('%c[NEM] DEV MODE — ' + baseUrl, 'color: #7B8F3C; font-weight: bold');
        var dot = document.createElement('div');
        dot.style.cssText = 'position:fixed;top:8px;left:8px;width:10px;height:10px;background:#7B8F3C;border-radius:50%;z-index:99999;pointer-events:none;opacity:0.8';
        document.body.appendChild(dot);
      } else {
        var commitMatch = baseUrl.match(/@([a-f0-9]{7,40})/i);
        console.log('%c[NEM] CDN' + (commitMatch ? ' @' + commitMatch[1] : ''), 'color: #7B8F3C; font-weight: bold');
      }

      // Load CSS
      for (var i = 0; i < CONFIG.css.length; i++) {
        await loadStylesheet(baseUrl + '/' + CONFIG.css[i] + '?' + versionParam);
      }

      // Load JS modules
      for (var j = 0; j < CONFIG.modules.length; j++) {
        await loadScript(baseUrl + '/' + CONFIG.modules[j] + '?' + versionParam);
      }

      console.log('[NEM] v' + CONFIG.version + ' — ' + CONFIG.modules.length + ' modules loaded');
    } catch (error) {
      console.error('[NEM] Load error:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
