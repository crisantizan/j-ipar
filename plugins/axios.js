import { print } from 'graphql/language/printer';

export default function ({ $axios, store }) {
	// inject «graphql» method to axios instance
	$axios.graphql = data => $axios.$post('/', { ...data, isGraphql: true });

	const props = ['query', 'mutate'];

	// axios request interceptor
	$axios.onRequest(config => {
		// only using graphql method
		if (config.data.isGraphql) {
			delete config.data.isGraphql;

			// set token
			!!store.state.token && (config.url += `?token=${store.state.token}`);

			for (const prop in config.data) {
				// format query and mutation
				props.includes(prop) && (config.data['query'] = print(config.data[prop]));
			}
		}
	});
}
