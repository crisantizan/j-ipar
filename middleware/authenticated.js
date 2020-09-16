export default async function ({ app, store, redirect, route }) {
	if (process.server) {
		// not token provided
		if (!app.$apolloHelpers.getToken() && !process.token) {
			// if not token in URL
			if (!route.query.token) {
				store.commit('SET_TOKEN', '');
				// redirect to /access-denied
				route.path !== '/access-denied' && redirect('/access-denied');
				return;
			}

			// get token in URL
			const { token } = route.query;
			// set token in apollo (as cookie)
			await app.$apolloHelpers.onLogin(token);
		}

		if (!store.state.authenticated) {
			// set token in apollo
			await app.$apolloHelpers.onLogin(app.$apolloHelpers.getToken() || process.token);

			const isAuth = await store.dispatch('whoami');

			if (!isAuth) {
				store.commit('SET_TOKEN', '');

				// redirect
				route.path !== '/access-denied' && redirect('/access-denied');
				return;
			}

			store.commit('SET_AUTHENTICATED', isAuth);

			// get data
			await store.dispatch('getAll');

			// set token to use in client
			store.commit('SET_TOKEN', app.$apolloHelpers.getToken() || process.token);
			process.token = null;
		}

		// authenticated
		if (store.state.authenticated) {
			process.token = app.$apolloHelpers.getToken();		

			// redirect to home
			route.path === '/access-denied' && redirect('/');
			return;
		}
	}

	return;
}
