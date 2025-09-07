document.addEventListener("click", function (e) {
  const targetElement = e.target;
  if (targetElement.closest(".menu-icon")) {
    document.documentElement.classList.toggle("menu-open");
  }
});
// Плавна поява контента при завантажені сторінки
document.addEventListener("DOMContentLoaded", function () {
  const listItems = document.querySelectorAll(
    ".hero__container, .downloading__list,.explore__image, .library__container, .partners__items, .reviews__container, .try-free__container"
  );
  const observerOptions = {
    root: null, // Обсервація в контексті viewport
    rootMargin: "0px",
    threshold: 0.1, // Відсоток видимості елементу для запуску callback
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible"); // Додає можливість зникнення видимості
      }
    });
  };
  /*
якщо потрібно лише один раз обсервувати
const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Припинення обсервації після досягнення видимості
        }
    });
}*/
  const observer = new IntersectionObserver(observerCallback, observerOptions);

  listItems.forEach((item) => {
    observer.observe(item);
  });
});

// Слайдер ==============================================================================================================
// Функція для оновлення Swiper
function updateSwiper(slider) {
  slider.update();
  slider.pagination.render();
  slider.pagination.update();
}
// Функція ініціалізації Swiper
function initSwipers() {
  return {
    games: new Swiper(".games", {
      slidesPerView: 3,
      spaceBetween: 30,
      freeMode: true,
      slideToClickedSlide: true,
      speed: 800,
      pagination: {
        el: ".tabs__pagination", // Одна пагінація на обидва слайдери
        clickable: true,
        renderBullet: function (index, className) {
          return '<span class="' + className + '">' + (index + 1) + "</span>";
        },
      },
      breakpoints: {
        // when window width is >= 320px
        320: {
          slidesPerView: 1.05,
          spaceBetween: 20,
        },
        // when window width is >= 480px
        550: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        // when window width is >= 640px
        990: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    }),
    practice: new Swiper(".practice", {
      slidesPerView: 3,
      spaceBetween: 30,
      freeMode: true,
      slideToClickedSlide: true,
      speed: 800,
      pagination: {
        el: ".tabs__pagination", // Та ж сама пагінація
        clickable: true,
        renderBullet: function (index, className) {
          return '<span class="' + className + '">' + (index + 1) + "</span>";
        },
      },
      breakpoints: {
        // when window width is >= 320px
        320: {
          slidesPerView: 1.05,
          spaceBetween: 20,
        },
        // when window width is >= 480px
        550: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        // when window width is >= 640px
        990: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    }),
  };
}
// Ініціалізація слайдерів
const sliders = initSwipers();
// Функція для перемикання табів та оновлення активного слайдера
function initTabs(tabsBlock) {
  const tabsTitles = tabsBlock.querySelectorAll("[data-tabs-titles]>*");
  const tabsContent = tabsBlock.querySelectorAll("[data-tabs-body]>*");

  // Початкове налаштування
  tabsTitles[0].classList.add("_tab-active");
  tabsContent.forEach((content, index) => {
    content.hidden = index !== 0;
  });

  // Оновлення пагінації для першого активного слайдера
  updateSwiper(sliders.games);
  // Обробник кліків по табах
  tabsTitles.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      tabsTitles.forEach((title) => title.classList.remove("_tab-active"));
      tabsContent.forEach((content) => (content.hidden = true));
      tab.classList.add("_tab-active");
      tabsContent[index].hidden = false;

      // Оновлення пагінації для активного слайдера
      if (index === 0) {
        sliders.games.slideTo(0, 800);
        updateSwiper(sliders.games);
      } else {
        sliders.practice.slideTo(0, 800);
        updateSwiper(sliders.practice);
      }
    });
  });
}
// Виклик функції ініціалізації табів
const tabsBlock = document.querySelector("[data-tabs]");
if (tabsBlock) {
  initTabs(tabsBlock);
}

// Модуль роботи зі спойлерами =======================================================================================================================================================================================================================

// Визначення функції dataMediaQueries
function dataMediaQueries(itemsArray, dataAttr) {
  const mdQueries = [];
  itemsArray.forEach((item) => {
    const dataValue = item.dataset[dataAttr];
    if (dataValue) {
      const params = dataValue.split(",");
      mdQueries.push({
        matchMedia: window.matchMedia(params[0]),
        itemsArray: itemsArray,
      });
    }
  });
  return mdQueries;
}
function _slideToggle(target, duration = 800) {
  if (target.hidden) {
    return _slideDown(target, duration);
  } else {
    return _slideUp(target, duration);
  }
}

function _slideDown(target, duration = 800) {
  target.hidden = false;
  let height = target.offsetHeight;
  target.style.overflow = "hidden";
  target.style.height = 0;
  target.offsetHeight; // Перезапуск стилів
  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = duration + "ms";
  target.style.height = height + "px";

  window.setTimeout(() => {
    target.style.removeProperty("height");
    target.style.removeProperty("overflow");
    target.style.removeProperty("transition-duration");
    target.style.removeProperty("transition-property");
  }, duration);
}

function _slideUp(target, duration = 800) {
  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = duration + "ms";
  target.style.height = target.offsetHeight + "px";
  target.offsetHeight; // Перезапуск стилів
  target.style.overflow = "hidden";
  target.style.height = 0;
  target.style.paddingTop = 0; // Додати
  target.style.paddingBottom = 0; // Додати

  window.setTimeout(() => {
    target.hidden = true;
    target.style.removeProperty("height");
    target.style.removeProperty("overflow");
    target.style.removeProperty("transition-duration");
    target.style.removeProperty("transition-property");
    target.style.removeProperty("padding-top"); // Видалити
    target.style.removeProperty("padding-bottom"); // Видалити
  }, duration);
}

