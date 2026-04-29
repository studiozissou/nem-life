/**
 * NEM Life — FAQ Accordion
 * Single-open accordion on .faq-card elements.
 * First card open by default. CSS-based height transition.
 */
(() => {
  function init() {
    const cards = document.querySelectorAll('.faq-card');
    if (!cards.length) return;

    function openCard(card) {
      const answer = card.querySelector('.faq_answer-side');
      const line = card.querySelector('.faq_vertical-line');

      card.classList.add('is-open');
      answer.style.height = answer.scrollHeight + 'px';
      if (line) line.style.transform = 'rotate(90deg)';
    }

    function closeCard(card) {
      const answer = card.querySelector('.faq_answer-side');
      const line = card.querySelector('.faq_vertical-line');

      card.classList.remove('is-open');
      answer.style.height = '0px';
      if (line) line.style.transform = 'rotate(0deg)';
    }

    // Apply transitions via JS so they only run after first paint (no flash on load)
    cards.forEach((card) => {
      const answer = card.querySelector('.faq_answer-side');
      const line = card.querySelector('.faq_vertical-line');

      answer.style.overflow = 'hidden';
      answer.style.transition = 'height 350ms ease';
      answer.style.height = '0px';

      if (line) {
        line.style.display = 'inline-block';
        line.style.transition = 'transform 350ms ease';
      }
    });

    // Open the first card immediately (no transition on initial state)
    const first = cards[0];
    const firstAnswer = first.querySelector('.faq_answer-side');
    const firstLine = first.querySelector('.faq_vertical-line');

    first.classList.add('is-open');
    firstAnswer.style.transition = 'none';
    firstAnswer.style.height = firstAnswer.scrollHeight + 'px';
    if (firstLine) firstLine.style.transform = 'rotate(90deg)';

    // Restore transition after paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        firstAnswer.style.transition = 'height 350ms ease';
      });
    });

    // Wire up click handlers
    cards.forEach((card) => {
      const trigger = card.querySelector('.faq_heading-side');
      if (!trigger) return;

      trigger.addEventListener('click', () => {
        const isCardOpen = card.classList.contains('is-open');

        cards.forEach((c) => {
          if (c.classList.contains('is-open')) closeCard(c);
        });

        if (!isCardOpen) openCard(card);
      });
    });
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
