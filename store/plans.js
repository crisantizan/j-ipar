import gql from 'graphql-tag';
import { calcPlanDiscount } from '@/helpers/utils';

// const helpers = {
//   calcTotalPaid(acc, plan) {
//   if (!plan.checked) {
//     return acc;
//   }
//   const totalPlan = (plan.amount * plan.users) / 100;
//   return acc + (totalPlan - calcPlanDiscount(plan.discount));
// },
// };

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
  subscribed: false,
  subscriptionDefaults: [],
});

export const mutations = {
  SET_ALL(state, plans) {
    state.all = plans;
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

  SET_FULL_CUPON(state, { index, value }) {
    // const mirrorPeriod = state.period === 'month' ? 'year' : 'month';
    state[state.period][index].coupon = value;
    state[this.getters['plans/mirrorPeriod']][index].coupon = value;
  },

  SET_CUPON(state, { index, value }) {
    const plan = state[state.period][index];
    const mirrorPlan = state[this.getters['plans/mirrorPeriod']][index];

    plan.couponId.value = value;
    mirrorPlan.couponId.value = value;

    if (plan.couponId.valid !== null) {
      plan.couponId.valid = null;
      mirrorPlan.couponId.valid = null;
    }

    // remove discount
    if (plan.discount !== null) {
      plan.discount = null;
      mirrorPlan.discount = null;
    }
  },

  SET_CUPON_STATE(state, { index, value, discount = null }) {
    // discount: { value: Number, type: 'percent' | 'amount' }
    const plan = state[state.period][index];
    const mirrorPlan = state[this.getters['plans/mirrorPeriod']][index];

    plan.couponId.valid = value;
    mirrorPlan.couponId.valid = value;

    if (value === false) {
      plan.couponId.value = '';
      mirrorPlan.couponId.value = '';
    }

    // apply cupon discount
    if (discount !== null) {
      // const total = (plan.amount * plan.users) / 100;

      // const discountTotal =
      //   discount.type === 'percent'
      //     ? (total * discount.value) / 100
      //     : Number(String(discount.value).slice(0, -2));

      // plan.discount = discountTotal;
      plan.discount = discount;
      mirrorPlan.discount = discount;
    }
  },

  /** update "checked" and "users" plan properties */
  SET_CHECKED_OR_USERS(state, { prop, value, index }) {
    // current plan
    const current = state[state.period][index];
    // get other period
    const other = state[this.getters['plans/mirrorPeriod']][index];

    // set new value
    current[prop] = value;
    other[prop] = value;
  },

  SET_LAST_CHANGED_PLAN(state, id) {
    state.lastChangedPlan = id;
  },

  UPDATE_USERS(state, { value, oldValue, index, mainPlan }) {
    const mirrorPeriod = this.getters['plans/mirrorPeriod'];

    state[state.period][index].users = value;
    state[mirrorPeriod][index].users = value;

    // update main value
    if (mainPlan !== null) {
      state[state.period][mainPlan.index].users = mainPlan.newValue;
      state[mirrorPeriod][mainPlan.index].users = mainPlan.newValue;
    }
  },

  SET_PAYMENT_METHODS(state, payload) {
    state.paymentMethods = payload;
  },

  SET_CUSTOMER(state, payload) {
    state.customer = payload;
  },

  CHANGE_DEFAULT_CUSTOMER(state, payload) {
    if (state.customer.invoiceSettings === null) {
      state.customer.invoiceSettings = {
        default_payment_method: payload,
      };

      return;
    }

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

  SET_SUBSCRIBED(state, payload) {
    state.subscribed = payload;
  },

  /** current subscription default values (TODO:: not used) **/
  SET_SUBSCRIPTION_DEFAULTS(state) {
    state.subscriptionDefaults = state.month.reduce((acc, plan, index) => {
      if (!plan.checked || plan.coupon === null) {
        return acc;
      }

      return [...acc, { index, users: plan.users, cuponId: plan.coupon.id }];
    }, []);
  },

  CONFIRM_COUPONS(state) {
    state.month.forEach(plan => {
      if (plan.couponId.valid) {
        plan.couponId.confirmed = true;
      }
    });

    state.year.forEach(plan => {
      if (plan.couponId.valid) {
        plan.couponId.confirmed = true;
      }
    });
  },
};

export const getters = {
  plans(state) {
    return state.all;
  },

  period(state) {
    return state.period;
  },

  mirrorPeriod(state) {
    return state.period === 'month' ? 'year' : 'month';
  },

  show(state) {
    return state[state.period];
  },

  totalPaid(state) {
    return state[state.period].reduce((acc, plan) => {
      if (!plan.checked) {
        return acc;
      }

      const totalPlan = (plan.amount * plan.users) / 100;
      const discount = calcPlanDiscount(plan);

      return acc + (discount > totalPlan ? 0 : totalPlan - calcPlanDiscount(plan));
      // return acc + (totalPlan - calcPlanDiscount(plan));
    }, 0);
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

  subscribed: state => state.subscribed,

  subscriptionDefaults: state => state.subscriptionDefaults,
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
      // commit('SET_SUBSCRIBED', true);
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
