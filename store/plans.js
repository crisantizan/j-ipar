import gql from 'graphql-tag';

const helpers = {
  calcTotalPaid(acc, plan) {
    if (!plan.checked) {
      return acc;
    }
    const totalPlan = (plan.amount * plan.users) / 100;
    return acc + (totalPlan - plan.discount);
  },
};

export const state = () => ({
  all: [],
  period: 'month',
  month: [],
  year: [],
  paymentMethods: [],
  customer: null,
  defaultCheckedUsers: {
    core: ['price_1Gv7zkEHlNK1KgjMGy4WHzUf', 'price_1Gv80DEHlNK1KgjMaPRisapB'],
    month: [
      { name: 'california', id: 'price_1GrnVtEHlNK1KgjMvTmvPR5f' },
      { name: 'immigration', id: 'price_1GrnRoEHlNK1KgjMXEMUQh3q' },
    ],
    year: [
      { name: 'california', id: 'price_1GrnVtEHlNK1KgjMs3hjm4MU' },
      { name: 'immigration', id: 'price_1GrnTXEHlNK1KgjMULxeVjhQ' },
    ],
  },
  lastChangedPlan: null,
});

export const mutations = {
  SET_ALL(state, plans) {
    // add custom fields
    state.all = plans.map(plan => ({
      ...plan,
      // manage cupon data
      cuponId: { value: '', valid: null },
      // for apply cupon discount
      discount: 0,
    }));
  },

  SET_MONTHLY(state, plans) {
    state.month = plans;
  },

  SET_YEARLY(state, plans) {
    state.year = plans;
  },

  SET_PERIOD(state, period) {
    state.period = period;
  },

  SET_CUPON(state, { index, value, period }) {
    const plan = state[period][index];

    plan.cuponId.value = value;

    if (plan.cuponId.valid !== null) {
      plan.cuponId.valid = null;
    }

    // remove discount
    if (plan.discount > 0) {
      plan.discount = 0;
    }
  },

  SET_CUPON_STATE(state, { index, value, period, discount = null }) {
    // discount: { value: Number, type: 'percent' | 'amount' }
    const plan = state[period][index];

    plan.cuponId.valid = value;

    // apply cupon discount
    if (discount !== null) {
      const total = (plan.amount * plan.users) / 100;

      const discountTotal =
        discount.type === 'percent'
          ? (total * discount.value) / 100
          : Number(String(discount.value).slice(0, -2));

      plan.discount = discountTotal;
    }
  },

  /** update "checked" and "users" plan properties */
  SET_CHECKED_OR_USERS(state, { prop, value, index }) {
    // current plan
    const current = state[state.period][index];

    // get other period
    const otherPeriod = state.period === 'month' ? 'year' : 'month';
    const other = state[otherPeriod][index];

    // set new value
    current[prop] = value;
    other[prop] = value;
  },

  SET_LAST_CHANGED_PLAN(state, id) {
    state.lastChangedPlan = id;
  },

  UPDATE_SPECIAL_USERS(state, { value, oldValue, index, period, mainPlan }) {
    state[period][index].users = value;

    // update main value
    if (mainPlan !== null) {
      state[period][mainPlan.index].users = mainPlan.newValue;
    }
  },

  SET_PAYMENT_METHODS(state, payload) {
    state.paymentMethods = payload;
  },

  SET_CUSTOMER(state, payload) {
    state.customer = payload;
  },

  CHANGE_DEFAULT_CUSTOMER(state, payload) {
    state.customer.invoiceSettings.default_payment_method = payload;
  },

  ADD_PAYMENT_METHOD(state, payload) {
    // payload: { id, card }
    state.paymentMethods.unshift(payload);

    // max 10
    if (state.paymentMethods.length > 10) {
      // delete last element
      state.paymentMethods.pop();
    }
  },

  REMOVE_PAYMENT_METHOD(state, id) {
    const index = state.paymentMethods.findIndex(v => v.id === id);

    if (index === -1) {
      return;
    }

    // remove element
    state.paymentMethods.splice(index, 1);
  },
};

export const getters = {
  plans(state) {
    return state.all;
  },

  period(state) {
    return state.period;
  },

  show(state) {
    return state[state.period];
  },

  totalPaid(state) {
    return state[state.period].reduce(helpers.calcTotalPaid, 0);
  },

  defaultCheckedUsers(state) {
    return state.defaultCheckedUsers;
  },

  getDefaultCheckedPlans(state) {
    // by period selected
    const [california, immigration] = state.defaultCheckedUsers[state.period];

    const californiaIndex = state[state.period].findIndex(
      v => v.id === california.id,
    );

    const immigrationIndex = state[state.period].findIndex(
      v => v.id === immigration.id,
    );

    return {
      california: {
        value: state[state.period][californiaIndex],
        index: californiaIndex,
      },
      immigration: {
        value: state[state.period][immigrationIndex],
        index: immigrationIndex,
      },
    };
  },

  planIsMain(state) {
    return id => state.defaultCheckedUsers.core.includes(id);
  },

  mainPlan(state) {
    const ids = state.defaultCheckedUsers.core;

    return period => {
      const index = state[period].findIndex(v => ids.includes(v.id));
      return { index, value: state[period][index] };
    };
  },

  isDefaultCheckedUser({ defaultCheckedUsers, period }, getters) {
    return plan => {
      const index = getters.show.findIndex(v => v.id === plan.id);

      if (index === -1) {
        return false;
      }

      return defaultCheckedUsers[period].some(v => v.id === plan.id);
    };
  },

  customer(state) {
    return state.customer;
  },

  paymentMethods(state) {
    return state.paymentMethods;
  },
};

export const actions = {
  async addSubscription({ commit, state }, plans) {
    // apollo client
    const client = this.app.apolloProvider.defaultClient;

    try {
      commit('SET_LOADING', true, { root: true });

      const result = await client.mutate({
        mutation: gql`
          mutation($plans: Array!) {
            stripeSubscripterAdd(newSubscripter: { plans: $plans }) {
              id
              object
              applicationFeePercent
              billingCycleAnchor
              billingThresholds
              cancelAt
              cancelAtPeriodEnd
              canceledAt
              collectionMethod
              created
              currentPeriodEnd
              currentPeriodStart
              customer
              daysUntilDue
              defaultPaymentMethod
              defaultSource
              defaultTaxRates
              discount
              endedAt
              items
              latestInvoice
              livemode
              metadata
              nextPendingInvoiceItemInvoice
              quantity
              status
            }
          }
        `,
        fetchPolicy: 'no-cache',
        variables: { plans },
      });

      // refresh payment methods
      console.log({ ...result });
    } catch (err) {
      console.error(err);
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },

  async getPaymentMethods({ commit, state }) {
    // apollo client
    const client = this.app.apolloProvider.defaultClient;

    try {
      commit('SET_LOADING', true, { root: true });

      const { data } = await client.query({
        query: gql`
          query {
            paymentMethods: stripePaymentMethods {
              id
              card
            }
          }
        `,
        fetchPolicy: 'no-cache',
      });

      // refresh payment methods
      commit('SET_PAYMENT_METHODS', data.paymentMethods);
    } catch (err) {
      console.error(err);
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },
};
