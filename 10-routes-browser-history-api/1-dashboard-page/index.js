import RangePicker from '../../08-forms-fetch-api-part-2/2-range-picker/index.js';
import SortableTable from '../../07-async-code-fetch-api-part-1/2-sortable-table-v3/index.js';
import ColumnChart from '../../07-async-code-fetch-api-part-1/1-column-chart/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
  element = null;
  subElements = {};
  components = {};
  get template() {
    return `
      <div class="dashboard">
        <div class="content__top-panel">
          <h2 class="page-title">Панель управления</h2>
          <div class="rangepicker" data-element="rangePicker"></div>
        </div>
        <div data-element="chartsRoot"git  class="dashboard__charts">
            <div class="dashboard__chart_orders" data-element="ordersChart"></div>
            <div class="dashboard__chart_sales" data-element="salesChart"></div>
            <div class="dashboard__chart_customers" data-element="customersChart"></div>
        </div>
        <h3 class="block-title">Лидеры продаж</h3>
        <div data-element="sortableTable"></div>
      </div>
    `;
  }
  initComponents = () => {
    const to = new Date();
    const from = new Date();
    from.setMonth(to.getMonth() - 1);
    const rangePicker = new RangePicker({
      from,
      to
    });

    const ordersChart = new ColumnChart({
      label: 'orders',
      link: '#',
      range: {
        from,
        to
      },
      url: 'api/dashboard/orders'
    });

    const salesChart = new ColumnChart({
      label: 'sales',
      range: {
        from,
        to,
      },
      url: 'api/dashboard/sales',
    });

    const customersChart = new ColumnChart({
      label: 'customers',
      range: {
        from,
        to,
      },
      url: 'api/dashboard/customers',
    });

    const sortableTable = new SortableTable(header, {
      isSortLocally: true,
      url: `api/dashboard/bestsellers?_start=1&_end=20&from=${from.toISOString()}&to=${to.toISOString()}`,
    });

    this.components = {
      rangePicker,
      ordersChart,
      salesChart,
      customersChart,
      sortableTable
    };
  }

  addedComponents = () => {
    Object.keys(this.components).forEach(item => {
      this.subElements[item].append(this.components[item].element);
    });
  }

  render = async () => {
    const wrapper = document.createElement('div');
    wrapper.insertAdjacentHTML('beforeend', this.template);

    this.element = wrapper.firstElementChild;

    this.getSubElements();
    this.initComponents();
    this.addedComponents();
    this.initEventListeners();

    return this.element;
  }

  updateComponents = async (from, to) => {
    const data = await this.loadData(from, to);
    
    const { sortableTable, ordersChart, salesChart, customersChart } = this.components;
    
    sortableTable._update(data);
    await Promise.all([
      ordersChart.update(from, to),
      salesChart.update(from, to),
      customersChart.update(from, to),
    ]);
  }

  loadData = async (from, to) => {
    const url = new URL('api/dashboard/bestsellers', BACKEND_URL);

    url.searchParams.set('from', from.toISOString());
    url.searchParams.set('to', to.toISOString());
    url.searchParams.set('_start', '1');
    url.searchParams.set('_end', '21');
    url.searchParams.set('_sort', 'title');
    url.searchParams.set('_order', 'asc');

    return await fetchJson(url);
  }

  initEventListeners = () => {
    this.components.rangePicker.element.addEventListener('date-select', event => {
      const { from, to } = event.detail;

      this.updateComponents(from, to);
    });
  }
  getSubElements = () => {
    this.subElements = [...this.element.querySelectorAll('[data-element]')]
    .reduce((acc, item) => {
      acc[item.dataset.element] = item;
      return acc;
    }, {});
  }
  remove = () => {
    this.element.remove();
  }
  destroy = () => {
    this.remove();
    this.subElements = {};
    this.element = null;

    Object.values(this.components).forEach(item => {
      item.destroy();
    });
  }
}
