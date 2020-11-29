import { print } from 'graphql/language/printer';

export default function ({ $axios, store, redirect }) {
	// inject «graphql» method to axios instance
	$axios.graphql = data => $axios.$post('/', { ...data, isGraphql: true });

	const props = ['query', 'mutate'];

	// axios request interceptor
	$axios.onRequest(config => {
		// show loading
		!store.state.loading && store.commit('SET_LOADING', true);

		// only using graphql method
		if (config.data.isGraphql) {
			delete config.data.isGraphql;

			// set token
			!!store.state.token && (config.url += `?token=${store.state.token}`);

			for (const prop in config.data) {
				// format query and mutation
				props.includes(prop) &&
					(config.data['query'] = print(config.data[prop]));
			}
		}
	});

	// axios response interceptor
	$axios.onResponse(config => {
		// hide loading
		store.state.loading && store.commit('SET_LOADING', false);
	});

	// axios error interceptor
	$axios.onError(err => {
		// only in client side
		if (process.server) return;

		// hide loading
		store.state.loading && store.commit('SET_LOADING', false);

		// unauthorized and forbidden status codes
		const codes = [401, 403];

		// redirect to access denied page
		if (codes.includes(err.response.status)) {
			redirect('/access-denied');
		}
	});
}
