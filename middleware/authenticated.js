export default async function ({ app, store, redirect, route, $axios }) {
	/** SERVER SIDE **/

	if (process.server) {
		switch (route.path) {
			case '/access-denied':
				if (!route.query.token) {
					process.token = null;
					process.isAuth = null;
					return;
				}

				process.token = route.query.token;
				store.commit('SET_TOKEN', process.token);

				// token valid, redirect to home
				if (await store.dispatch('whoami')) {
					return redirect('/');
				}

				return;

			default:
				// if (!process.token && !route.query.token) {
				// 	return redirect('/access-denied');
				// }

				// !process.token && (process.token = route.query.token);

				// !process.token && (process.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6OTYsInRlbmFudENvZGUiOiJCNkdMVTIxNjA0MTk4MTciLCJlbWFpbCI6Ikp1ZmVvcjkzM0BnbWFpbC5jb20iLCJ1c2VySWQiOjEsInNlc3Npb25JZCI6ImNjYzQyZWI1LTAxNzQtNGFjMC04OGMyLTBlNGRhY2E0NTM0ZiIsImlhdCI6MTYwNDI1OTQyOCwiZXhwIjoxNjA0ODY0MjI4fQ.17utffhgw0qpcmI9wy0ilKQ2fsNUlnOwlDa6H1tEG9E');
				!process.token && (process.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6OTYsInRlbmFudENvZGUiOiJCNkdMVTIxNjA0MTk4MTciLCJlbWFpbCI6Ikp1ZmVvcjkzM0BnbWFpbC5jb20iLCJ1c2VySWQiOjEsInNlc3Npb25JZCI6ImNjYzQyZWI1LTAxNzQtNGFjMC04OGMyLTBlNGRhY2E0NTM0ZiIsImlhdCI6MTYwNDI1OTQyOCwiZXhwIjoxNjA0ODY0MjI4fQ.17utffhgw0qpcmI9wy0ilKQ2fsNUlnOwlDa6H1tEG9I');

				if (!process.isAuth) {
					store.commit('SET_TOKEN', process.token);
					const isAuth = await store.dispatch('whoami');

					if (!isAuth) {
						return redirect('/access-denied');
					}

					// have query in URL, clear
					if (Object.keys(route.query).length > 0) {
						process.isAuth = true;
						return redirect(route.path);
					}
				}

				// URL clean, get data from server

				// set token
				store.commit('SET_TOKEN', process.token);
				// set as authenticated
				store.commit('SET_AUTHENTICATED', true);
				// get user data
				await store.dispatch('whoami');
				// get data
				await store.dispatch('getAll');

				process.isAuth = null;
				process.token = null;
				return;
		}
	}

	/** CLIENT SIDE **/

	// no validation in /access-denied
	if (route.path === '/access-denied') {
		return;
	}

	// no token, redirect
	if (!store.state.token) {
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
