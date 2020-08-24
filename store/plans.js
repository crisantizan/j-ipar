const helpers = {};

export const state = () => ({
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

    // set new value
    current[prop] = value;

    // update in both list only with "checked" property
    if (prop === 'checked') {
      // get other period
      const otherPeriod = state.period === 'month' ? 'year' : 'month';
      const other = state[otherPeriod][includedStr][index];
      other[prop] = value;
    }
  },
};

export const getters = {
  period(state) {
    return state.period;
  },
  show(state) {
    return state[state.period];
  },
};
