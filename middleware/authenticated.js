export default async function ({app, store, redirect, route}) {
	if (!app.$apolloHelpers.getToken()) {
		console.log('Añadiendo token');
		await app.$apolloHelpers.onLogin('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6OTYsInRlbmFudENvZGUiOiJCNkdMVTIxNjA0MTk4MTciLCJlbWFpbCI6Imp1ZmVvcjkzM0BnbWFpbC5jb20iLCJ1c2VySWQiOjEsInNlc3Npb25JZCI6Ijk0ZjhjNDMzLTNhNjMtNGNkNC05YjM3LTcwOTlkMWEyZWNmMCIsImlhdCI6MTYwMDIyNDkxMiwiZXhwIjoxNjAwODI5NzEyfQ.HHV4vot1_C3OB6mAFA2tT5zFulr9ZfjXx6D3650O1v4')
	}

	if (!store.state.authenticated) {
			await app.$apolloHelpers.onLogin('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6OTYsInRlbmFudENvZGUiOiJCNkdMVTIxNjA0MTk4MTciLCJlbWFpbCI6Imp1ZmVvcjkzM0BnbWFpbC5jb20iLCJ1c2VySWQiOjEsInNlc3Npb25JZCI6Ijk0ZjhjNDMzLTNhNjMtNGNkNC05YjM3LTcwOTlkMWEyZWNmMCIsImlhdCI6MTYwMDIyNDkxMiwiZXhwIjoxNjAwODI5NzEyfQ.HHV4vot1_C3OB6mAFA2tT5zFulr9ZfjXx6D3650O1v4')
			const isAuth = await store.dispatch('whoami');

			if (!isAuth && route.path !== '/access-denied') {
				return redirect('/access-denied')
			}

			store.commit('SET_AUTHENTICATED', isAuth);
	}

	if (store.state.authenticated && route.path === '/access-denied') {
		return redirect('/');
	}

	return;
}