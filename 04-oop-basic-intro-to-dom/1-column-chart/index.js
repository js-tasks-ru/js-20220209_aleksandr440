export default class ColumnChart {
  constructor({data = [], label, value, link, formatHeading} = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;
    this.chartHeight = 50;
    
    this._render();
  }
  _createElement = (tag, className) => {
    const $el = document.createElement(tag);
    $el.classList.add(className);

    return $el;
  }
  _createTitle = () => {
    const $title = this._createElement('div', 'column-chart__title');
    $title.textContent = this.label;
    if (this.link) {
      const $link = this._createElement('a', 'column-chart__link');
      $link.href = this.link;
      $link.textContent = 'View all';
      $title.append($link);
    }
    
    return $title;
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
    return this._calcValuesArray(this.data, this.chartHeight).map(({value, percents}) => {
      return `<div style="--value: ${value}" data-tooltip="${percents}%"></div>`;
    });
  }
  _createChart = () => {
    const $chartContainer = this._createElement('div', 'column-chart__container');
    const $chartHeader = this._createElement('div', 'column-chart__header');
    if (this.formatHeading) this.value = this.formatHeading(this.value);

    $chartHeader.textContent = this.value;
    $chartHeader.dataset.element = 'header';
    
    const $chartBody = this._createElement('div', 'column-chart__chart');
    $chartBody.dataset.element = 'body';
    $chartContainer.append($chartHeader);
    $chartContainer.append($chartBody);

    if (this.data.length) {
      this._createChartItem().forEach(item => {
        $chartBody.insertAdjacentHTML('beforeend', item);
      });
    } 

    return $chartContainer;
  }
  update = (newData) => {
    this.data = newData;
  }
  destroy = () => {
    this.element = null;
  }
  remove = () => {
    this.destroy();
  }
  _render = () => {
    const $columnChart = this._createElement('div', 'column-chart');
    if (!this.data.length) $columnChart.classList.add('column-chart_loading');
    $columnChart.style = '--chart-height: 50';
    $columnChart.append(this._createTitle());
    $columnChart.append(this._createChart());

    this.element = $columnChart;
  }
}
