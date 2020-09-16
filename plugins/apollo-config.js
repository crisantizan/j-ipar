const customFetch = (uri, options) => {
	// add token if there's
	if (!!options.headers.authorization) {
		const token = options.headers.authorization.split(' ')[1];

		uri = `${uri}?token=${token}`
	}

	return fetch(uri, options);
};

export default () => {
	return {
		httpLinkOptions: {
			uri: 'https://graph-staging.primafacieapp.com/graphql',
			fetch: customFetch,
		},
	};
};
