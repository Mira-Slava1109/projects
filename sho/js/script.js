// Строгий режим
"use strict";

function handleCustomSelect(targetElement, {
  wrapperClass,
  toggleClass,
  currentSelector,
  listSelector
}) {
  const selectWrapper = targetElement.closest(`.${wrapperClass}`);
  if (selectWrapper) {
    const currentTrigger = targetElement.closest(`.${currentSelector}`);
    if (currentTrigger) {
      const list = selectWrapper.querySelector(`.${listSelector}`);
      const isOpen = selectWrapper.classList.contains(toggleClass);

      document.querySelectorAll(`.${wrapperClass}.${toggleClass}`).forEach(opened => {
        if (opened !== selectWrapper) {
          const openedList = opened.querySelector(`.${listSelector}`);
          _slideUp(openedList, 500);
          opened.classList.remove(toggleClass);
        }
      });

      if (isOpen) {
        _slideUp(list, 500);
        selectWrapper.classList.remove(toggleClass);
      } else {
        _slideDown(list, 500);
        selectWrapper.classList.add(toggleClass);
      }

      return true;
    }
  } else {
    document.querySelectorAll(`.${wrapperClass}.${toggleClass}`).forEach(opened => {
      const openedList = opened.querySelector(`.${listSelector}`);
      _slideUp(openedList, 500);
      opened.classList.remove(toggleClass);
    });
  }
  return false;
}

document.addEventListener('click', (e) => {
  const targetElement = e.target;

  // Кількість товарів
  if (targetElement.closest('.quantity__button._icon-minus')) {
    const currentInput = targetElement.closest('.quantity__button._icon-minus').nextElementSibling;
    if (currentInput) currentInput.value = Math.max(1, Number(currentInput.value) - 1);
    e.preventDefault();
  } else if (targetElement.closest('.quantity__button._icon-plus')) {
    const currentInput = targetElement.closest('.quantity__button._icon-plus').previousElementSibling;
    if (currentInput) currentInput.value = Number(currentInput.value) + 1;
    e.preventDefault();
  }

  // Scroll-блокування
  if (targetElement.closest('.sign-up__button')) {
    document.documentElement.classList.add('hidden');
  }

  // Плавне закриття sign-up
  const signUpElement = document.querySelector('.sign-up');
  if (signUpElement?.contains(targetElement)) {
    signUpElement.style.height = `${signUpElement.scrollHeight}px`;
    requestAnimationFrame(() => {
      signUpElement.style.height = '0';
    });
  }

  // Бургер-меню
  if (targetElement.closest('.icon-menu')) {
    document.documentElement.classList.toggle('menu-open');
  }

  // Сабменю
  const itemSubmenu = targetElement.closest('.menu__item-sublist');
  if (targetElement.closest('._icon-more-arrow') && itemSubmenu) {
    const submenu = itemSubmenu.querySelector('.menu__sublist');
    const isOpen = itemSubmenu.classList.contains('open');

    document.querySelectorAll('.menu__item-sublist.open').forEach(openedItem => {
      if (openedItem !== itemSubmenu) {
        const openedSublist = openedItem.querySelector('.menu__sublist');
        _slideUp(openedSublist, 500);
        openedItem.classList.remove('open');
      }
    });

    if (isOpen) {
      _slideUp(submenu, 500);
      itemSubmenu.classList.remove('open');
    } else {
      _slideDown(submenu, 500);
      itemSubmenu.classList.add('open');
    }

    e.preventDefault();
  } else {
    document.querySelectorAll('.menu__item-sublist.open').forEach(openedItem => {
      const openedSublist = openedItem.querySelector('.menu__sublist');
      _slideUp(openedSublist, 500);
      openedItem.classList.remove('open');
    });
  }

  // Пошук
  targetElement.closest('.search__button-open')?.closest('.main-header__search')?.classList.toggle('search-open');

  // Show more
  if (targetElement.closest('[data-show-more-button]')) {
    const showMoreBlock = targetElement.closest('[data-show-more]');
    const showMoreContent = showMoreBlock.querySelector('[data-show-more-text]');
    if (!showMoreContent) return;

    const fullHeight = showMoreContent.scrollHeight;
    const rowHeight = getGridRowHeight(showMoreContent);
    const isExpanded = showMoreBlock.classList.toggle('expanded');
    showMoreContent.style.maxHeight = isExpanded ? `${fullHeight}px` : `${rowHeight}px`;
  }

  // Footer Spolers
  const summary = e.target.closest('.menu-footer__title');
  if (summary) {
    const details = summary.parentNode;
    const isOpen = details.hasAttribute('open');
    e.preventDefault();

    if (window.innerWidth <= 768) {
      document.querySelectorAll('.menu-footer__title').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.menu-footer__item').forEach(el => {
        if (el !== details) {
          const content = el.querySelector('.menu-footer__list');
          _slideUp(content, 500);
          setTimeout(() => el.removeAttribute('open'), 500);
        }
      });

      const content = details.querySelector('.menu-footer__list');
      if (!isOpen) {
        summary.classList.add('active');
        details.setAttribute('open', '');
        _slideDown(content, 500);
      } else {
        summary.classList.remove('active');
        _slideUp(content, 500);
        setTimeout(() => details.removeAttribute('open'), 500);
      }
    }
  }

  // // Filter Spolers (без медіа, без акордеону)
  // const filterSummary = e.target.closest('[data-spoller-item]');
  // if (filterSummary && filterSummary.tagName === 'SUMMARY') {
  //   const details = filterSummary.closest('[data-spoller]');
  //   if (!details) return;

  //   e.preventDefault();

  //   const content = details.querySelector('.item-filter__content');
  //   const isOpen = details.hasAttribute('open');

  //   if (!isOpen) {
  //     details.setAttribute('open', '');
  //     _slideDown(content, 500);
  //   } else {
  //     _slideUp(content, 500);
  //     setTimeout(() => {
  //       details.removeAttribute('open');
  //     }, 500);
  //   }
  // }

  // Обробка кастомних селектів (відгуки + товари)
  handleCustomSelect(targetElement, {
    wrapperClass: 'select-header',
    toggleClass: 'select-header--open',
    currentSelector: 'select-header__link-current',
    listSelector: 'select-header__list'
  }) ||
  handleCustomSelect(targetElement, {
    wrapperClass: 'select-sort-header',
    toggleClass: 'select-sort-header--open',
    currentSelector: 'select-sort-header__current',
    listSelector: 'select-sort-header__list'
  });
});

