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
      state.usersIntegrations.map(a => a.userId).indexOf(payload.userIntegrationId)
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
      libraryKeys.SOCIAL_SECURITY.key,
      libraryKeys.FEDERAL_COURT.key,
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

    obj[libraryKeys.FEDERAL_COURT.key] = getters.users.reduce((acc, user) => {
      const isChecked = user.assignLibraries[libraryKeys.FEDERAL_COURT.backendKey];

      return isChecked ? acc + 1 : acc;
    }, 0);

    obj[libraryKeys.SOCIAL_SECURITY.key] = getters.users.reduce((acc, user) => {
      const isChecked = user.assignLibraries[libraryKeys.SOCIAL_SECURITY.backendKey];

      return isChecked ? acc + 1 : acc;
    }, 0);

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
  /** change user role */
  async changeRole({ commit }, { index, userId, role }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data, errors } = await this.$axios.graphql({
          mutate: gql`
            mutation($userId: Int!, $role: rolesUser!) {
              userEdit(id: $userId, editUser: { role: $role }) {
                admin
              }
            }
          `,
          variables: { userId, role },
        });

        if (!!errors && errors.length > 0) {
          reject(errors);
          return;
        }

        commit('UPDATE_USER_DATA', { index, data: data.userEdit });
        resolve(data.userEdit);
      } catch (error) {
        reject(error);
      }
    });
  },

  /** change user is attorney */
  async changeIsAttorney({ commit }, { index, userId, isAttorney }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data, errors } = await this.$axios.graphql({
          mutate: gql`
            mutation($userId: Int!, $isAttorney: Boolean!) {
              userEdit(id: $userId, editUser: { isAttorney: $isAttorney }) {
                isAttorney
              }
            }
          `,
          variables: { userId, isAttorney },
        });

        if (!!errors && errors.length > 0) {
          reject(errors);
          return;
        }

        commit('UPDATE_USER_DATA', { index, data: data.userEdit });
        resolve(data.userEdit);
      } catch (error) {
        reject(error);
      }
    });
  },

  /** assign library to user **/
  assignLibrary(store, payload) {
    // payload: { userId: number, library: Object }
    return new Promise(async (resolve, reject) => {
      try {
        const { data, errors } = await this.$axios.graphql({
          mutate: gql`
            mutation($userId: Int!, $library: JSON!) {
              userEdit(id: $userId, editUser: { assignLibraries: $library }) {
                id
              }
            }
          `,
          variables: payload,
        });

        if (!!errors && errors.length > 0) {
          reject(errors);
          return;
        }

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
            userEdit(id: $userId, editUser: { active: $active, assignLibraries: $libraries }) {
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

        if (!!errors && errors.length > 0) {
          reject(errors);
          return;
        }

        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  },

  /** resend email php route */
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

  /** reset password php route */
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

  /** get integration users for relations user **/
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

          // set info for integrations for list on user relations modal
          let integrations = [];

          data.usersIntegrations.forEach(user => {
            if (integrations.map(a => a.id).indexOf(user.integrationId) === -1) {
              integrations.push({
                id: user.integrationId,
                prefix: user.prefix,
                users: [user],
                name: user.integration,
              });
            } else {
              integrations[integrations.map(a => a.id).indexOf(user.integrationId)].users.push(
                user,
              );
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
        reject(error);
      }
    });
  },

  /** update user relations **/
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
        const { data, errors } = await this.$axios.graphql({
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
                phone
                mobilePhone
                fax
                address
                addressAptSteFlrNumbertxt
                addressAptCk
                addressSteCk
                addressFloorCk
                city
                state
                zipCode
                foreignProvince
                foreignPostalCode
                country
                eoir
                licensingAuthority
                barNumber
                lawFirmName
                uscisElis
              }
            }
          `,
          variables: { userId, userData },
        });

        if (!!errors && errors.length > 0) {
          reject(errors);
          return;
        }

        commit('UPDATE_USER_DATA', { index, data: data.userEdit });
        resolve(data.userEdit);
      } catch (error) {
        reject(error);
      }
    });
  },

  /** check user email exist prima php */
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

  /** invite user prima php */
  async adminInviteUser(store, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await this.$axios({
          url:
            process.env.PRIMA_URL +
            `admin-invite-user-from-admin?email=${payload.email}&firstName=${payload.firstName}&lastName=${payload.lastName}&tenantCode=${payload.tenant.code}&tenantName=${payload.tenant.name}`,
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

  /** get users */
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
              phone
              mobilePhone
              fax
              address
              addressAptSteFlrNumbertxt
              addressAptCk
              addressSteCk
              addressFloorCk
              city
              state
              zipCode
              foreignProvince
              foreignPostalCode
              country
              eoir
              licensingAuthority
              barNumber
              lawFirmName
              uscisElis
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
