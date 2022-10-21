function removeScroll() {
  const documentWidth = parseInt(document.documentElement.clientWidth),
    windowsWidth = parseInt(window.innerWidth),
    scrollbarWidth = windowsWidth - documentWidth;

  document.querySelector('body').style.cssText = `padding-right:` + scrollbarWidth + `px; overflow-y: hidden;`;
}

function addScroll() {
  document.querySelector('body').style.cssText = 'padding-right: 0; overflow-y: auto;';
}