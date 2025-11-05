// Строгий режим
"use strict";

function updateHeaderHeight() {
  const header = document.querySelector(".header");
  if (header) {
    const height = header.offsetHeight;
    document.documentElement.style.setProperty("--header-height", `${height}px`);
  }
}
window.addEventListener("DOMContentLoaded", () => {
  window.history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  updateHeaderHeight();

  initRatings();

  // ------------------ SLIDE UP / DOWN ------------------
  function _slideUp(target, duration = 500) {
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.boxSizing = "border-box";
    target.style.height = target.offsetHeight + "px";
    target.offsetHeight; // force reflow
    target.style.overflow = "hidden";
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.style.display = "none";
      target.style.removeProperty("height");
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
    }, duration);
  }

  function _slideDown(target, duration = 500) {
    target.style.removeProperty("display");
    let display = window.getComputedStyle(target).display;
    if (display === "none") display = "block";
    target.style.display = display;

    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight; // force reflow
    target.style.boxSizing = "border-box";
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout(() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
    }, duration);
  }

  function _slideToggle(target, duration = 500) {
    if (!target) return;

    if (window.getComputedStyle(target).display === "none") {
      _slideDown(target, duration);
    } else {
      _slideUp(target, duration);
    }
  }

  // --- Функція handleSelectDropdown ---
  function handleSelectDropdown(targetElement, triggerSelector, parentSelector, listSelector, duration) {
    const trigger = targetElement.closest(triggerSelector);
    if (trigger) {
      const parent = trigger.closest(parentSelector);
      if (parent) {
        const list = parent.querySelector(listSelector);
        if (list) {
          _slideToggle(list, duration);
          parent.classList.toggle("open");
          trigger.classList.toggle("open");
          return true;
        }
      }
    }
    return false;
  }

  document.addEventListener("click", (e) => {
    const targetElement = e.target;
    let clickHandledByInteractiveElement = false;

    // --- Перемикач кількості товарів ---
    if (targetElement.closest(".quantity__button._icon-minus")) {
      const currentInput = targetElement.closest(".quantity__button._icon-minus").nextElementSibling;
      if (currentInput) currentInput.value = Math.max(1, Number(currentInput.value) - 1);
      e.preventDefault();
      clickHandledByInteractiveElement = true;
    } else if (targetElement.closest(".quantity__button._icon-plus")) {
      const currentInput = targetElement.closest(".quantity__button._icon-plus").previousElementSibling;
      if (currentInput) currentInput.value = Number(currentInput.value) + 1;
      e.preventDefault();
      clickHandledByInteractiveElement = true;
    }
    // --- Приховування верхньої частини хедера (.sign-up)
    if (targetElement.closest(".sign-up__button")) {
      const signUpBlock = document.querySelector(".sign-up");
      if (signUpBlock) {
        signUpBlock.classList.add("hidden");

        const onTransitionEnd = (e) => {
          if (e.propertyName === "max-height") {
            updateHeaderHeight();
            signUpBlock.removeEventListener("transitionend", onTransitionEnd);
          }
        };

        signUpBlock.addEventListener("transitionend", onTransitionEnd);
      }
    }

    // --- Бургер-меню ---
    const iconMenu = targetElement.closest(".icon-menu");
    if (iconMenu) {
      document.documentElement.classList.toggle("menu-open");
      e.preventDefault();
      clickHandledByInteractiveElement = true;
    }

    // --- Відкриття фільтра (кнопка з іконкою) ---
    if (targetElement.closest(".select-sort-header__filter")) {
      document.documentElement.classList.add("filter-open");
      e.preventDefault();
      clickHandledByInteractiveElement = true;
    }

    // --- Закриття фільтра (хрестик всередині фільтра) ---
    if (targetElement.closest(".filter__button")) {
      document.documentElement.classList.remove("filter-open");
      e.preventDefault();
      clickHandledByInteractiveElement = true;
    }
    // --- Обробка субменю ---
    const submenuTrigger = targetElement.closest(".menu__item-sublist ._icon-more-arrow");
    if (submenuTrigger) {
      const itemSubmenuParent = submenuTrigger.closest(".menu__item-sublist");
      if (itemSubmenuParent) {
        const submenu = itemSubmenuParent.querySelector(".menu__sublist");
        if (submenu) {
          // Закриваємо інші відкриті сабменю (як акордеон)
          document.querySelectorAll(".menu__item-sublist.open").forEach((openedItem) => {
            if (openedItem !== itemSubmenuParent) {
              const openedSublist = openedItem.querySelector(".menu__sublist");
              if (openedSublist) {
                _slideUp(openedSublist, 500);
                openedItem.classList.remove("open");
              }
            }
          });

          _slideToggle(submenu, 500);
          itemSubmenuParent.classList.toggle("open");
          e.preventDefault();
          clickHandledByInteractiveElement = true;
        }
      }
    }

    // --- Обробка Dropdowns за допомогою handleSelectDropdown ---
    if (
      handleSelectDropdown(
        targetElement,
        ".select-header__link-current",
        ".select-header",
        ".select-header__list",
        300
      ) ||
      handleSelectDropdown(
        targetElement,
        ".select-sort-header__current",
        ".select-sort-header",
        ".select-sort-header__list",
        300
      )
    ) {
      e.preventDefault();
      clickHandledByInteractiveElement = true;
    }

    // --- Пошук ---
    const searchButtonOpen = targetElement.closest(".search__button-open");
    const mainHeaderSearch = document.querySelector(".main-header__search");

    if (searchButtonOpen) {
      mainHeaderSearch?.classList.toggle("search-open");
      e.preventDefault();
      clickHandledByInteractiveElement = true;
    }

    // --- Show-more toggle ---
    if (targetElement.closest("[data-show-more-button]")) {
      const showMoreBlock = targetElement.closest("[data-show-more]");
      const showMoreContent = showMoreBlock.querySelector("[data-show-more-text]");
      if (showMoreContent) {
        const fullHeight = showMoreContent.scrollHeight;
        const rowHeight = getGridRowHeight(showMoreContent);
        const isExpanded = showMoreBlock.classList.toggle("expanded");
        showMoreContent.style.maxHeight = isExpanded ? `${fullHeight}px` : `${rowHeight}px`;
      }
      e.preventDefault();
      clickHandledByInteractiveElement = true;
    }

    // --- Сполер Футер ---
    const summary = e.target.closest(".menu-footer__title");
    if (summary) {
      // Перевірка, чи знайдено summary
      const details = summary.parentNode; // Це елемент <details>
      const isOpen = details.hasAttribute("open");

      e.preventDefault();

      if (window.innerWidth <= 768) {
        // Закриття інших спойлерів (акордеон)
        document.querySelectorAll(".menu-footer__item").forEach((el) => {
          if (el !== details && el.hasAttribute("open")) {
            const otherContent = el.querySelector(".menu-footer__list");
            const otherSummary = el.querySelector(".menu-footer__title"); // Отримуємо summary для іншого спойлера
            if (otherContent) {
              _slideUp(otherContent, 500);
              // Додаткова перевірка на otherSummary
              if (otherSummary) {
                otherSummary.classList.remove("active"); // Для іконки
              }
              // Видаляємо атрибут 'open' після завершення анімації
              setTimeout(() => el.removeAttribute("open"), 500);
            }
          }
        });

        const content = details.querySelector(".menu-footer__list");
        if (content) {
          if (!isOpen) {
            // Якщо спойлер закритий (ми його відкриваємо)
            summary.classList.add("active"); // Для іконки
            details.setAttribute("open", ""); // Додаємо 'open' миттєво
            _slideDown(content, 500); // Починаємо анімацію вмісту (плавне відкриття)
          } else {
            // Якщо спойлер відкритий (ми його закриваємо)
            summary.classList.remove("active"); // Для іконки
            _slideUp(content, 500); // Починаємо анімацію вмісту (плавне закриття)

            // *** КЛЮЧОВА ЗМІНА ТУТ: Видаляємо 'open' ТІЛЬКИ ПІСЛЯ завершення анімації ***
            setTimeout(() => {
              details.removeAttribute("open");
            }, 500);
          }
        }
      }
    }

    // --- Filter Spolers (data-spoller) ---
    const filterSummary = e.target.closest("[data-spoller-item]");
    if (filterSummary && filterSummary.tagName === "SUMMARY") {
      const details = filterSummary.closest("[data-spoller]");
      if (details) {
        e.preventDefault();
        clickHandledByInteractiveElement = true;

        const content = details.querySelector(".item-filter__content");
        const isOpen = details.hasAttribute("open");
        const iconElement = filterSummary.querySelector("._icon-more-arrow");

        if (!isOpen) {
          // Якщо спойлер закритий (ми його відкриваємо)
          details.setAttribute("open", "");
          _slideDown(content, 500);
          if (iconElement) {
            iconElement.classList.remove("active"); // ВИДАЛЯЄМО 'active' ДЛЯ СТАНУ "ВІДКРИТО" (носиком вгору)
            // Примусове перемальовування для іконки
            iconElement.offsetWidth; // Читання цієї властивості змушує браузер перерахувати стилі
          }
        } else {
          // Якщо спойлер відкритий (ми його закриваємо)
          if (iconElement) {
            iconElement.classList.add("active"); // ДОДАЄМО 'active' ДЛЯ СТАНУ "ЗАКРИТО" (носиком вниз)
            // Примусове перемальовування для іконки
            iconElement.offsetWidth; // Читання цієї властивості змушує браузер перерахувати стилі
          }
          _slideUp(content, 500);
          setTimeout(() => {
            details.removeAttribute("open");
          }, 500);
        }
      }
    }

    // --- ЛОГІКА ЗАКРИТТЯ ЕЛЕМЕНТІВ ПРИ КЛІКУ ПОЗА НИМИ ---
    // Цей блок виконується, якщо клік НЕ був оброблений жодним з "відкриваючих" елементів вище
    // і відповідає за закриття тільки зазначених елементів: сабменю, select-reviews, select-filter.
    if (!clickHandledByInteractiveElement) {
      // Закриття субменю
      document.querySelectorAll(".menu__item-sublist.open").forEach((openedItem) => {
        if (!openedItem.contains(targetElement)) {
          const openedSublist = openedItem.querySelector(".menu__sublist");
          if (openedSublist) {
            _slideUp(openedSublist, 500);
            openedItem.classList.remove("open");
          }
        }
      });

      // Закриття кастомних селектів (select-header / select-reviews)
      document.querySelectorAll(".select-header.open").forEach((openedSelect) => {
        if (!openedSelect.contains(targetElement)) {
          const list = openedSelect.querySelector(".select-header__list");
          const trigger = openedSelect.querySelector(".select-header__link-current");
          if (list) _slideUp(list, 300);
          openedSelect.classList.remove("open");
          if (trigger) trigger.classList.remove("open");
        }
      });

      // Закриття кастомних селектів (select-sort-header / select-filter)
      document.querySelectorAll(".select-sort-header.open").forEach((openedSelect) => {
        if (!openedSelect.contains(targetElement)) {
          const list = openedSelect.querySelector(".select-sort-header__list");
          const trigger = openedSelect.querySelector(".select-sort-header__current");
          if (list) _slideUp(list, 300);
          openedSelect.classList.remove("open");
          if (trigger) trigger.classList.remove("open");
        }
      });
    }
  });

  // ===== Спойлери Футер =====
  const footerMenuElement = document.querySelector(".menu-footer");
  const maxWidth = footerMenuElement ? +footerMenuElement.dataset.spollersInit || 600 : 600;
  const footerSpollers = document.querySelectorAll(".menu-footer__item");

  if (footerSpollers.length) {
    const matchMedia = window.matchMedia(`(max-width: ${maxWidth / 16}em)`);

    let spollersInit = (items, isOpen) => {
      items.forEach((item) => {
        const title = item.querySelector(".menu-footer__title");
        const content = title ? title.nextElementSibling : null;

        item.classList.toggle("_init", !isOpen);
        if (title) {
          isOpen ? title.setAttribute("tabindex", "-1") : title.removeAttribute("tabindex");
        }
        item.open = isOpen;

        if (content) {
          content.hidden = !isOpen;
        }
      });
    };

    spollersInit(footerSpollers, !matchMedia.matches);

    matchMedia.addEventListener("change", () => {
      spollersInit(footerSpollers, !matchMedia.matches);
    });
  }
  //========================================================================================================================================================
  // рендер карток через json
  const PRODUCTS_URL = "products.json";
  const PRODUCTS_PER_LOAD = 4;
  const visibleCounts = {};
  let allProducts = [];

  // ------------------ КАРТКИ ------------------
  function createProductCard(product) {
    const article = document.createElement("article");
    article.className = "products__item item-products";
    article.style.display = "none"; // стартова точка для анімації
    article.innerHTML = `
    <a href="product.html" class="item-products__image-link">
      <img class="item-products__image" src="${product.img}" alt="${product.name}" />
    </a>
    <div class="item-products__body">
      <div class="item-products__title">
        <a href="#" class="item-products__title-link">${product.name}</a>
      </div>
      <div class="item-products__rating rating">
        <div data-rating data-rating-value="${product.rating}" data-rating-size="5" class="rating__body"></div>
        <div class="rating__value"><span>/5</span></div>
      </div>
      <div class="item-products__price price">
        <div class="price__current">$${product.price}</div>
        <div class="price__old">${product.oldPrice ? `$${product.oldPrice}` : ""}</div>
        <div class="price__discount">${product.discount || ""}</div>
      </div>
    </div>
  `;
    return article;
  }

  // ------------------ РЕНДЕР ------------------
  function renderCards(category, data) {
    const container = document.querySelector(`[data-products="${category}"]`);
    if (!container) return;

    if (!visibleCounts[category]) visibleCounts[category] = 0;

    const filtered = data.filter((p) => p.category === category);
    const nextItems = filtered.slice(visibleCounts[category], visibleCounts[category] + PRODUCTS_PER_LOAD);

    nextItems.forEach((product) => {
      const card = createProductCard(product);
      container.appendChild(card);
      _slideDown(card, 500); // плавна поява всіх одразу
    });

    visibleCounts[category] += PRODUCTS_PER_LOAD;

    const btn = container.closest(".products__content")?.querySelector("[data-load-more]");
    if (visibleCounts[category] >= filtered.length && btn) {
      _slideUp(btn, 100); // плавне приховування кнопки
    }

    initRatings();
  }

  // ------------------ РЕЙТИНГ ------------------
  function initRatings(context = document) {
    context.querySelectorAll("[data-rating]").forEach((ratingEl) => {
      const ratingValue = parseFloat(ratingEl.dataset.ratingValue);
      const ratingSize = parseInt(ratingEl.dataset.ratingSize) || 5;
      const ratingValueContainer = ratingEl.nextElementSibling;
      const totalValueSpan = ratingValueContainer ? ratingValueContainer.querySelector("span") : null;

      ratingEl.innerHTML = "";

      for (let i = 1; i <= ratingSize; i++) {
        const star = document.createElement("span");
        star.classList.add("rating__item");

        if (i <= Math.floor(ratingValue)) {
          star.classList.add("rating__item--full");
        } else if (i - ratingValue < 1 && i - ratingValue > 0) {
          star.classList.add("rating__item--half");
        } else {
          star.classList.add("rating__item--empty");
        }

        ratingEl.appendChild(star);
      }

      const formattedRatingValue = ratingValue.toFixed(1);

      if (ratingValueContainer) {
        ratingValueContainer.textContent = formattedRatingValue + "/";
        if (totalValueSpan) {
          totalValueSpan.textContent = ratingSize;
          ratingValueContainer.appendChild(totalValueSpan);
        } else {
          const newSpan = document.createElement("span");
          newSpan.textContent = ratingSize;
          ratingValueContainer.appendChild(newSpan);
        }
      }
    });
  }

  // ------------------ ЗАВАНТАЖЕННЯ JSON ------------------
  fetch(PRODUCTS_URL)
    .then((res) => res.json())
    .then((data) => {
      allProducts = data;
      const categories = [...new Set(data.map((p) => p.category))];
      categories.forEach((category) => {
        renderCards(category, data);
      });

      document.querySelectorAll("[data-load-more]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const container = btn.closest(".products__content");
          const category = container.querySelector("[data-products]").dataset.products;
          renderCards(category, data);
        });
      });
    });

  // ===== Переміщення заголовків товарів для мобільних пристроїв =====
  const itemTitles = document.querySelectorAll(".item-body-cart__header");
  const bodyCartWrappers = document.querySelectorAll(".body-cart__wrapper");
  const itemBodyCartInfos = document.querySelectorAll(".item-body-cart__info");

  if (itemTitles.length > 0 && bodyCartWrappers.length > 0 && itemBodyCartInfos.length > 0) {
    const matchMedia = window.matchMedia(`(max-width: ${399.98 / 16}em)`);
    moveItemTitles();
    matchMedia.addEventListener("change", () => {
      moveItemTitles();
    });

    function moveItemTitles() {
      itemTitles.forEach((title, index) => {
        const bodyCartWrapper = bodyCartWrappers[index];
        const itemBodyCartInfo = itemBodyCartInfos[index];
        if (matchMedia.matches) {
          bodyCartWrapper?.insertAdjacentElement("afterbegin", title);
        } else {
          itemBodyCartInfo?.insertAdjacentElement("afterbegin", title);
        }
      });
    }
  }
  // ===== Переміщення .sort-header__select для мобільних пристроїв =====
  const sortSelect = document.querySelector(".sort-header__select");
  const target = document.querySelector(".body-category__header");
  const originalParent = sortSelect?.parentElement;

  const mediaQuery = window.matchMedia("(max-width: 767.98px)");

  function moveSelectBlock() {
    if (mediaQuery.matches) {
      target?.appendChild(sortSelect);
    } else {
      originalParent?.appendChild(sortSelect);
    }
  }

  mediaQuery.addEventListener("change", moveSelectBlock);
  moveSelectBlock();

  // ===== Слайдери (Swiper) =====
  if (typeof Swiper !== "undefined") {
    if (document.querySelector(".customers__slider")) {
      const swiperCustomers = new Swiper(".customers__slider", {
        speed: 800,
        slidesPerView: 3,
        spaceBetween: 20,
        navigation: {
          nextEl: ".customers__button--new",
          prevEl: ".customers__button--prev",
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          660: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          992: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        },
      });
    }

    if (document.querySelector(".main-slider-product") && document.querySelector(".previews-slider-product")) {
      const thumbsSwiper = new Swiper(".main-slider-product", {
        direction: "vertical",
        slidesPerView: 3,
        spaceBetween: 14,
        watchSlidesProgress: true,
        mousewheel: {
          forceToAxis: true,
          sensitivity: 1,
        },
        breakpoints: {
          0: {
            direction: "horizontal",
            slidesPerView: 3,
          },
          1200: {
            direction: "vertical",
            slidesPerView: 3,
          },
        },
      });

      const mainSwiper = new Swiper(".previews-slider-product", {
        slidesPerView: 1,
        spaceBetween: 14,
        autoHeight: true,
        effect: "fade",
        fadeEffect: {
          crossFade: true,
        },
        thumbs: {
          swiper: thumbsSwiper,
        },
      });

      thumbsSwiper.update();
      mainSwiper.update();
    }
  }

  // ===== Модуль роботи з табами =====
  document.querySelectorAll("[data-tabs]").forEach((tabsContainer) => {
    const tabButtons = tabsContainer.querySelectorAll("[data-tabs-titles] .tabs__title");
    const tabContents = tabsContainer.querySelectorAll("[data-tabs-body] .tabs__body");

    tabButtons.forEach((btn, index) => {
      const isActive = btn.classList.contains("_tab-active");
      tabContents[index].hidden = !isActive;

      btn.addEventListener("click", () => {
        tabButtons.forEach((b, i) => {
          b.classList.remove("_tab-active");
          tabContents[i].hidden = true;
        });

        btn.classList.add("_tab-active");
        tabContents[index].hidden = false;
      });
    });
  });

  // ===== Price Slider (noUiSlider) =====
  const priceSlider = document.querySelector(".filter-price__range");
  if (priceSlider) {
    if (typeof noUiSlider !== "undefined") {
      noUiSlider.create(priceSlider, {
        start: [50, 200],
        connect: true,
        range: {
          min: 0,
          max: 250,
        },
        step: 1,
        format: {
          to: (value) => `${Math.round(value)}`,
          from: (value) => Number(value.replace("$", "")),
        },
      });

      const handles = priceSlider.querySelectorAll(".noUi-handle");

      handles.forEach((handle, index) => {
        const valueBubble = document.createElement("span");
        valueBubble.classList.add("noUi-value");
        valueBubble.textContent = `$${Math.round(priceSlider.noUiSlider.get()[index])}`;
        handle.appendChild(valueBubble);
      });

      priceSlider.noUiSlider.on("update", (values, handle) => {
        const valueElements = priceSlider.querySelectorAll(".noUi-value");
        if (valueElements[handle]) {
          valueElements[handle].textContent = `$${Math.round(values[handle])}`;
        }
      });
    } else {
      console.warn("noUiSlider library is not loaded. Price slider functionality will be unavailable.");
    }
  }
});
window.addEventListener("resize", updateHeaderHeight);
