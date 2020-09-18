export default async function ({ app, store, redirect, route }) {
	/** SERVER SIDE **/

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

			process.token = route.query.token;
		}

		if (!store.state.authenticated) {
			// set token in apollo
			await app.$apolloHelpers.onLogin(app.$apolloHelpers.getToken() || process.token);

			const isAuth = await store.dispatch('whoami');

			if (!isAuth) {
				process.token = null;
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

		// authenticated, access granted
		if (store.state.authenticated) {
			process.token = app.$apolloHelpers.getToken();		

			// redirect to home
			if (route.path === '/access-denied') {
				return redirect('/');
			}

			// remove query
			if (Object.keys(route.query).length > 0) {
				return redirect(route.path);
			}

			return;
		}

		return;
	}

	/** CLIENT SIDE **/

	// no validation in /access-denied
	if (route.path === '/access-denied') {
		return;
	}

	// no token, redirect
	if (!app.$apolloHelpers.getToken()) {
		return redirect('/access-denied');
	}

	// there's token, validate
	const isAuth = await store.dispatch('whoami');

	// invalid token
	if (!isAuth) {
		return redirect('/access-denied');
	}

	return;
}
