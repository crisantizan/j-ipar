export const state = () => ({
  users: [],
  librariesQuantity: {},
/*  librariesQuantity: {
    Immigration: 0,
    Michigan: 0,
    Illinois: 0,
    CookCountyIl: 0,
    California: 0,
    Canada: 0,
    Australia: 0,
  },*/
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

  SET_ACTIVE(state, { index, value }) {
    state.users[index].active = value;
  },

  SET_LIBRARIES_QUANTITY(state, payload) {
    state.librariesQuantity = payload;
  },
};

export const getters = {
  users: state => state.users,

  libraries: (state, getters) => {
    return Object.entries(getters.librariesQuantity).reduce(
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
    const keys = Object.keys(state.librariesQuantity);

    if (!keys.length) {
      return {};
    }

    // const skip = 'Core';
    const availables = Object.keys(state.users[0].assignLibraries);

    return Object.keys(state.librariesQuantity).reduce((acc, key) => {
      if (availables.includes(key)) {
        return { ...acc, [key]: state.librariesQuantity[key] };
      }

      return acc;
    }, {});
  },

  selected(state) {
    return state.users.reduce(
      (acc, user) => {
        for (const key in user.assignLibraries) {
          const isChecked = user.assignLibraries[key];

          const val = typeof acc[key] === 'undefined' ? 0 : acc[key];

          if (isChecked) {
            acc[key] = val + 1;
          } else {
            acc[key] = val;
          }

        }

        return acc;
      },
      {});
  },
};
