document.addEventListener("DOMContentLoaded", () => {
  // Подія на клік
  document.addEventListener("click", function (e) {
    const targetElement = e.target;
    if (targetElement.closest(".icon-menu")) {
      document.documentElement.classList.toggle("menu-open");
    }
  });
  // Slider
  const swiperEdits = new Swiper(".edits__slider", {
    // Optional parameters
    loop: true,
    slidesPerView: 3,
    spaceBetween: 40,
    freeMode: true,
    // Navigation arrows
    navigation: {
      nextEl: ".edits__arrow-move",
    },
    breakpoints: {
      320: {
        slidesPerView: 1.7,
        spaceBetween: 20,
      },
      450: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      1200: {
        slidesPerView: 3.28,
        spaceBetween: 40,
      },
    },
  });
});
