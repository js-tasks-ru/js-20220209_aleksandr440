export default class NotificationMessage {
  element = {};
  static instance = 0;
  constructor(title, {duration = 1000, type = ''} = {}) {

    this.title = title;
    this.duration = duration;
    this.type = type;

    NotificationMessage.instance = this;

    this._render();

    if (typeof NotificationMessage.instance === 'object') {
      return NotificationMessage.instance;
    }

    return this;
  }
  _getTemplate = () => {
    return `
      <div class="notification ${this.type}" style="--value:${this.duration}ms">
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
        <div class="notification-body">
          ${this.title}
        </div>
      </div>
    </div>
    `;
  }
  _render = () => {
    const $wrapper = document.createElement('div');
    this.element = this._getTemplate();
    $wrapper.insertAdjacentHTML('beforeend', this.element);
    
    this.element = $wrapper.firstElementChild;
  }
  show = (el) => {
    if (el) {
      el.append(this.element);
    } else {
      document.body.append(this.element);
    }
    setTimeout(this.remove, this.duration);
  }
  destroy = () => {
    this.element.remove();
  }
  remove = () => {
    this.destroy();
  }
}