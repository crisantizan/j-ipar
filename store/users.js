import gql from 'graphql-tag';
import { libraryKeys } from '@/utils/constants';

export const state = () => ({
  users: [],
  librariesQuantity: {},
  usersIntegrations: [],
  integrations: null,
  messageErrorUsersIntegrations: null,
});

export const mutations = {
  SET_USERS(state, payload) {
    state.users = payload;
  },

  UPDATE_USER_DATA(state, { index, data }) {
    for (const prop in data) {
      state.users[index][prop] = data[prop];
    }
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

  UPDATE_LIBRARIES_QUANTITY(state, payload) {
    const keys = Object.keys(payload);

    for (const library of keys) {
      if (typeof state.librariesQuantity[library] === 'undefined') continue;

      state.librariesQuantity[library] = payload[library];
    }
  },

  SET_USERS_INTEGRATIONS(state, payload) {
    state.usersIntegrations = payload;
  },

  SET_INTEGRATIONS(state, payload) {
    state.integrations = payload;
  },

  CHECK_RELATION(state, payload) {
    state.usersIntegrations[
      state.usersIntegrations
        .map(a => a.userId)
        .indexOf(payload.userIntegrationId)
    ].linked = payload.linked;
  },

  SET_MESSAGE_ERROR_USERS_INTEGRATIONS(state, payload) {
    state.messageErrorUsersIntegrations = payload.message;
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
      if (a === libraryKeys.CORE.key) {
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
      libraryKeys.CORE.key,
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

    obj[libraryKeys.CORE.key] = getters.users.reduce(
      (acc, user) => (user.active ? acc + 1 : acc),
      0,
    );

    return obj;
  },

  getLibrariesAvailable(state, getters) {
    return key => {
      return getters.librariesQuantity[key] - getters.selected[key];
    };
  },

  usersIntegrations: state => state.usersIntegrations,

  integrations: state => state.integrations,

  messageErrorUsersIntegrations: state => state.messageErrorUsersIntegrations,
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
        const { data, errors } = await this.$axios.graphql({
          mutate,
          variables,
        });

        if (!!errors) {
          reject(errors);
          return;
        }

        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  },

  // RESEND EMAIL PHP ROUTE
  async resendEmail(store, userId) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.$axios({
          url: process.env.PRIMA_URL + `resend-email-from-admin?userId=${userId}`,
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

  // RESET PASSWORD PHP ROUTE
  async resetPassword(store, userId) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.$axios({
          url: process.env.PRIMA_URL + `reset-password-from-admin?userId=${userId}`,
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

  /** GET INTEGRATION USERS FOR RELATIONS USER **/
  getUsersIntegrations({ commit }, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data, errors } = await this.$axios.graphql({
          query: gql`
            query($userId: Int!) {
              usersIntegrations(userId: $userId) {
                userId
                integrationId
                linked
                email
                name
                prefix
                integration
              }
            }
          `,
          variables: payload,
        });

        if (data.usersIntegrations && data.usersIntegrations !== null) {
          commit('SET_USERS_INTEGRATIONS', data.usersIntegrations);

          // SET INFO FOR INTEGRATIONS FOR LIST ON USER RELATIONS MODAL

          let integrations = [];

          data.usersIntegrations.forEach(user => {
            if (
              integrations.map(a => a.id).indexOf(user.integrationId) === -1
            ) {
              integrations.push({
                id: user.integrationId,
                prefix: user.prefix,
                users: [user],
                name: user.integration,
              });
            } else {
              integrations[
                integrations.map(a => a.id).indexOf(user.integrationId)
              ].users.push(user);
            }
          });

          commit('SET_INTEGRATIONS', integrations);
        } else {
          commit('SET_MESSAGE_ERROR_USERS_INTEGRATIONS', {
            message: errors[0].message,
          });
        }

        resolve(true);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },

  /** UPDATE USER RELATIONS **/
  async updateUserRelations({ commit }, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await this.$axios.graphql({
          mutate: gql`
            mutation($relations: Array!) {
              userRelationAdd(relations: $relations) {
                _id
                userPrimaId
                userRelativeId
                partner
              }
            }
          `,
          variables: payload,
        });

        console.log(data);

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
              }
            }
          `,
          variables: { userId, userData },
        });

        commit('UPDATE_USER_DATA', { index, data: userData });
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  },

  // CHECK USER EMAIL EXIST PRIMA PHP
  async checkUserEmailExist(store, email) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await this.$axios({
          url: process.env.PRIMA_URL + `admin-check-user-exist-from-admin?email=${email}`,
          method: 'post',
          data: {
            token: this.getters.token,
          },
        });

        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  },

  // INVITE USER PRIMA PHP
  async adminInviteUser(store, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await this.$axios({
          url: process.env.PRIMA_URL + `admin-invite-user-from-admin?email=${payload.email}&firstName=${payload.firstName}&lastName=${payload.lastName}&tenantCode=${payload.tenant.code}&tenantName=${payload.tenant.name}`,
          method: 'post',
          data: {
            token: this.getters.token,
          },
        });

        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  },

  // GET USERS

  async getUsers({ commit, state }) {
    // data al ready loaded
    if (state.loaded) {
      return;
    }

    try {
      const { data } = await this.$axios.graphql({
        query: gql`
          query {
            users {
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
      });

      // set libraries quantity
      if (!!data.users.length) {

        // users module
        commit('SET_USERS', data.users);
      }
    } catch (error) {
      console.error(error);
    }
  },
};
