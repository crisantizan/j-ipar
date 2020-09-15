import gql from 'graphql-tag';

export const state = () => ({
  loaded: false,
  loading: false,
});

export const mutations = {
  SET_LOADED(state, loaded) {
    state.loaded = loaded;
  },

  SET_LOADING(state, loading) {
    state.loading = loading;
  },
};

export const getters = {
  loaded: state => state.loaded,
  loading: state => state.loading,
};

export const actions = {
  async getAll({ commit, state }) {
    // data al ready loaded
    if (state.loaded) {
      return;
    }

    // apollo client
    const client = this.app.apolloProvider.defaultClient;

    try {
      commit('SET_LOADING', true);

      const { data } = await client.query({
        query: gql`
          query {
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
            }
          }
        `,
      });

      commit('SET_LOADED', true);
      // invoices module
      commit('invoices/SET_INVOICES', data.invoices);
      // plans module
      commit('plans/SET_ALL', data.plans);
      commit('plans/SET_CUSTOMER', data.customer);
      commit('plans/SET_PAYMENT_METHODS', data.paymentMethods);

      // set libraries quantity
      if (!!data.users.length) {
        const libraries = data.users[0].librariesQuantity;

        const obj = Object.keys(libraries).reduce((acc, key) => {
          if (key !== 'Core') {
            return {...acc, [key]: libraries[key]};
          }

          // change "Core" key to "Prima Facie"
          return { ...acc, 'Prima Facie': libraries[key] };
        }, {});

        commit('users/SET_LIBRARIES_QUANTITY', obj);

        // users module
        commit('users/SET_USERS', data.users.slice(0, obj['Prima Facie']));
      }
    } catch (error) {
      console.error(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
};
