/*****************************************************************
** Author: Roland Schmehl, r.schmehl@tudelft.nl
**
** A plugin for displaying attribution texts sideways along the right
** edge of the viewport. When resizing the viewport or toggling full
** screen mode, the attribution text sticks persistently to the right
** edge of the viewport.
**
** The dynamic scaling of the attribution text via CSS transform
** is adopted from the fullscreen plugin.
**
** Version: 1.0
**
** License: MIT license (see file LICENSE)
**
******************************************************************/

window.CodeMover = window.CodeMover || {
  id: 'CodeMover',
  init: function(deck) {
      initCodeMover(deck);
  }
};

const initCodeMover = function(Reveal){

window.addEventListener( 'ready', function( event ) {

  // Remove configured margin of the presentation
  const codeTabs = document.getElementsByClassName("move-code");
  for(const codeTab of codeTabs) {
    console.log(codeTab);
    const cellCode = codeTab.querySelector(".cell > .cell-code");
    const parentPanel = codeTab.closest(".tab-content");
    const nextTab = parentPanel.children[1];
    nextTab.appendChild(cellCode);
  }

});


};
