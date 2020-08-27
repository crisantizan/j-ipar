import gql from 'graphql-tag';

export const state = () => ({
  loaded: false,
});

export const mutations = {
  SET_LOADED(state, loaded) {
    state.loaded = loaded;
  },
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
              currency
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
          }
        `,
      });
      console.log({ ...data });
      commit('SET_LOADED', true);
    } catch (error) {
      console.error(error);
    }
  },
};
