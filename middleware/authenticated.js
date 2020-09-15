export default async function ({store, redirect, route}) {
	if (!store.state.authenticated) {
			const isAuth = await store.dispatch('whoami');

			if (!isAuth && route.path !== '/access-denied') {
				return redirect('/access-denied')
			}

			store.commit('SET_AUTHENTICATED', isAuth);
	}

	if (store.state.authenticated && route.path === '/access-denied') {
		return redirect('/');
	}

	console.log('Authenticated');
	return;
}