export default class ColumnChart {
  subElements = {};
  chartHeight = 50;
  
  constructor(
    {
      data = [],
      label = '',
      value = 0,
      link = '',
      formatHeading = data => data
    } = {}) {
    this.data = data;
    this.label = label;
    this.value = formatHeading(value);
    this.link = link;
    
    this._render();
  }
  _getTemplate = () => {
    return `
    <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
    <div class="column-chart__title">
      Total ${this.label}
      ${this._getLink()}
    </div>
    <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">
          ${this.value}
        </div>
        <div data-element="body" class="column-chart__chart">
        ${this._createChartItem()}
      </div>
      <div data-element="js"></div>
    </div>
  </div>
    `;
  }
  _calcValuesArray = (data, chartHeight) => {
    const maxValue = Math.max(...data);
    const scale = chartHeight / maxValue;
    return this.data.map(item => {
      return {
        value: Math.floor(item * scale),
        percents: Math.round(item / maxValue * 100)
      };
    });
  }
  _createChartItem = () => {
    return this._calcValuesArray(this.data, this.chartHeight).reduce((accumString, {value, percents}) => {
      accumString += `<div style="--value: ${value}" data-tooltip="${percents}%"></div>`;
      return accumString;
    }, '');
  }
  _getLink = () => {
    return this.link ? `<a class="column-chart__link" href = ${this.link}>View all</a>` : '';
  }
  _render = () => {
    const $wrapper = document.createElement('div');
    $wrapper.insertAdjacentHTML('beforeend', this._getTemplate())
    
    this.element = $wrapper.firstElementChild;

    if (this.data.length) {
      this.element.classList.remove('column-chart_loading');
    } 
    this.subElements = this._getSubElements();

  }
  _getSubElements = () => {
    const result = {};
    const $els = document.querySelectorAll('[data-element]');
    $els.forEach(item => {
      const name = item.dataset.element;
      result[name] = item;
    });
    return result;
  }
  update = (newData) => {
    this.data = newData;
    this._calcValuesArray(newData, this.chartHeight);
    this.subElements.body.innerHTML = this._createChartItem();
  }
  destroy = () => {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
  remove = () => {
    if (this.element) {
      this.element.remove();
    }
  }
}
