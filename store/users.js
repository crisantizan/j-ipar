import gql from 'graphql-tag';

export const state = () => ({
  users: [],
  librariesQuantity: {},
});

export const mutations = {
  SET_USERS(state, payload) {
    state.users = payload;
  },

  UPDATE_USER_DATA(state, { index, data }) {
    state.users[index] = data;
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
  users: state => state.users.map((u, i) => ({ ...u, index: i })),

  isUpdate: (state, getters) => {
    const keys = Object.keys(getters.librariesQuantity);

    if (!keys.length) {
      return false;
    }

    const quantity = keys.reduce((acc, key) => {
      return acc + getters.librariesQuantity[key];
    }, 0);

    return quantity > 0;
  },

  libraries: (state, getters) => {
    const libraries = getters.librariesQuantity;

    const sorted = Object.keys(libraries).sort((a, b) => {
      if (a === 'Prima Facie') {
        return -1;
      }

      return 1;
    });

    return sorted.reduce((acc, key) => {
      if (libraries[key] > 0) {
        return { ...acc, [key]: libraries[key] };
      }

      return acc;
    }, {});
  },

  librariesQuantity(state) {
    const keys = Object.keys(state.librariesQuantity);

    if (!keys.length) {
      return {};
    }

    const availables = [
      ...Object.keys(state.users[0].assignLibraries),
      'Prima Facie',
    ];

    return keys.reduce((acc, key) => {
      if (availables.includes(key)) {
        return { ...acc, [key]: state.librariesQuantity[key] };
      }

      return acc;
    }, {});
  },

  selected(state, getters) {
    const obj = state.users.reduce((acc, user) => {
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
    }, {});

    obj['Prima Facie'] = getters.users.reduce(
      (acc, user) => (user.active ? acc + 1 : acc),
      0,
    );

    return obj;
  },
};

export const actions = {
  /** assign library to user **/
  assignLibrary(store, payload) {
    // payload: { userId: number, library: Object }
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await this.$axios.graphql({
          mutate: gql`
            mutation($userId: Int!, $library: JSON!) {
              userEdit(id: $userId, editUser: { assignLibraries: $library }) {
                id
              }
            }
          `,
          variables: payload,
        });

        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  },

  /** update user state **/
  updateState(store, { userId, active, libraries = null }) {
    return new Promise(async (resolve, reject) => {
      let mutate = null;
      let variables = { userId, active, libraries };

      if (libraries) {
        mutate = gql`
          mutation($userId: Int!, $active: Boolean!, $libraries: JSON!) {
            userEdit(
              id: $userId
              editUser: { active: $active, assignLibraries: $libraries }
            ) {
              id
            }
          }
        `;
      } else {
        mutate = gql`
          mutation($userId: Int!, $active: Boolean!) {
            userEdit(id: $userId, editUser: { active: $active }) {
              id
            }
          }
        `;

        variables = { userId, active };
      }

      try {
        const { data } = await this.$axios.graphql({
          mutate,
          variables,
        });

        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  },

  async resendEmail(store, userId) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.$axios({
          url: `https://staging.primafacieapp.com/resend-email-from-admin?userId=${userId}`,
          method: 'post',
          data: {
            token: this.getters.token,
          },
        });

        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  },

  async resetPassword(store, userId) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.$axios({
          url: `https://staging.primafacieapp.com/reset-password-from-admin?userId=${userId}`,
          method: 'post',
          data: {
            token: this.getters.token,
          },
        });

        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  },

  /** update user data **/
  async updateUser({ commit }, { index, userId, userData }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await this.$axios.graphql({
          mutate: gql`
            mutation($userId: Int!, $userData: editUser!) {
              userEdit(id: $userId, editUser: $userData) {
                id
                firstName
                middleName
                lastName
                email
                tenantCode
                isAttorney
                admin
                tenantCode
                active
                assignLibraries
                librariesQuantity
              }
            }
          `,
          variables: { userId, userData },
        });

        commit('UPDATE_USER_DATA', { index, data: data.userEdit });
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  },
};
