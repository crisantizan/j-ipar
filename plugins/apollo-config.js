import apolloToken from '@/helpers/apollo-token';

const customFetch = (uri, options) => {
	const token = apolloToken.get();

	// add token if there's
	!!token && (uri = `${uri}?token=${token}`);

	return fetch(uri, options);
};

export default () => {
	return {
		httpLinkOptions: {
			uri: process.env.GRAPHQL_URL,
			fetch: customFetch,
		},
	};
};
