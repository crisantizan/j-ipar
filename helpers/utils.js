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
