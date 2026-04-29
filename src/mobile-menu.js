/**
 * NEM Life — Mobile Menu
 * Hamburger toggle with staggered nav item animation.
 * X icon = top line 45deg + middle -45deg, bottom hides.
 */
(() => {
  const DURATION = 350;
  const STAGGER_STEP = 80;

  const mq = window.matchMedia('(max-width: 991px)');
  const isMobile = () => mq.matches;

  const menuButton = document.querySelector('.menu-button');
  const menuBlur = document.querySelector('.menu-blur');
  const menuWrap = document.querySelector('.menu-wrap');
  const navWrap = document.querySelector('.menu_navigation-wrap');
  const buttonWrap = document.querySelector('.menu_button-wrap');
  const lineTop = document.querySelector('.menu-line--top');
  const lineMiddle = document.querySelector('.menu-line--middle');
  const lineBottom = document.querySelector('.menu-line--bottom');

  let isOpen = false;
  let staggerTimers = [];

  function clearStaggerTimers() {
    staggerTimers.forEach(clearTimeout);
    staggerTimers = [];
  }

  function reflow(el) {
    void el.offsetHeight;
  }

  function resetToCSS() {
    isOpen = false;
    clearStaggerTimers();
    document.body.style.overflow = '';

    const staggerEls = navWrap ? [...navWrap.children] : [];
    if (buttonWrap) staggerEls.push(buttonWrap);

    [menuBlur, menuWrap, lineTop, lineMiddle, lineBottom, ...staggerEls].forEach((el) => {
      if (el) el.removeAttribute('style');
    });
  }

  function setupMobileStyles() {
    const ease = `${DURATION}ms ease`;

    if (lineTop) {
      lineTop.style.transition = `transform ${ease}`;
      lineTop.style.transform = 'translateY(-0.3125rem) rotate(0deg)';
      lineTop.style.opacity = '1';
    }
    if (lineMiddle) {
      lineMiddle.style.transition = `transform ${ease}`;
      lineMiddle.style.transform = 'translateY(0) rotate(0deg)';
      lineMiddle.style.opacity = '1';
    }
    if (lineBottom) {
      lineBottom.style.transition = `transform ${ease}, opacity ${ease}`;
      lineBottom.style.transform = 'translateY(0.3125rem)';
      lineBottom.style.opacity = '1';
    }

    menuBlur.style.cssText = `opacity:0; transition:opacity ${DURATION}ms ease; display:none;`;
    menuWrap.style.cssText = `opacity:0; transition:opacity ${DURATION}ms ease; display:none;`;
  }

  function setLinesOpen(open) {
    if (open) {
      if (lineTop) lineTop.style.transform = 'translateY(0) rotate(45deg)';
      if (lineMiddle) lineMiddle.style.transform = 'translateY(0) rotate(-45deg)';
      if (lineBottom) {
        lineBottom.style.opacity = '0';
        lineBottom.style.transform = 'translateY(0.3125rem)';
      }
    } else {
      if (lineTop) lineTop.style.transform = 'translateY(-0.3125rem) rotate(0deg)';
      if (lineMiddle) lineMiddle.style.transform = 'translateY(0) rotate(0deg)';
      if (lineBottom) {
        lineBottom.style.opacity = '1';
        lineBottom.style.transform = 'translateY(0.3125rem)';
      }
    }
  }

  function openMenu() {
    isOpen = true;
    document.body.style.overflow = 'hidden';
    setLinesOpen(true);

    menuBlur.style.display = 'block';
    reflow(menuBlur);
    menuBlur.style.opacity = '1';

    menuWrap.style.display = 'flex';
    reflow(menuWrap);
    menuWrap.style.opacity = '1';

    const navItems = navWrap ? [...navWrap.children] : [];
    const allStagger = buttonWrap ? [...navItems, buttonWrap] : [...navItems];

    allStagger.forEach((el) => {
      el.style.transition = 'none';
      el.style.opacity = '0';
      el.style.transform = 'translateY(1.25rem)';
    });

    navItems.forEach((item, i) => {
      const t = setTimeout(() => {
        item.style.transition = `opacity ${DURATION}ms ease, transform ${DURATION}ms ease`;
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, i * STAGGER_STEP);
      staggerTimers.push(t);
    });

    if (buttonWrap) {
      const t = setTimeout(() => {
        buttonWrap.style.transition = `opacity ${DURATION}ms ease, transform ${DURATION}ms ease`;
        buttonWrap.style.opacity = '1';
        buttonWrap.style.transform = 'translateY(0)';
      }, navItems.length * STAGGER_STEP);
      staggerTimers.push(t);
    }
  }

  function closeMenu() {
    isOpen = false;
    clearStaggerTimers();
    document.body.style.overflow = '';
    setLinesOpen(false);

    const navItems = navWrap ? [...navWrap.children] : [];
    let step = 0;

    if (buttonWrap) {
      const t = setTimeout(() => {
        buttonWrap.style.transition = `opacity ${DURATION}ms ease, transform ${DURATION}ms ease`;
        buttonWrap.style.opacity = '0';
        buttonWrap.style.transform = 'translateY(1.25rem)';
      }, step * STAGGER_STEP);
      staggerTimers.push(t);
      step++;
    }

    [...navItems].reverse().forEach((item) => {
      const t = setTimeout(() => {
        item.style.transition = `opacity ${DURATION}ms ease, transform ${DURATION}ms ease`;
        item.style.opacity = '0';
        item.style.transform = 'translateY(1.25rem)';
      }, step * STAGGER_STEP);
      staggerTimers.push(t);
      step++;
    });

    const totalStaggerDuration = step * STAGGER_STEP;

    const fadeOut = setTimeout(() => {
      menuBlur.style.opacity = '0';
      menuWrap.style.opacity = '0';

      setTimeout(() => {
        if (!isOpen) {
          menuBlur.style.display = 'none';
          menuWrap.style.display = 'none';
        }
      }, DURATION);
    }, totalStaggerDuration);

    staggerTimers.push(fadeOut);
  }

  function toggle() {
    isOpen ? closeMenu() : openMenu();
  }

  function init() {
    if (isMobile()) setupMobileStyles();

    menuButton.addEventListener('click', () => {
      if (!isMobile()) return;
      toggle();
    });
    menuBlur.addEventListener('click', () => {
      if (isMobile() && isOpen) closeMenu();
    });

    document.querySelectorAll('.navlink, .button').forEach((el) => {
      el.addEventListener('click', () => {
        if (isMobile() && isOpen) closeMenu();
      });
    });

    mq.addEventListener('change', (e) => {
      if (!e.matches) resetToCSS();
      else setupMobileStyles();
    });
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
