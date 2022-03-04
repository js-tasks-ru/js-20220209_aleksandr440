class Tooltip {
  static instace;
  element = {};
  constructor() {
    if (Tooltip.instace) {
      return Tooltip.instace;
    }
    Tooltip.instace = this;
  }
  render = (title) => {
    const $wrapper = document.createElement('div');
    $wrapper.insertAdjacentHTML('beforeend', `<div class="tooltip">${title}</div>`);
    this.element = $wrapper.firstElementChild;
    document.body.append(this.element);
  }
  _pointerOverHandler = (e) => {
    if (e.target.dataset.tooltip) {
      this.render(e.target.dataset.tooltip);
      this.element.style.top = (e.offsetY + 10) + 'px';
      this.element.style.left = (e.offsetX + 10) + 'px';

      document.removeEventListener('pointerout', this._pointerOutHandler);
    }
  }
  _pointerOutHandler = (e) => {
    if (e.target.dataset.tooltip) {
      this.element.remove();
      document.removeEventListener('pointerover', this._pointerOverHandler);
    }
  }
  initialize = () => {
    document.body.addEventListener('pointerover', this._pointerOverHandler);
    document.body.addEventListener('pointerout', this._pointerOutHandler);
  }
  destroy = () => {
    this.element.remove();
  }
  remove = () => {
    this.element = null;
    document.removeEventListener('pointerover', this._pointerOverHandler);
    document.removeEventListener('pointerout', this._pointerOutHandler);
  }
}

export default Tooltip;
