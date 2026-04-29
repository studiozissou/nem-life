/**
 * NEM Life — Swiper Instances
 * Hero slider (fade, autoplay) + Articles slider (multi-slide, navigation).
 */
(() => {
  const heroEl = document.querySelector('.swiper.is--hero');
  if (heroEl) {
    new Swiper('.swiper.is--hero', {
      direction: 'horizontal',
      loop: true,
      slidesPerView: 1,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      autoplay: { delay: 6000 },
      pagination: {
        el: '.hero-pagination',
        bulletClass: 'hero_pagination-dot',
        bulletActiveClass: 'is--active',
        clickable: true,
      },
    });
  }

  const articlesEl = document.querySelector('.swiper.articles');
  if (articlesEl) {
    new Swiper('.swiper.articles', {
      direction: 'horizontal',
      loop: false,
      slidesPerView: 'auto',
      spaceBetween: 24,
      breakpoints: {
        991: {
          slidesPerView: 3,
          spaceBetween: 44,
        },
      },
      pagination: {
        el: '.articles_pagination-wrap',
        bulletClass: 'articles_pagination-dot',
        bulletActiveClass: 'is--active',
        clickable: true,
      },
      navigation: {
        nextEl: '.articles--next',
        prevEl: '.articles--prev',
        disabledClass: 'is--disabled',
      },
    });
  }
})();
