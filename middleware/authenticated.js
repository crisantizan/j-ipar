export default async function({ app, store, redirect, route, $axios }) {
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
          return redirect('/subscription');
        }

        return;

      default:
        if (!process.token && !route.query.token) {
          return redirect('/access-denied');
        }

        !process.token && (process.token = route.query.token);

        if (!process.isAuth) {
          store.commit('SET_TOKEN', process.token);
          const isAuth = await store.dispatch('whoami');

          if (!isAuth) {
            return redirect('/access-denied');
          }

          // have query in URL, clear
          if (Object.keys(route.query).length > 0) {
            process.isAuth = true;
            return redirect('/subscription');
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
