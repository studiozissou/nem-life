/**
 * NEM Life — SVG Inline
 * Fetches SVG images inside .svg-fetch .i-100 and replaces <img> with inline <svg>.
 * Applies currentColor to fills/strokes for CSS colour inheritance.
 */
(() => {
  const SEL = '.svg-fetch .i-100';
  const done = new WeakSet();

  const isSvg = (src) => {
    if (!src) return false;
    return src.split('?')[0].split('#')[0].toLowerCase().endsWith('.svg');
  };

  const toInline = async (img) => {
    if (done.has(img)) return;
    const src = img.getAttribute('src');
    if (!isSvg(src)) return;

    done.add(img);

    try {
      const res = await fetch(src);
      if (!res.ok) return;

      const txt = await res.text();
      const doc = new DOMParser().parseFromString(txt, 'image/svg+xml');
      const svg = doc.querySelector('svg');
      if (!svg) return;

      const inline = document.importNode(svg, true);

      const cls = img.getAttribute('class');
      if (cls) inline.setAttribute('class', cls);

      const alt = img.getAttribute('alt');
      if (alt) {
        inline.setAttribute('aria-label', alt);
        inline.setAttribute('role', 'img');
      } else {
        inline.setAttribute('aria-hidden', 'true');
      }

      inline.style.width = '100%';
      inline.style.height = '100%';
      inline.style.display = 'block';

      const replaceColor = (el) => {
        if (el.hasAttribute('fill') && el.getAttribute('fill') !== 'none') el.setAttribute('fill', 'currentColor');
        if (el.hasAttribute('stroke') && el.getAttribute('stroke') !== 'none') el.setAttribute('stroke', 'currentColor');
      };

      replaceColor(inline);
      inline.querySelectorAll('[fill], [stroke]').forEach(replaceColor);

      img.replaceWith(inline);
    } catch (e) {
      console.error('SVG Inline Error:', e);
    }
  };

  const run = () => document.querySelectorAll(SEL).forEach(toInline);

  const init = () => {
    run();
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) run();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
