document.addEventListener("DOMContentLoaded", function () {

  function btnShowAll(btn, item) {
    if (item.length > 2) {
      btn.style.display = 'block';
    }

    btn.addEventListener('click', function () {
      if (this.innerText === 'Показать все') {
        this.innerText = 'Скрыть';
        item.forEach(i => {
          i.style.display = 'flex';
        });

      } else {
        this.innerText = 'Показать все';
        item.forEach(i => {
          i.style.display = 'none';
        });
      }
    });
  }

  btnShowAll(document.querySelector('.js-show-contacts'), document.querySelectorAll('.js-item-block'));
});