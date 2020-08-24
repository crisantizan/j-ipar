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
  TOGGLE_ACTIVE(state, index) {
    const other = state.period === 'month' ? 'year' : 'month';
    const currentPlan = state[state.period][index];
    const otherPlan = state[other][index];

    if (!currentPlan || !otherPlan) {
      return;
    }

    currentPlan.checked = !currentPlan.checked;
    otherPlan.checked = !otherPlan.checked;
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
