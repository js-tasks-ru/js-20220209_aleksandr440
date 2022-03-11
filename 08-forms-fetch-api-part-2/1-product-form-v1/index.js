import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  element = {};
  subElements = {};
  categories = [];
  product = null;
  images = [];
  url = '/api/rest/';
  defaultProduct = {
    title: '',
    description: '',
    subcategory: '',
    discount: 0,
    images: [],
    price: 100,
    quantity: 1,
    status: 1,
  }
  constructor (productId) {
    this.productId = productId;
  }
  get template() {
    const {discount, price, quantity} = this.defaultProduct;
    return `
      <div class = "product-form">
        <form data-element="productForm" class="form-grid">
            <div class="form-group form-group__half_left">
              <fieldset>
                <label for="title" class="form-label">Название товара</label>
                <input id="title" required="" type="text" name="title" class="form-control" placeholder="Название товара">
              </fieldset>
            </div>
            <div class="form-group form-group__wide">
              <label class="form-label">Описание</label>
              <textarea id="description" required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
            </div>
            <div class="form-group form-group__wide" data-element="sortable-list-container">
              <label class="form-label">Фото</label>
              <div data-element="imageListContainer">
                <ul class="sortable-list">
                  ${this._getItemListImages(this.images)}
                </ul>
              </div>
              <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
            </div>
            <div class="form-group form-group__half_left">
              <label class="form-label">Категория</label>
              <select id="subcategory" class="form-control" name="subcategory">
                ${this._getOptionsCategories(this.categories)}
              </select>
            </div>
              <div class="form-group form-group__half_left form-group__two-col">
              <fieldset>
                <label for="price" class="form-label">Цена ($)</label>
                <input id="price" required="" type="number" name="price" class="form-control" placeholder="${price}">
              </fieldset>
              <fieldset>
                <label for="discount" class="form-label">Скидка ($)</label>
                <input id="discount" required="" type="number" name="discount" class="form-control" placeholder="${discount}">
              </fieldset>
            </div>
            <div class="form-group form-group__part-half">
              <label for="quantity" class="form-label">Количество</label>
              <input id="quantity" required="" type="number" class="form-control" name="quantity" placeholder="${quantity}">
            </div>
            <div class="form-group form-group__part-half">
              <label for="status" class="form-label">Статус</label>
              <select id="status" class="form-control" name="status">
                <option value="1">Активен</option>
                <option value="0">Неактивен</option>
              </select>
            </div>
            <div class="form-buttons">
              <button type="submit" name="save" class="button-primary-outline">
                ${this.productId ? 'Сохранить' : 'Добавить'} товар
              </button>
            </div>
        </form>
      </div>
    `;
  }
  async save() {
    this.element.dispatchEvent(new Event('product-updated'));
    return;
  }
  _getItemListImages = data => {
    return data.map(({url, source}) => {
      return `
        <li class="products-edit__imagelist-item sortable-list__item" style="">
          <input type="hidden" name="url" value="${url}">
          <input type="hidden" name="source" value="${source}">
          <span>
            <img src="icon-grab.svg" data-grab-handle="" alt="grab">
            <img class="sortable-table__cell-img" alt="Image" src="${url}">
            <span>${source}</span>
          </span>
          <button type="button">
            <img src="icon-trash.svg" data-delete-handle="" alt="delete">
          </button>
        </li>
      `;
    }).join('');
  }
  _getOptionsCategories = data => {
    return data.reduce((acc, item) => {
      acc.push(...item.subcategories.map(subcat => {
        return `<option value="${subcat.id}">${item.title} &gt; ${subcat.title}</option>`;
      })); 
      return acc;
    }, []).join('');
  }
  loadData = async type => {
    switch (type) {
    case 'categories':
      const categoriesUrl = new URL(this.url + type, BACKEND_URL);
      categoriesUrl.searchParams.set('_sort', 'weight');
      categoriesUrl.searchParams.set('_refs', 'subcategory');
      return await fetchJson(categoriesUrl);
    case 'products':
      const productsUrl = new URL(this.url + type, BACKEND_URL);
      productsUrl.searchParams.set('id', this.productId);
      return await fetchJson(productsUrl);
    }
  }
  render = async () => {
    const categoriesPromise = this.loadData('categories');
    const productPromise = this.productId 
      ? this.loadData('products')
      : Promise.resolve(this.defaultProduct);
    const [categotiesData, productData] = await Promise.all([categoriesPromise, productPromise]);
    const [product] = productData;
    this.categories = categotiesData;
    this.product = product;
    this.images = product.images;
    this._renderForm();
    if (product) {
      this._setTextFields(product);
      this._initEventListeners();
    }
    return this.element;
  }
  _renderForm = () => {
    const $wrapper = document.createElement('div');
    $wrapper.insertAdjacentHTML('beforeend', this.template);
    this.element = $wrapper.firstElementChild;

    this.subElements = this._getSubElements(this.element);
  }
  _submitFormHandler = (e) => {
    e.preventDefault();
    
    if (this.productId) {
      this.save();
    } else {
      this.element.dispatchEvent(new Event('product-saved'));
    }
  }
  _setTextFields = (product) => {
    const form = this.subElements.productForm;
    const fieldsForm = Object.keys(this.defaultProduct).filter(item => !item.includes('images'));

    fieldsForm.forEach(field => {
      form.querySelector(`#${field}`).value = product[field];
    });
  }
  _initEventListeners = () => {
    this.subElements.productForm.addEventListener('submit', this._submitFormHandler);
  }
  _getSubElements = el => {
    return [...el.querySelectorAll('[data-element]')].reduce((acc, item) => {
      const { element } = item.dataset;
      acc[element] = item;
      return acc;
    }, {});
  }
  remove = () => {
    this.element.remove();
  }
  destroy = () => {
    this.element = null;
    this.subElements = null;
  }
}
