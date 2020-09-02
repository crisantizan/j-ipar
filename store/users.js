export const state = () => ({
  users: [],
  librariesQuantity: {
    Immigration: 3,
    Michigan: 0,
    Illinois: 0,
    CookCountyIl: 0,
    California: 3,
    Canada: 0,
    Australia: 0,
  },
});

export const mutations = {
  SET_USERS(state, payload) {
    state.users = payload;
  },

  SET_CHECKED(state, { checked, library, index }) {
    state.users[index].assignLibraries[library] = checked;
  },

  SET_IS_ATTORNEY_CHECKED(state, { index, checked }) {
    state.users[index].isAttorney = checked;
  },

  // SET_CHECKED(state, { id, checked, library }) {
  //   // search user
  //   const user = state.users.find(user => user.id === id);

  //   if (!user) {
  //     return;
  //   }

  //   user.assignLibraries.forEach((val, index) => {
  //     // set new value
  //     if (val === library) {
  //       user.assignLibraries[index] = checked;
  //       return;
  //     }
  //   });
  // },

  UPDATE_LIBRARY_QUANTITY(state, library) {
    // state.librariesQuantity[]
  },
};

export const getters = {
  users: state => state.users,

  libraries: state => {
    return Object.entries(state.librariesQuantity).reduce(
      (acc, [key, value]) => {
        if (value > 0) {
          return { ...acc, [key]: value };
        }

        return acc;
      },
      {},
    );
  },

  librariesQuantity(state) {
    return state.librariesQuantity;
  },

  selected(state) {
    return state.users.reduce(
      (acc, user) => {
        for (const key in user.assignLibraries) {
          const isChecked = user.assignLibraries[key];

          if (isChecked) {
            acc[key] += 1;
          }
        }

        return acc;
      },
      {
        Immigration: 0,
        Michigan: 0,
        Illinois: 0,
        CookCountyIl: 0,
        California: 0,
        Canada: 0,
        Australia: 0,
      },
    );
  },
};