// Анімація
function _slideUp(target, duration = 500) {
  target.style.transitionProperty = 'height, padding, margin';
  target.style.transitionDuration = duration + 'ms';
  target.style.boxSizing = 'border-box';
  target.style.height = target.offsetHeight + 'px';
  target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;

  window.setTimeout(() => {
    target.hidden = true;
    target.style.removeProperty('height');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    target.style.removeProperty('box-sizing');
  }, duration);
}

function _slideDown(target, duration = 500) {
  target.hidden = false;
  target.style.removeProperty('height');
  let height = target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.offsetHeight;
  target.style.transitionProperty = 'height, padding, margin';
  target.style.transitionDuration = duration + 'ms';
  target.style.height = height + 'px';

  window.setTimeout(() => {
    target.style.removeProperty('height');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
  }, duration);
}

function _slideToggle(target, duration = 500) {
  if (target.hidden) {
    return _slideDown(target, duration);
  } else {
    return _slideUp(target, duration);
  }
}

// Приховати закриті data-spoller на старті
function getGridRowHeight(gridContainer) {
  const firstItem = gridContainer.firstElementChild;
  if (!firstItem) return 0;
  const itemStyles = window.getComputedStyle(firstItem);
  const marginBottom = parseFloat(itemStyles.marginBottom);
  return firstItem.offsetHeight + marginBottom;
}

function updateShowMoreStates() {
  document.querySelectorAll('[data-show-more]').forEach(showMoreBlock => {
    const showMoreContent = showMoreBlock.querySelector('[data-show-more-text]');
    const showMoreButton = showMoreBlock.querySelector('[data-show-more-button]');

    if (!showMoreContent || !showMoreButton) return;

    showMoreContent.style.transition = 'none';

    const fullHeight = showMoreContent.scrollHeight;
    const rowHeight = getGridRowHeight(showMoreContent);

    if (showMoreBlock.classList.contains('expanded')) {
      showMoreContent.style.maxHeight = `${fullHeight}px`;
    } else {
      showMoreContent.style.maxHeight =`${rowHeight}px`;
    }

    if (fullHeight <= rowHeight + 10) {
      showMoreButton.style.display = 'none';
    } else {
      showMoreButton.style.display = '';
    }

    requestAnimationFrame(() => {
      showMoreContent.style.transition = 'max-height 0.5s ease-in-out';
    });
  });
}