function spollers() {
  const spollersArray = document.querySelectorAll("[data-spollers]");
  if (spollersArray.length > 0) {
    // Подія кліку
    document.addEventListener("click", setSpollerAction);
    // Отримання звичайних слойлерів
    const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
      return !item.dataset.spollers.split(",")[0];
    });
    // Ініціалізація звичайних слойлерів
    if (spollersRegular.length) {
      initSpollers(spollersRegular);
    }
    // Отримання слойлерів з медіа-запитами
    let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
    if (mdQueriesArray && mdQueriesArray.length) {
      mdQueriesArray.forEach((mdQueriesItem) => {
        // Подія
        mdQueriesItem.matchMedia.addEventListener("change", function () {
          initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
        initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
    // Ініціалізація
    function initSpollers(spollersArray, matchMedia = false) {
      spollersArray.forEach((spollersBlock) => {
        spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
        if (matchMedia.matches || !matchMedia) {
          spollersBlock.classList.add("_spoller-init");
          initSpollerBody(spollersBlock);
        } else {
          spollersBlock.classList.remove("_spoller-init");
          initSpollerBody(spollersBlock, false);
        }
      });
    }
    // Робота з контентом
    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
      let spollerItems = spollersBlock.querySelectorAll("details");
      if (spollerItems.length) {
        //spollerItems = Array.from(spollerItems).filter(item => item.closest('[data-spollers]') === spollersBlock);
        spollerItems.forEach((spollerItem) => {
          let spollerTitle = spollerItem.querySelector("summary");
          if (hideSpollerBody) {
            spollerTitle.removeAttribute("tabindex");
            if (!spollerItem.hasAttribute("data-open")) {
              spollerItem.open = false;
              spollerTitle.nextElementSibling.hidden = true;
            } else {
              spollerTitle.classList.add("_spoller-active");
              spollerItem.open = true;
            }
          } else {
            spollerTitle.setAttribute("tabindex", "-1");
            spollerTitle.classList.remove("_spoller-active");
            spollerItem.open = true;
            spollerTitle.nextElementSibling.hidden = false;
          }
        });
      }
    }
    function setSpollerAction(e) {
      const el = e.target;
      if (el.closest("summary") && el.closest("[data-spollers]")) {
        e.preventDefault();
        if (el.closest("[data-spollers]").classList.contains("_spoller-init")) {
          const spollerTitle = el.closest("summary");
          const spollerBlock = spollerTitle.closest("details");
          const spollersBlock = spollerTitle.closest("[data-spollers]");
          const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
          const scrollSpoller = spollerBlock.hasAttribute("data-spoller-scroll");
          const spollerSpeed = spollersBlock.dataset.spollersSpeed
            ? parseInt(spollersBlock.dataset.spollersSpeed)
            : 500;
          if (!spollersBlock.querySelectorAll("._slide").length) {
            if (oneSpoller && !spollerBlock.open) {
              hideSpollersBody(spollersBlock);
            }

            !spollerBlock.open
              ? (spollerBlock.open = true)
              : setTimeout(() => {
                  spollerBlock.open = false;
                }, spollerSpeed);

            spollerTitle.classList.toggle("_spoller-active");
            _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);

            if (scrollSpoller && spollerTitle.classList.contains("_spoller-active")) {
              const scrollSpollerValue = spollerBlock.dataset.spollerScroll;
              const scrollSpollerOffset = +scrollSpollerValue ? +scrollSpollerValue : 0;
              const scrollSpollerNoHeader = spollerBlock.hasAttribute("data-spoller-scroll-noheader")
                ? document.querySelector(".header").offsetHeight
                : 0;

              //setTimeout(() => {
              window.scrollTo({
                top: spollerBlock.offsetTop - (scrollSpollerOffset + scrollSpollerNoHeader),
                behavior: "smooth",
              });
              //}, spollerSpeed);
            }
          }
        }
      }
      // Закриття при кліку поза спойлером
      if (!el.closest("[data-spollers]")) {
        const spollersClose = document.querySelectorAll("[data-spoller-close]");
        if (spollersClose.length) {
          spollersClose.forEach((spollerClose) => {
            const spollersBlock = spollerClose.closest("[data-spollers]");
            const spollerCloseBlock = spollerClose.parentNode;
            if (spollersBlock.classList.contains("_spoller-init")) {
              const spollerSpeed = spollersBlock.dataset.spollersSpeed
                ? parseInt(spollersBlock.dataset.spollersSpeed)
                : 500;
              spollerClose.classList.remove("_spoller-active");
              _slideUp(spollerClose.nextElementSibling, spollerSpeed);
              setTimeout(() => {
                spollerCloseBlock.open = false;
              }, spollerSpeed);
            }
          });
        }
      }
    }
    function hideSpollersBody(spollersBlock) {
      const spollerActiveBlock = spollersBlock.querySelector("details[open]");
      if (spollerActiveBlock && !spollersBlock.querySelectorAll("._slide").length) {
        const spollerActiveTitle = spollerActiveBlock.querySelector("summary");
        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
        spollerActiveTitle.classList.remove("_spoller-active");
        _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
        setTimeout(() => {
          spollerActiveBlock.open = false;
        }, spollerSpeed);
      }
    }
  }
}
spollers();
