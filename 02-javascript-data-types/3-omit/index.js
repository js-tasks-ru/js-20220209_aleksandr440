/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  const keysValues = Object.entries(obj);
  const newObj = {...obj};
  for (const keyValue of keysValues) {
    for (const field of fields) {
      if (keyValue[0] === field) {
        delete newObj[field];
      }
    }
  }
  return newObj;
};
