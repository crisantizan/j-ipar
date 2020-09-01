const helpers = {
  calcTotalPaid(acc, plan) {
    if (!plan.checked) {
      return acc;
    }
    const totalPlan = (plan.amount * plan.users) / 100;
    return acc + totalPlan;
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

  UPDATE_SPECIAL_USERS(state, { value, oldValue, index, isMain, period }) {
    const plan = state[period][index];
    plan.users = value;

    // by period selected
    const [california, immigration] = state.defaultCheckedUsers[period];

    const californiaIndex = state[period].findIndex(
      v => v.id === california.id,
    );
    const immigrationIndex = state[period].findIndex(
      v => v.id === immigration.id,
    );

    if (californiaIndex === -1 || immigrationIndex === -1) {
      throw new Error('Plan not found');
    }

    if (isMain) {
      const middle = Math.floor(value / 2);

      // update both
      state[period][californiaIndex].users = value - middle;
      state[period][immigrationIndex].users = middle;
      return;
    }

    let otherPlan = {};
    const isCalifornia = plan.id === california.id;

    if (isCalifornia) {
      otherPlan = state[period][immigrationIndex];
    } else {
      otherPlan = state[period][californiaIndex];
    }

    // console.log({ isCalifornia });
    // console.log({ ...otherPlan });

    const total = oldValue + otherPlan.users;
    // console.log({ oldValue, total });
    otherPlan.users = total - value;
  },

  SET_PAYMENT_METHODS(state, payload) {
    // TODO:: "payload" is not an array, set to null while
    state.paymentMethods = Array.isArray(payload) ? payload : null;
  },

  SET_CUSTOMER(state, payload) {
    state.customer = payload;
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

  planIsMain(state) {
    return id => state.defaultCheckedUsers.core.includes(id);
  },

  mainPlan(state) {
    const ids = state.defaultCheckedUsers.core;
    return state[state.period].find(v => ids.includes(v.id));
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
