document.addEventListener("DOMContentLoaded", function () {

  function operationMenu() {
    const btnMenu = document.querySelector('.js-show-menu'),
      menu = document.querySelector('.js-menu');

    function openMenu() {
      menu.style.display = 'block';
      removeScroll();
    }

    function closeMenu() {
      menu.style.display = 'none';
      addScroll();
    }

    btnMenu.addEventListener('click', function () {
      openMenu();
    });

    menu.addEventListener('click', function (e) {
      if (!e.target.matches('.menu__wrapper, .menu__link')) {
        closeMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1424) {
        menu.style.display = 'block';
      } else {
        menu.style.display = 'none';
      }
    });

    if (window.innerWidth < 1424) {
      document.addEventListener('keydown', function (e) {
        if (e.key == 'Escape') {
          closeMenu();
        }
      });
    }

    if (window.innerWidth < 500) {

    }
  }
  operationMenu();

});