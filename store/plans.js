import gql from 'graphql-tag';
import {
  calcPlanDiscount,
  planIsCore,
  calcTotalPlan,
  getPlanLibraryName,
} from '@/helpers/functions';
import { libraryKeys } from '@/utils/constants';

export const state = () => ({
  all: [],
  period: 'month',
  defaultPeriod: 'month',
  month: [],
  year: [],
  paymentMethods: [],
  customer: null,
  lastChangedPlan: null,
  subscribed: false,
  defaultCheckedPlans: {
    month: [],
    year: [],
  },
  defaultTotalPaid: null,
  planChangesData: [],
});

export const mutations = {
  SET_ALL(state, plans) {
    const displayPlans = [libraryKeys.CALIFORNIA.staticValue, libraryKeys.IMMIGRATION.staticValue];

    state.all = plans.filter(plan => {
      if (!plan || !plan.nickname) return false;

      if (planIsCore(plan.nickname)) return true;

      return displayPlans.some(val => plan.nickname.toLowerCase().includes(val));
    });

    let found = false;

    // set default period
    for (const plan of state.all) {
      if (!planIsCore(plan.nickname)) continue;

      if (plan.checked) {
        state.defaultPeriod = plan.interval;
        state.period = plan.interval;
        found = true;

        state.subscribed = true;
        break;
      }
    }

    if (!found && !!state.all.length) {
      // monthly is default checked period
      const index = state.all.findIndex(plan => {
        return planIsCore(plan.nickname) && plan.interval === 'month';
      });

      state.all[index].checked = true;
    }
  },

  SET_MONTHLY(state, plans) {
    state.month = plans;
  },

  SET_YEARLY(state, plans) {
    state.year = plans;
  },

  SET_DEFAULT_PERIOD(state, period) {
    state.defaultPeriod = period;
  },

  SET_DEFAULT_TOTAL_PAID(state, total) {
    state.defaultTotalPaid = total;
  },

  SET_DEFAULT_CHECKED_PLANS(state) {
    state.defaultCheckedPlans[state.period] = state[state.period]
      .filter(plan => plan.checked)
      .map(plan => ({
        id: plan.id,
        nickname: plan.nickname,
        library: getPlanLibraryName(plan.nickname),
        users: plan.users,
        coupon: plan.couponId.value,
        totalPaid: calcTotalPlan(plan),
      }));

    state.defaultCheckedPlans[this.getters['plans/mirrorPeriod']] = state[
      this.getters['plans/mirrorPeriod']
    ]
      .filter(plan => plan.checked)
      .map(plan => ({
        id: plan.id,
        nickname: plan.nickname,
        library: getPlanLibraryName(plan.nickname),
        users: plan.users,
        coupon: plan.couponId.value,
        totalPaid: calcTotalPlan(plan),
      }));
  },

  REMOVE_DEFAULT_CHECKED_PLAN(state, index) {
    const plan = state[state.period][index];
    const defaultPlanIndex = state.defaultCheckedPlans[state.period].findIndex(
      v => v.id === plan.id,
    );

    state.defaultCheckedPlans[state.period].splice(defaultPlanIndex, 1);

    const mirrorPeriod = this.getters['plans/mirrorPeriod'];
    const planMirror = state[mirrorPeriod][index];

    const defaultMirrorPlanIndex = state.defaultCheckedPlans[mirrorPeriod].findIndex(
      v => v.id === planMirror.id,
    );

    state.defaultCheckedPlans[mirrorPeriod].splice(defaultMirrorPlanIndex, 1);
  },

  SET_PERIOD(state, period) {
    state.period = period;
  },

  SET_FULL_CUPON(state, { index, value }) {
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

  UPDATE_USERS(state, { value, index, mainPlan = null }) {
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

  SET_CANCELED_STATUS_PLAN(state, payload) {
    /**
     * payload: { cancelAt: numeric string,
     * canceledAt: numeric string,
     * cancelAtPeriodEnd: boolean,
     * index: number,
     * period: string, optional
     * }
     **/
    const { index } = payload;
    const period = payload.period || state.period;

    state[period][index].cancelAt = payload.cancelAt;
    state[period][index].canceledAt = payload.canceledAt;
    state[period][index].cancelAtPeriodEnd = payload.cancelAtPeriodEnd;
  },

  SET_SUBSCRIBED(state, payload) {
    state.subscribed = payload;
  },

  UPDATE_PLAN_CHANGES_DATA(state, { data, index = null, reset = false, remove = false }) {
    // reset array
    if (reset) {
      state.planChangesData = [];
      return;
    }

    // update existing or remove
    if (index !== null && index !== -1) {
      // update                                         // remove
      !remove ? (state.planChangesData[index] = data) : state.planChangesData.splice(index, 1);
      return;
    }

    // insert new
    state.planChangesData.push(data);
  },
};

export const getters = {
  plans(state) {
    return state.all;
  },

  defaultTotalPaid(state) {
    return state.defaultTotalPaid;
  },

  period(state) {
    return state.period;
  },

  defaultPeriod(state) {
    return state.defaultPeriod;
  },

  mirrorPeriod(state) {
    return state.period === 'month' ? 'year' : 'month';
  },

  show(state) {
    return state[state.period];
  },

  mirrorSubscriptionPlans(state, getters) {
    return state[getters.mirrorPeriod];
  },

  defaultCheckedPlans(state) {
    return state.defaultCheckedPlans[state.defaultPeriod];
  },

  currentCheckedPlans(state) {
    return state.defaultCheckedPlans[state.period];
  },

  mirrorDefaultCheckedPlans(state, getters) {
    return state.defaultCheckedPlans[getters.mirrorPeriod];
  },

  totalPaid(state) {
    return state[state.period].reduce((acc, plan) => {
      if (!plan.checked) {
        return acc;
      }

      const totalPlan = (plan.amount * plan.users) / 100;
      const discount = calcPlanDiscount(plan);

      return acc + (discount > totalPlan ? 0 : totalPlan - discount);
    }, 0);
  },

  mainPlan(state) {
    return period => {
      const index = state[period].findIndex(plan => planIsCore(plan.nickname));

      return { index, value: state[period][index] };
    };
  },

  customer(state) {
    return state.customer;
  },

  paymentMethods(state) {
    return state.paymentMethods;
  },

  hasPaymentMethods(state) {
    return state.paymentMethods.length > 0;
  },

  defaultPaymentMethod(_, getters) {
    const paymentMethod = getters.paymentMethods.find(
      val => val.id === getters.customer.invoiceSettings.default_payment_method,
    );

    return paymentMethod || null;
  },

  defaultPaymentMethodIsExpirated(_, getters) {
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1;

    if (!getters.defaultPaymentMethod) {
      return null;
    }

    return (
      getters.defaultPaymentMethod.card.exp_year < currentYear ||
      getters.defaultPaymentMethod.card.exp_month < currentMonth
    );
  },

  subscriptionIsCanceled(state, getters) {
    return getters.defaultCheckedPlans.every(val => {
      const plan = state[state.defaultPeriod].find(plan => plan.id === val.id);

      return plan.cancelAtPeriodEnd;
    });
  },

  isSubscribed(state, getters) {
    return !!getters.defaultCheckedPlans.length && state.subscribed;
  },

  planChangesData(state) {
    return state.planChangesData;
  },
};

export const actions = {
  async getPlans({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data, errors } = await this.$axios.graphql({
          query: gql`
            query {
              plans: stripePlans {
                id
                currentPeriodEnd
                cancelAt
                canceledAt
                cancelAtPeriodEnd
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
                coupon
              }
            }
          `,
        });

        if (!!errors && errors.length > 0) {
          reject(errors);
          return;
        }

        commit('SET_ALL', data.plans);
        resolve(data.plans);
      } catch (e) {
        reject(e);
      }
    });
  },

  async cancelSubscriptions({ commit, state }, plans) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data, errors } = await this.$axios.graphql({
          mutate: gql`
            mutation($plans: Array!) {
              stripeSubscriptionCancel(plans: $plans) {
                cancelAt
                canceledAt
                cancelAtPeriodEnd
                plan
              }
            }
          `,
          variables: { plans },
        });

        if (!!errors && errors.length > 0) {
          reject(errors);
          return;
        }
        // array
        resolve(data.stripeSubscriptionCancel);
      } catch (err) {
        reject(err);
      }
    });
  },

  addSubscription({ commit, state }, plans) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data, errors } = await this.$axios.graphql({
          mutate: gql`
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
          variables: { plans },
        });

        if (!!errors && errors.length > 0) {
          reject(errors);
          return;
        }

        resolve(data.stripeSubscripterAdd);
      } catch (err) {
        reject(err);
      }
    });
  },

  async getPaymentMethods({ commit, state }) {
    try {
      const { data } = await this.$axios.graphql({
        query: gql`
          query {
            paymentMethods: stripePaymentMethods {
              id
              card
            }
          }
        `,
      });

      // refresh payment methods
      commit('SET_PAYMENT_METHODS', data.paymentMethods);
    } catch (err) {
      console.error(err);
    }
  },

  /** get customer data */
  async getCustomer({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data, errors } = await this.$axios.graphql({
          query: gql`
            query {
              customer: stripeCustomer {
                id
                invoiceSettings
                subsPrevious
              }
            }
          `,
        });

        if (!!errors && errors.length > 0) {
          reject(errors);
          return;
        }

        commit('plans/SET_CUSTOMER', data.customer, { root: true });
        resolve(data.customer);
      } catch (e) {
        reject(e);
      }
    });
  },
};
