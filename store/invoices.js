import gql from 'graphql-tag';

export const state = () => ({
  invoices: [],
});

export const mutations = {
  SET_INVOICES(state, payload) {
    state.invoices = payload;
  },
};

// export const actions = {
//   async getInvoices({ commit, state }) {
//     // load invoices one time
//     if (!!state.invoices.length) {
//       return;
//     }

//     // apollo client
//     const client = this.app.apolloProvider.defaultClient;

//     try {
//       const { data } = await client.query({
//         query: gql`
//           query {
//             stripeInvoices {
//               id
//               created
//               customerEmail
//               defaultPaymentMethod
//               currency
//               total
//               invoicePdf
//             }
//           }
//         `,
//       });

//       commit('SET_INVOICES', data.stripeInvoices);
//     } catch (error) {
//       console.error(error);
//     }
//   },
// };

export const getters = {
  invoices(state) {
    return state.invoices;
  },
};
