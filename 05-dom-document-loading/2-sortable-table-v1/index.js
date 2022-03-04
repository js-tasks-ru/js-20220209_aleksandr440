export default class SortableTable {
  element = {};
  subElements = {};
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this._render();
  }

  _getTemplate = () => {
    return `
    <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this._renderRowHeading()}
        </div>
        <div data-element="body" class="sortable-table__body">
          ${this._renderRowBody(this.data)}
        </div>
      </div>
    </div>
    `;
  }
  _renderRowHeading = () => {
    return this.headerConfig.map(item => {
      return ` 
        <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
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
    return this.headerConfig.map(item => {
      if (item.template) {
        return item.template(product.images);
      }
      return `<div class="sortable-table__cell">${product[item.id]}</div>`;
    }).join('');
  }
  _render = () => {
    const $wrapper = document.createElement('div');
    $wrapper.insertAdjacentHTML('beforeend', this._getTemplate());

    this.element = $wrapper.firstElementChild;
    this.subElements = this._getSubElements(this.element);
  }
  sort = (field, order) => {
    const sortedData = this._sortData(field, order);
    const $allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const $currentColumn = this.element.querySelector(`.sortable-table__cell[data-id=${field}]`);

    $allColumns.forEach(item => item.dataset.order = '');
    $currentColumn.dataset.order = order;
    
    this.subElements.body.innerHTML = this._renderRowBody(sortedData);
  }
  _sortData = (field, order) => {
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
  }
}
