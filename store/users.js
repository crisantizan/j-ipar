export const state = () => ({
  users: [],
  amount: { California: 3, Immigration: 2 },
});

export const mutations = {
  SET_USERS(state, payload) {
    state.users = payload;
  },

  SET_CHECKED(state, { id, checked, library }) {
    // search user
    const user = state.users.find(user => user.id === id);

    if (!user) {
      return;
    }

    user.assignLibraries.forEach((val, index) => {
      // set new value
      if (val === library) {
        user.assignLibraries[index] = checked;
        return;
      }
    });
  },
};

export const getters = {
  users: state => state.users,
};
