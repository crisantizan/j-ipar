export const state = () => ({
	tenant: null,
});

export const mutations = {
	SET_TENANT(state, payload) {
		state.tenant = payload;
	},
}

export const getters = {
	tenant: state => state.tenant,
}