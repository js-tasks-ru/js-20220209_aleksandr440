/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  const keysValues = Object.entries(obj);
  const newObj = {};
  for (const keyValue of keysValues) {
    for (const field of fields) {
      if (keyValue[0] === field) {
        newObj[field] = keyValue[1];
      }
    }
  }
  return newObj;
};