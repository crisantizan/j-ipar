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

  UPDATE_SPECIAL_USERS(state, { value, oldValue, index }) {
    const plan = state[state.period][index];
    plan.users = value;

    const isIncrement = value >= oldValue;
    const isMain = state.defaultCheckedUsers.core.includes(plan.id);

    if (isMain) {
      // by period selected
      const [california, immigration] = state.defaultCheckedUsers[state.period];

      const californiaIndex = state[state.period].findIndex(
        v => v.id === california.id,
      );
      const immigrationIndex = state[state.period].findIndex(
        v => v.id === immigration.id,
      );

      if (californiaIndex === -1 || immigrationIndex === -1) {
        throw new Error('Plan not found');
      }

      const diff = isIncrement ? value - oldValue : oldValue - value;
      const diffMiddle = Math.floor(diff / 2);

      switch (diffMiddle) {
        // update one
        case 0:
          // update california
          if (
            state.lastChangedPlan === null ||
            state.lastChangedPlan === california.id
          ) {
            const val = state[state.period][californiaIndex];
            // decrement, is zero, omit
            if (val.users === 0 && !isIncrement) {
              return;
            }

            // update value
            val.users = isIncrement ? val.users + 1 : val.users - 1;

            // update value of lastChangedPlan property
            state.lastChangedPlan = immigration.id;
            return;
          }

          // update immigration
          const val = state[state.period][immigrationIndex];
          // decrement, is zero, omit
          if (val.users === 0 && !isIncrement) {
            return;
          }

          // update value
          val.users = isIncrement ? val.users + 1 : val.users - 1;

          // update value of lastChangedPlan property
          state.lastChangedPlan = california.id;
          return;

        default:
          // update both
          const californiaPlan = state[state.period][californiaIndex];
          const immigrationPlan = state[state.period][immigrationIndex];

          // decrement
          if (!isIncrement) {
            if (californiaPlan.users !== 0) {
              // update california
              const result = californiaPlan.users - (diff - diffMiddle);
              californiaPlan.users = result < 0 ? 0 : result;
            }

            if (immigrationPlan.users !== 0) {
              // update california
              const result = immigrationPlan.users - (diff - diffMiddle);
              immigrationPlan.users = result < 0 ? 0 : result;
            }

            return;
          }

          // increment
          californiaPlan.users += diff - diffMiddle;
          immigrationPlan.users += diff - diffMiddle;
          break;
      }
    }

    console.log({ value, oldValue, index, isIncrement, isMain });
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
