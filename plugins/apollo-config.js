const customFetch = (uri, options) => {
	console.log(options);
	const x = options.headers.authorization.split(' ')[1];

	return fetch(`${uri}?token=${x}`, options);
};

export default () => {
	return {
		httpLinkOptions: {
			uri: 'https://graph-staging.primafacieapp.com/graphql',
			fetch: customFetch,
		},
	};
};
