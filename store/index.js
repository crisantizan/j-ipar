import gql from 'graphql-tag';
// data saved locally
// import data from '../data.json';

export const state = () => ({
  loaded: false,
});

export const mutations = {
  SET_LOADED(state, loaded) {
    state.loaded = loaded;
  },
};

export const getters = {
  loaded: state => state.loaded,
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
      // users module
      commit('users/SET_USERS', data.users);
    } catch (error) {
      console.error(error);
    }
  },
};
