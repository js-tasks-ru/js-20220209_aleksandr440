/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export const createGetter = path => {
  return obj => {
    const [firstLevel, ...paths] = path.split('.');
    let value = obj[firstLevel];
    if (value) {
      paths.forEach((item) => {
        value = value[item];
      });
    }
    return value;
  };
};
