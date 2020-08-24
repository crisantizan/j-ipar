const helpers = {};

export const state = () => ({
  all: [],
  period: 'month',
  month: {
    included: [],
    notIncluded: [],
  },
  year: {
    included: [],
    notIncluded: [],
  },
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
  SET_CHECKED_OR_USERS(state, { prop, value, included, index }) {
    const includedStr = included ? 'included' : 'notIncluded';
    // current plan
    const current = state[state.period][includedStr][index];

    // get other period
    const otherPeriod = state.period === 'month' ? 'year' : 'month';
    const other = state[otherPeriod][includedStr][index];

    // set new value
    current[prop] = value;
    other[prop] = value;
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
    return state.all.reduce((acc, plan) => {
      if (!plan.checked) {
        return acc;
      }
      const totalPlan = (plan.amount * plan.users) / 100;
      return acc + totalPlan;
    }, 0);
  },
};
