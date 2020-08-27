export const state = () => ({
  invoices: [],
});

export const mutations = {
  SET_INVOICES(state, payload) {
    state.invoices = payload;
  },
};

export const getters = {
  invoices(state) {
    return state.invoices;
  },
};
