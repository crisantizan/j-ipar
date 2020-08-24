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
  TOGGLE_ACTIVE(state, { checked, included, index }) {
    const includedStr = included ? 'included' : 'notIncluded';
    const current = state[state.period][includedStr][index];

    // get other period
    const otherPeriod = state.period === 'month' ? 'year' : 'month';
    const other = state[otherPeriod][includedStr][index];

    // set new status
    current.checked = checked;
    other.checked = checked;
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