window.addEventListener("load", () => {
  updateShowMoreStates();

 // Максимальна ширина, при якій активуються спойлери
const maxWidth = +document.querySelector('.menu-footer').dataset.spollersInit || 600;
const footerSpollers = document.querySelectorAll('.menu-footer__item');

if (footerSpollers.length) {
  const matchMedia = window.matchMedia(`(max-width: ${maxWidth / 16}em)`);

  // Ініціалізація спойлерів: відкриті або закриті
  let spollersInit = (items, isOpen) => {
    items.forEach(item => {
      const title = item.querySelector('.menu-footer__title');
      item.classList.toggle('_init', !isOpen);
      isOpen ? title.setAttribute("tabindex", "-1") : title.removeAttribute("tabindex");
      item.open = isOpen;
    });
  };

  // Первинна ініціалізація
  spollersInit(footerSpollers, !matchMedia.matches);

  // Перезапуск при зміні ширини в'юпорту
  matchMedia.addEventListener('change', () => {
    spollersInit(footerSpollers, !matchMedia.matches);
  });
}

// Рейтинг
document.querySelectorAll('[data-rating]').forEach(ratingEl => {
  const ratingValue = parseFloat(ratingEl.dataset.ratingValue);
  const ratingSize = parseInt(ratingEl.dataset.ratingSize) || 5;
  const ratingValueContainer = ratingEl.nextElementSibling;
  const totalValueSpan = ratingValueContainer.querySelector('span');

  ratingEl.innerHTML = '';

  for (let i = 1; i <= ratingSize; i++) {
    const star = document.createElement('span');
    star.classList.add('rating__item');

    if (i <= Math.floor(ratingValue)) {
      star.classList.add('rating__item--full');
    } else if (i - ratingValue < 1 && i - ratingValue > 0) {
      star.classList.add('rating__item--half');
    } else {
      star.classList.add('rating__item--empty');
    }

    ratingEl.appendChild(star);
  }

  const formattedRatingValue = ratingValue.toFixed(1);

  if (ratingValueContainer) {
    ratingValueContainer.textContent = formattedRatingValue + '/';
    if (totalValueSpan) {
      totalValueSpan.textContent = ratingSize;
      ratingValueContainer.appendChild(totalValueSpan);
    } else {
      const newTotalValueSpan = document.createElement('span');
      newTotalValueSpan.textContent = ratingSize;
      ratingValueContainer.appendChild(newTotalValueSpan);
    }
  }
});
  // Таби
  document.querySelectorAll('[data-tabs]').forEach(tabsContainer => {
    const tabButtons = tabsContainer.querySelectorAll('[data-tabs-titles] .tabs__title');
    const tabContents = tabsContainer.querySelectorAll('[data-tabs-body] .tabs__body');

    tabButtons.forEach((btn, index) => {
      const isActive = btn.classList.contains('_tab-active');
      tabContents[index].hidden = !isActive;

      btn.addEventListener('click', () => {
        tabButtons.forEach((b, i) => {
          b.classList.remove('_tab-active');
          tabContents[i].hidden = true;
        });

        btn.classList.add('_tab-active');
        tabContents[index].hidden = false;
      });
    });
  });

  // Swiper sliders
  if (document.querySelector('.customers__slider')) {
    new Swiper('.customers__slider', {
      speed: 800,
      slidesPerView: 3,
      spaceBetween: 20,
      navigation: {
        nextEl: '.customers__button--new',
        prevEl: '.customers__button--prev',
      },
      breakpoints: {
        320: { slidesPerView: 1, spaceBetween: 10 },
        660: { slidesPerView: 2, spaceBetween: 20 },
        992: { slidesPerView: 3, spaceBetween: 20 }
      }
    });
  }

  if (document.querySelector('.main-slider-product') && document.querySelector('.previews-slider-product')) {
    const thumbsSwiper = new Swiper('.main-slider-product', {
      direction: 'vertical',
      slidesPerView: 3,
      spaceBetween: 14,
      watchSlidesProgress: true,
      mousewheel: { forceToAxis: true, sensitivity: 1 },
      breakpoints: {
        0: { direction: 'horizontal', slidesPerView: 3 },
        1200: { direction: 'vertical', slidesPerView: 3 }
      }
    });

    new Swiper('.previews-slider-product', {
      slidesPerView: 1,
      spaceBetween: 14,
      autoHeight: true,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      thumbs: { swiper: thumbsSwiper }
    });
  }
});

window.addEventListener("resize", () => {
  setTimeout(updateShowMoreStates, 100);
});


const priceSlider = document.querySelector('.filter-price__range');
noUiSlider.create(priceSlider, {
  start: [50, 200],
  connect: true,
  range: {
    min: 0,
    max: 250
  },
  step: 1,
  format: {
    to: value => `$${Math.round(value)}`,
    from: value => Number(value.replace('$', ''))
  }
});

// Додаємо елементи для значень всередину ручок
const handles = priceSlider.querySelectorAll('.noUi-handle');

handles.forEach((handle, index) => {
  const valueBubble = document.createElement('span');
  valueBubble.classList.add('noUi-value');
  valueBubble.textContent = index === 0 ? '$50' : '$200';
  handle.appendChild(valueBubble);
});

// Оновлюємо значення всередині хендлів при русі
priceSlider.noUiSlider.on('update', (values, handle) => {
  const valueElements = priceSlider.querySelectorAll('.noUi-value');
  valueElements[handle].textContent = values[handle];
});
