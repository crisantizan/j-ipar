import { librariesKeys } from '@/utils/constants';

/** convert camel case string to snake case **/
export function camelToSnakeCase(str) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/** transform object keys, from camel case to snake case **/
export function camelToSnakeCaseObj(obj) {
  return Object.keys(obj).reduce((newObj, key) => {
    return {
      ...newObj,
      // if the current element is other object
      [camelToSnakeCase(key)]:
        typeof obj[key] === 'object' && obj[key] !== null
          ? camelToSnakeCaseObj(obj[key])
          : obj[key],
    };
  }, {});
}

/** calculate plan discount **/
export function calcPlanDiscount(plan) {
  if (plan.discount === null) {
    return 0;
  }

  const { discount } = plan;

  const total = (plan.amount * plan.users) / 100;

  return discount.type === 'percent'
    ? (total * discount.value) / 100
    : Number(String(discount.value).slice(0, -2));
}

/** clone object **/
export function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/** plan is core */
export function planIsCore(nickname) {
  return nickname.toLowerCase().includes('core');
}

/** search value in a string */
export function includeValue(value, searchValue) {
  if (typeof value !== 'string' || typeof searchValue !== 'string') {
    throw new Error(
      'The params "value" and "searchValue" they should be a string',
    );
  }

  return value.toLowerCase().includes(searchValue.toLowerCase());
}

export function getPlanLibraryName(nickname) {
  for (const prop of librariesKeys) {
    if (includeValue(nickname, librariesKeys[prop].staticValue)) {
      return librariesKeys[prop].key;
    }
  }

  return null;
}
