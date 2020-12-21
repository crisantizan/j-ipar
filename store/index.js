import gql from 'graphql-tag';
import { libraryKeys } from '@/utils/constants';

export const state = () => ({
  authenticated: false,
  loaded: false,
  loading: false,
  token: null,
  user: null,
  showWelcomeAlert: true,
});

export const mutations = {
  /** user logged **/
  SET_USER(state, payload) {
    state.user = payload;
  },

  SET_AUTHENTICATED(state, payload) {
    state.authenticated = payload;
  },

  SET_LOADED(state, loaded) {
    state.loaded = loaded;
  },

  SET_LOADING(state, loading) {
    state.loading = loading;
  },

  SET_TOKEN(state, token) {
    state.token = token;
  },

  SHOW_WELCOME_ALERT(state, payload) {
    state.showWelcomeAlert = payload;
  },
};

export const getters = {
  loaded: state => state.loaded,
  loading: state => state.loading,
  user: state => state.user,
  token: state => state.token,
  showWelcomeAlert: state => state.showWelcomeAlert,
};

export const actions = {
  async getAll({ commit, state }) {
    // data al ready loaded
    if (state.loaded) {
      return;
    }

    try {
      const { data } = await this.$axios.graphql({
        query: gql`
          query {
            tenant {
              id
              name
              email
              logoUrl
              billingAddress
              billingFirstName
              billingLastName
              statusId
              code
            }

            invoices: stripeInvoices {
              id
              created
              customerEmail
              defaultPaymentMethod
              total
              invoicePdf
            }

            plans: stripePlans {
              id
              currentPeriodEnd
              cancelAt
              canceledAt
              cancelAtPeriodEnd
              object
              active
              aggregateUsage
              amount
              amountDecimal
              billingScheme
              created
              currency
              interval
              intervalCount
              livemode
              metadata
              nickname
              product
              tiers
              tiersMode
              transformUsage
              trialPeriodDays
              usageType
              checked
              users
              coupon
            }

            paymentMethods: stripePaymentMethods {
              id
              card
            }

            customer: stripeCustomer {
              id
              invoiceSettings
              subsPrevious
            }

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
              addressFloorCk
              addressAptCk
              addressSteCk
              fax
              phone
              mobilePhone
              address
              addressAptSteFlrNumbertxt
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

      commit('SET_LOADED', true);
      // tenant module
      commit('tenant/SET_TENANT', data.tenant);
      // invoices module
      commit('invoices/SET_INVOICES', data.invoices);
      // plans module
      commit('plans/SET_ALL', data.plans || []);
      commit('plans/SET_CUSTOMER', data.customer);
      commit('plans/SET_PAYMENT_METHODS', data.paymentMethods || []);

      // set libraries quantity
      if (!!data.users.length) {
        const libraries = data.users[0].librariesQuantity;

        const obj = Object.keys(libraries).reduce((acc, key) => {
          switch (key) {
            case libraryKeys.CORE.backendKey:
              return { ...acc, [libraryKeys.CORE.key]: libraries[key] };

            case libraryKeys.SOCIAL_SECURITY.backendKey:
              return { ...acc, [libraryKeys.SOCIAL_SECURITY.key]: libraries[key] };

            case libraryKeys.FEDERAL_COURT.backendKey:
              return { ...acc, [libraryKeys.FEDERAL_COURT.key]: libraries[key] };

            default:
              return { ...acc, [key]: libraries[key] };
          }
        }, {});

        commit('users/SET_LIBRARIES_QUANTITY', obj);

        // users module
        commit('users/SET_USERS', data.users);
      }
    } catch (error) {
      console.error(error);
    }
  },

  whoami({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await this.$axios.graphql({
          query: gql`
            query {
              whoAmI {
                id
                firstName
                middleName
                lastName
                active
                admin
              }
            }
          `,
        });

        if (!state.user) {
          commit('SET_USER', data.whoAmI);
        }

        resolve(true);
      } catch (error) {
        console.log(error);
        resolve(false);
      }
    });
  },
};
