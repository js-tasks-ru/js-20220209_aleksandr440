export default class SortableTable {
  element = {};
  subElements = {};
  isSortLocally = true;
  constructor(headerConfig, {
    data = [],
    sorted = {}
  } = {}) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;
    
    this._render();
    this.element.addEventListener('pointerdown', this._clickTableHandler);
  }
  _getTemplate = () => {
    return `
        <div class="sortable-table">
          <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this._renderRowHeading()}
          </div>
          <div data-element="body" class="sortable-table__body">
            ${this._renderRowBody(this.data)}
          </div>
        </div>
    `;
  }
  _renderRowHeading = () => {
    return this.headerConfig.map(item => {
      return ` 
        <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-active="heading">
          <span>${item.title}</span>
          <span data-element = "arrow" class = "sortable-table__sort-arrow">
            <span class = "sort-arrow"></span>
          </span>
        </div>
    `;
    }).join('');
  }
  _renderRowBody = (data) => {
    return data.map(product => {
      return `
      <a href="/products/${product.id}" class="sortable-table__row">
        ${this._renderSortableCell(product)}
      </a>
      `;
    }).join('');
  }
  _renderSortableCell = (product) => {
    return this.headerConfig.map(({template, id}) => {
      if (template) {
        return template(product[id]);
      }
      return `<div class="sortable-table__cell">${product[id]}</div>`;
    }).join('');
  }
  _clickTableHandler = (e) => {
    const headingCell = e.target.closest('[data-active="heading"]');
    
    if (headingCell.dataset.sortable === 'true') {
      const order = headingCell.dataset.order === 'desc' ? 'asc' : 'desc';
      
      this.sort(headingCell.dataset.id, order);
      headingCell.dataset.order = order;
    }
  }
  _render = () => {
    const $wrapper = document.createElement('div');
    $wrapper.insertAdjacentHTML('beforeend', this._getTemplate());

    this.element = $wrapper.firstElementChild;
    
    this.subElements = this._getSubElements(this.element);
    
    const { id, order } = this.sorted;

    if (id && order) {
      this.element.querySelector(`.sortable-table__cell[data-id=${id}]`).dataset.order = order;
      this.subElements.body.innerHTML = this._renderRowBody(this._sortDataOnClient(id, order));
    }
  }
  sort = (field, order) => {
    let sortedData = [];
    if (this.isSortLocally) {
      sortedData = this._sortDataOnClient(field, order);
    } else {
      sortedData = this._sortedDataOnServer();
    }
    
    const $allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');

    $allColumns.forEach(item => item.dataset.order = '');
    
    this.subElements.body.innerHTML = this._renderRowBody(sortedData);
  }

  _sortDataOnClient = (field, order) => {
    const newArr = [...this.data];
    const { sortType } = this.headerConfig.find(item => item.id === field);
    
    const directions = {
      asc: 1,
      desc: -1,
    };
    const direction = directions[order];
    
    return newArr.sort((a, b) => {
      switch (sortType) {
      case 'number':
        return direction * (a[field] - b[field]);
      case 'string':
        return direction * a[field].localeCompare(b[field], ['ru', 'en']);
      default:
        return direction * (a[field] - b[field]);
      }
    });
  }
  _sortedDataOnServer = () => {
    return;
  }
  _getSubElements = ($el) => {
    const result = {};
    const $els = $el.querySelectorAll('[data-element]');
    $els.forEach(item => {
      const name = item.dataset.element;
      result[name] = item;
    });
    
    return result;
  }
  destroy = () => {
    this.element.remove();
  }
  remove = () => {
    this.destroy();
    this.element = null;
    this.subElements = null;
    this.element.removeEventListener(this._clickTableHandler);
  }
}
