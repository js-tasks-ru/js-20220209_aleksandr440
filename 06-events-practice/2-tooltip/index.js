class Tooltip {
  static instace;
  element = {};
  constructor() {

    this._render();

    if (Tooltip.instace) {
      return Tooltip.instace;
    }
    Tooltip.instace = this;
  }
  _render = () => {
    const $wrapper = document.createElement('div');

    $wrapper.insertAdjacentHTML('beforeend', `
      <div class="tooltip">This is tooltip</div>
    `);

    this.element = $wrapper.firstElementChild;
  }
  _pointerOverHandler = (e) => {
    if (e.target.dataset.tooltip) {
      this.element.textContent = e.target.dataset.tooltip;
      document.body.append(this.element);
      console.log('#####', e.clientY);
      
      this.element.style.top = e.clientY + 'px';
      this.element.style.left = e.clientX + 'px';
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
}

export default Tooltip;
