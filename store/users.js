export const state = () => ({
  users: [],
});

export const mutations = {
  SET_USERS(state, payload) {
    state.users = payload;
  },
};

export const getters = {
  users: state => state.users,
};
