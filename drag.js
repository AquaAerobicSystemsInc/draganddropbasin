class ZoomContainer {

  constructor() {
    this.scale = 1;
  }

  zoom(e) {
    e.preventDefault();
    if (!e.shiftKey) return;
    let {
      scale
    } = this;
    const newScale = scale + (e.wheelDelta < 0 ? -0.25 : 0.25);
    scale = newScale > 2 || newScale < 0.5 ? scale : newScale;
    subjx(e.currentTarget).css({
      transform: `scale(${scale},${scale})`
    });
    this.scale = scale;
  }

}

const zoomSvg = new ZoomContainer(),
  zoomHtml = new ZoomContainer();

subjx('#svg-container')
  .on('mousewheel', e => {
    zoomSvg.zoom(e);
  });

subjx('#stack')
  .on('mousewheel', e => {
    zoomHtml.zoom(e);
  });

// define methods
const methods = {
  onInit(el) {
    console.log('init');
  },
  onMove({ dx, dy }) {
    subjx('#move > span')[0].innerHTML = `x: ${dx}px; y: ${dy}px`;
  },
  onResize({ dx, dy }) {
    subjx('#resize > span')[0].innerHTML = `x: ${dx}px; y: ${dy}px`;
  },
  onRotate({ delta }) {
    subjx('#rotate > span')[0].innerHTML = `${Math.floor(delta * 180 / Math.PI)}deg`;
  },
  onDrop() {
    console.log('is dropped');
  },
  onDestroy() {
    console.log('is destroyed');
  }
};
// additional options
const svgOptions = {
  container: '#svg-container',
  restrict: '#svg-container',
  rotationPoint: true,
  snap: {
    x: 30,
    y: 30,
    angle: 25
  },
  ...methods
};

const svgs =
  subjx('.drag-svg').drag(svgOptions);

svgs.forEach(item => {
  subjx(item.controls).on('dblclick', () => {
    item.disable();
  });
});

// double click activating/deactivating the drag method
subjx('.drag-svg').on('dblclick', e => {
  if (e.currentTarget.classList.contains('sjx-drag')) return;
  const xDraggable = subjx(e.currentTarget).drag(svgOptions)[0];
  // adding event to controls
  const controls = xDraggable.controls;
  subjx(controls).on('dblclick', () => {
    xDraggable.disable();
  });
});

const options = {
  container: '#stack',
  restrict: '#stack',
  proportions: true,
  each: {
    move: true,
    resize: true
  },
  snap: {
    x: 40,
    y: 40,
    angle: 0
  },
  cursorMove: 'move',
  cursorRotate: 'crosshair',
  cursorResize: 'pointer',
  ...methods
};

const Draggables = subjx('.draggable').drag(options);

Draggables.forEach(item => {
  const controls = item.controls;
  subjx(controls).on('dblclick', () => {
    item.disable();
    Draggables.splice(Draggables.indexOf(item), 1);
  });
});

subjx('.draggable').on('dblclick', e => {
  if (e.currentTarget.classList.contains('sjx-drag')) return;
  const xDraggable = subjx(e.currentTarget).drag(options)[0];
  Draggables.push(xDraggable);
  // adding event to controls
  const controls = xDraggable.controls;
  subjx(controls).on('dblclick', () => {
    xDraggable.disable();
  });
});

const onDrop = (e, el, clone) => {

  const stack = subjx('#stack')[0],
    offset = stack.getBoundingClientRect(),
    div = document.createElement('div');

  div.style.top = `${e.clientY - offset.top}px`;
  div.style.left = `${e.clientX - offset.left}px`;

  div.classList.add('draggable');

  stack.appendChild(div);

  Draggables.push(...subjx(div).drag());
};

subjx('.clone').clone({
  stack: '#stack',
  appendTo: '#stack',
  onDrop
});

subjx('.clone-styled').clone({
  stack: '#stack',
  style: {
    border: '1px dashed green',
    background: 'transparent'
  },
  onDrop
});

subjx('.clone-clear').on('click', () => {
  Draggables.forEach(item => {
    item.disable();
    item.el.parentNode.removeChild(item.el);
  });
  Draggables.splice(0, Draggables.length);
});


    // tell the embed parent frame the height of the content
if (window.parent && window.parent.parent){
      window.parent.parent.postMessage(["resultsFrame", {
        height: document.body.getBoundingClientRect().height,
        slug: "7f45j8qk"
      }], "*")
    }

    // always overwrite window.name, in case users try to set it manually
window.name = "result"
