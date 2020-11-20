<template>
  <div class="row col-12 mt-2">
    <div class="col-md-4">
      <div class="card p-2">
        <h2 class="mb-0">Card Information</h2>

        <div class="row">
          <div class="col-md-12">
            <form id="subscription-form">
              <!-- v-bind:disabled="isProcesing ? '' : disabled" -->
              <h4>Enter your payment information here:</h4>
              <div id="card-element" class="form-control">
                <!-- Elements will create input elements here -->
              </div>

              <!-- We'll put the error messages in this element -->
              <div id="card-errors" role="alert" style="color: red"></div>

              <div class="text-right">
                <button
                  type="submit"
                  class="btn btn-success mt-2"
                  :class="{ disabled: loading }"
                  id="add-payment-method"
                >
                  Add
                </button>
                <div></div>
              </div>
            </form>
          </div>
        </div>

        <hr class="mt-1" />

        <div class="row p-2">
          <div v-if="!paymentMethods.length">Add Payment Method</div>
          <!-- go to 489 line -->
          <div
            v-else
            class="col-md-6"
            v-for="paymentMethod in paymentMethods"
            :key="paymentMethod.id"
          >
            <div
              v-bind:class="{
                'credit-card-default':
                  paymentMethod.id ==
                  customer.invoiceSettings.default_payment_method,
              }"
              class="card-box ribbon-box"
            >
              <div class="ribbon ribbon-primary float-left">
                <span
                  v-if="
                    paymentMethod.id ===
                      customer.invoiceSettings.default_payment_method
                  "
                  >Active</span
                >
                Payment Method
              </div>
              <h5 class="text-primary float-right mt-0"></h5>
              <div class="ribbon-content">
                <div class="mb-0">
                  <span class="d-block"
                    ><i class="fab fa-cc-mastercard fa-2x"></i>
                    <i class="fa fa-cc-visa fa-2x"></i>
                  </span>
                  <span style="font-size: larger"
                    >**** **** **** {{ paymentMethod.card.last4 }}</span
                  >
                  <br />
                  Valid
                  <strong>{{ paymentMethod.card.exp_month }}</strong> /
                  <strong>{{ paymentMethod.card.exp_year }}</strong>
                  <br />

                  <div class="text-right">
                    <a
                      class="btn btn-sm btn-secondary"
                      href="#"
                      v-if="
                        paymentMethod.id !=
                          customer.invoiceSettings.default_payment_method
                      "
                      @click="changeDefaultPaymentMethod(paymentMethod.id)"
                      >Set Default</a
                    >
                    <a
                      class="btn btn-sm btn-danger"
                      href="#"
                      v-on:click="deletePaymentMethod(paymentMethod.id)"
                      >Remove</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-8">
      <div class="card">
        <h2 class="mb-0 p-2">Select Plan</h2>

        <div class="row">
          <div class="col-md-12">
            <div v-if="plans != null">
              <div class="text-right">
                <div class="radio form-check-inline">
                  <input
                    type="radio"
                    id="payment-period-month"
                    v-model="paymentPeriod"
                    name="payment-period"
                    value="month"
                  />
                  <label for="payment-period-month">Month</label>
                </div>

                <div class="radio form-check-inline">
                  <input
                    type="radio"
                    id="payment-period-year"
                    v-model="paymentPeriod"
                    name="payment-period"
                    value="year"
                  />
                  <label for="payment-period-year">Year</label>
                </div>
              </div>

              <table class="table table-striped table-hover table-plans">
                <thead>
                  <tr>
                    <th>Package</th>
                    <th class="text-center">User(s)</th>
                    <th class="text-center">Price</th>
                    <th class="text-center">Discount</th>
                    <th class="text-center">Status</th>
                    <th class="text-center">Total</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="(plan, index) in show"
                    :key="plan.id"
                    :class="{ 'package-selected': plan.checked }"
                  >
                    <td>
                      <div class="checkbox checkbox-success">
                        <input
                          type="checkbox"
                          :id="plan.id"
                          :checked="plan.checked"
                          :disabled="
                            loading ||
                              !plan.active ||
                              subscriptionIsCanceled ||
                              disabledMirrorPeriod
                          "
                          @click.prevent
                        />
                        <label
                          :for="plan.id"
                          :class="{
                            'cursor-pointer':
                              !loading &&
                              plan.active &&
                              !subscriptionIsCanceled &&
                              !disabledMirrorPeriod,
                          }"
                          @click="
                            onCheckedPlan({
                              event: $event,
                              nickname: plan.nickname,
                              planId: plan.id,
                              value: !plan.checked,
                              isCanceled: plan.cancelAtPeriodEnd,
                              index,
                            })
                          "
                        >
                          {{ plan.nickname }}
                        </label>
                      </div>

                      <div
                        :class="[
                          plan.couponId.confirmed
                            ? 'text-success'
                            : 'text-grey',
                        ]"
                        v-if="plan.couponId.valid && plan.checked"
                      >
                        <div class="d-flex align-items-center">
                          <b class="mr-1">{{ plan.coupon.name }}</b>

                          <span
                            v-if="!plan.couponId.confirmed"
                            class="quit-cupon"
                            title="Remove coupon"
                            @click="quitCoupon(index)"
                          >
                            <i class="fas fa-times text-danger"></i>
                          </span>
                        </div>
                      </div>

                      <div v-else>
                        <div class="input-group input-group-sm mt-1">
                          <span
                            @click="quitCoupon(index)"
                            class="quit-cupon"
                            title="Remove coupon"
                            v-if="plan.couponId.valid"
                          >
                            <i class="fas fa-times"></i>
                          </span>
                          <input
                            type="text"
                            class="form-control form-control-sm text-secondary"
                            placeholder="Add Coupon"
                            :disabled="
                              !plan.checked ||
                                subscriptionIsCanceled ||
                                plan.cancelAtPeriodEnd ||
                                disabledMirrorPeriod
                            "
                            :title="inputCuponTitle(plan.couponId.valid)"
                            :class="isValidCupon(plan.couponId.valid)"
                            :value="plan.couponId.value"
                            @input="
                              onTypeCupon({
                                value: $event.target.value,
                                index,
                              })
                            "
                            @blur="
                              onBlurInputCoupon({
                                index,
                                valid: plan.couponId.valid,
                              })
                            "
                            @keyup.enter="
                              verifyCupon({
                                index,
                                couponId: plan.couponId,
                                plan: plan,
                              })
                            "
                          />
                          <div class="input-group-append">
                            <button
                              class="btn btn-sm btn-outline-secondary"
                              type="button"
                              :disabled="
                                !plan.checked ||
                                  btnAddCuponDisabledState(plan.couponId)
                              "
                              title="Add coupon"
                              @click="
                                verifyCupon({
                                  index,
                                  couponId: plan.couponId,
                                  plan: plan,
                                  input:
                                    $event.target.parentNode
                                      .previousElementSibling,
                                })
                              "
                            >
                              <template
                                v-if="
                                  loading && currentVerifyCuponPlan === plan.id
                                "
                              >
                                <div
                                  class="spinner-border text-primary"
                                  role="status"
                                >
                                  <span class="sr-only">Loading...</span>
                                </div>
                              </template>
                              <span v-else style="pointer-events: none">
                                Add
                              </span>
                            </button>
                          </div>
                        </div>
                        <small
                          v-if="plan.couponId.valid === false"
                          class="form-text text-danger mt-0"
                        >
                          Invalid coupon
                        </small>
                      </div>
                    </td>
                    <td class="users-td">
                      <div class="d-flex align-items-center">
                        <input
                          class="form-control form-control-sm"
                          type="number"
                          maxlength="3"
                          min="0"
                          size="3"
                          :disabled="
                            !plan.checked ||
                              plan.cancelAtPeriodEnd ||
                              subscriptionIsCanceled ||
                              disabledMirrorPeriod
                          "
                          :value="plan.users"
                          @change="
                            onChangeUsers({
                              event: $event,
                              plan: { ...plan },
                              value: Number($event.target.value),
                              index,
                            })
                          "
                        />
                      </div>
                    </td>
                    <td class="text-center">
                      {{ plan.amount | slice(0, -2) | enUsFormatter }}
                    </td>
                    <td class="text-center">
                      {{ plan | calcDiscount | enUsFormatter }}
                    </td>
                    <td
                      class="text-center"
                      :class="{ 'text-danger': plan.cancelAtPeriodEnd }"
                    >
                      <client-only>
                        <div class="d-flex flex-column">
                          {{ printStatusPlan(plan) }}
                          <!-- reset plan  -->
                          <a
                            class="text-primary"
                            v-if="
                              plan.cancelAtPeriodEnd && !subscriptionIsCanceled
                            "
                            style="cursor: pointer; text-decoration: underline"
                            @click="onResetPlan({ plan, index })"
                            >Resubscribe</a
                          >
                        </div>
                      </client-only>
                    </td>
                    <td class="text-center">
                      {{ plan | calcTotalPlan | enUsFormatter }}
                    </td>
                  </tr>

                  <tr>
                    <td colspan="5">
                      <b>Total to pay per {{ paymentPeriod }}</b>
                    </td>
                    <td class="text-right">
                      <b>{{ totalPaid | enUsFormatter }}</b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="text-right mb-3" v-if="!!paymentMethods.length">
              <button
                v-if="subscriptionIsCanceled"
                class="btn btn-warning mr-2"
                @click="resetSubscription"
                :disabled="this.paymentPeriod !== this.defaultPeriod"
              >
                Resubscribe
              </button>

              <button
                v-if="isSubscribed && !subscriptionIsCanceled"
                type="button"
                class="btn btn-danger mr-2"
                :title="
                  disabledBtnCancel ? 'Already canceled' : 'Cancel subscription'
                "
                :disabled="disabledBtnCancel"
                @click="cancelSubscription"
              >
                Cancel Subscription
              </button>

              <button
                type="button"
                class="btn btn-success"
                :disabled="loading || disabledBtnSubscribeUpdate"
                @click="subscribeUpdatePlan"
              >
                Subscribe / Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex';
import gql from 'graphql-tag';
import dayjs from 'dayjs';
import {
  camelToSnakeCaseObj,
  calcPlanDiscount,
  planIsCore,
  includeValue,
  getPlanLibraryName,
} from '@/helpers/functions';
import { enUsFormatter } from '@/helpers/number-format';
import { libraryKeys } from '@/utils/constants';

export default {
  data: () => ({
    currentVerifyCuponPlan: null,
    valuesChange: false,
    typingCupon: false,
  }),

  filters: {
    calcDiscount(plan) {
      return calcPlanDiscount(plan);
    },

    calcTotalPlan(plan) {
      const total = (plan.amount * plan.users) / 100;
      const discount = calcPlanDiscount(plan);

      return discount > total ? 0 : total - discount;
    },
  },

  computed: {
    ...mapGetters('plans', [
      'defaultPeriod',
      'mirrorPeriod',
      'show',
      'mirrorSubscriptionPlans',
      'plans',
      'defaultCheckedPlans',
      'mirrorDefaultCheckedPlans',
      'totalPaid',
      'customer',
      'paymentMethods',
      'mainPlan',
      'subscriptionIsCanceled',
      'isSubscribed',
      'defaultTotalPaid',
    ]),
    ...mapGetters('users', ['isUpdate', 'getLibrariesAvailable']),
    ...mapGetters('users', { selectedLibraries: 'selected' }),
    ...mapGetters(['loaded', 'loading']),

    paymentPeriod: {
      get() {
        return this.$store.getters['plans/period'];
      },

      set(period) {
        this.$store.commit('plans/SET_PERIOD', period);
      },
    },

    disabledBtnCancel() {
      return (
        this.loading ||
        this.paymentPeriod !== this.defaultPeriod ||
        this.subscriptionIsCanceled
      );
    },

    disabledMirrorPeriod() {
      return (
        this.paymentPeriod !== this.defaultPeriod &&
        (this.isSubscribed || this.subscriptionIsCanceled)
      );
    },

    /** change payment period yearly to monthly */
    yearlyToMonthly() {
      return this.defaultPeriod === 'year' && this.paymentPeriod === 'month';
    },

    monthlyToYearly() {
      return this.defaultPeriod === 'month' && this.paymentPeriod === 'year';
    },

    /** disabled button "Subscribe / Update" */
    disabledBtnSubscribeUpdate() {
      if (!!this.totalPaid && this.monthlyToYearly) {
        return false;
      }

      if (!this.totalPaid || !this.valuesChange || this.yearlyToMonthly) {
        return true;
      }

      return false;
    },
  },

  created() {
    if (this.defaultTotalPaid === null) {
      this.SET_DEFAULT_TOTAL_PAID(this.totalPaid);
    }
  },

  mounted() {
    // Create a Stripe client.
    var stripe = Stripe('pk_test_2AcUtig3rQa3DK0LTJQIGTrm');

    // Create an instance of Elements.
    var elements = stripe.elements();

    var style = {
      base: {
        color: '#32325d',
        lineHeight: '1.429',
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    };

    var cardElement = elements.create('card', { style: style });
    cardElement.mount('#card-element');

    cardElement.on('change', showCardError);

    function showCardError(event) {
      let displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
      }
    }

    var form = document.getElementById('subscription-form');

    form.addEventListener('submit', e => {
      e.preventDefault();

      // create payment method
      this.createPaymentMethod(stripe, cardElement);
    });
  },

  watch: {
    loaded: {
      immediate: true,
      deep: true,
      handler(val) {
        // set monthly and yearly plans, one time
        if (val && !this.show.length) {
          const { month, year } = this.getFilteredPlans();

          if (this.defaultPeriod === 'month') {
            this.SET_MONTHLY(month);
            this.SET_YEARLY(this.copyValues(month, year));
          } else {
            this.SET_YEARLY(year);
            this.SET_MONTHLY(this.copyValues(year, month));
          }

          this.SET_DEFAULT_CHECKED_PLANS();
        }
      },
    },

    show: {
      immediate: true,
      deep: true,
      handler(plans, oldPlans) {
        if (this.typingCupon) return;

        // checked plan with zero licences
        if (plans.some(v => v.checked && v.users === 0)) {
          this.valuesChange = false;
          return;
        }

        let change = false;
        for (const plan of plans) {
          const defaultPlan = this.defaultCheckedPlans.find(
            v => v.id === plan.id,
          );

          if (!!defaultPlan) {
            if (defaultPlan.users !== plan.users) {
              this.valuesChange = true;
              change = true;
              break;
            }

            // coupon changed
            if (
              plan.couponId.valid &&
              defaultPlan.coupon !== plan.couponId.value
            ) {
              this.valuesChange = true;
              change = true;
              break;
            }

            continue;
          }

          if (plan.checked && plan.users !== 0) {
            this.valuesChange = true;
            change = true;
            break;
          }
        }

        if (!change && this.valuesChange) {
          this.valuesChange = false;
        }
      },
    },
  },

  methods: {
    ...mapMutations('plans', [
      'SET_MONTHLY',
      'SET_YEARLY',
      'SET_DEFAULT_CHECKED_PLANS',
      'SET_CHECKED_OR_USERS',
      'UPDATE_USERS',
      'CHANGE_DEFAULT_CUSTOMER',
      'ADD_PAYMENT_METHOD',
      'REMOVE_PAYMENT_METHOD',
      'SET_FULL_CUPON',
      'SET_CUPON',
      'SET_CUPON_STATE',
      'CONFIRM_COUPONS',
      'SET_DEFAULT_PERIOD',
      'SET_CANCELED_STATUS_PLAN',
      'SET_DEFAULT_TOTAL_PAID',
      'SET_SUBSCRIBED',
    ]),

    ...mapMutations('users', ['UPDATE_LIBRARIES_QUANTITY']),

    ...mapActions('plans', [
      'getPaymentMethods',
      'addSubscription',
      'cancelSubscriptions',
    ]),

    ...mapMutations(['SET_LOADING']),

    printStatusPlan(plan) {
      if (!this.isSubscribed || this.paymentPeriod !== this.defaultPeriod) {
        return '-';
      }

      if (
        !plan.checked ||
        !this.defaultCheckedPlans.some(v => v.id === plan.id)
      ) {
        return '-';
      }

      return plan.cancelAtPeriodEnd
        ? `Will cancel on ${dayjs.unix(plan.cancelAt).format('MM/DD/YYYY')}`
        : 'Subscribed';
    },

    /** create payment method (with apollo) */
    async createPaymentMethod(stripe, card) {
      try {
        // get stripe payment method
        const { paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card,
        });

        const mutate = gql`
          mutation($paymentMethodId: String!) {
            paymentMethodEdit(paymentMethodId: $paymentMethodId) {
              id
            }
          }
        `;

        // backend result
        const result = await this.$axios.graphql({
          mutate,
          variables: { paymentMethodId: paymentMethod.id },
        });

        // list in screen
        this.ADD_PAYMENT_METHOD({
          id: paymentMethod.id,
          card: paymentMethod.card,
        });

        // set as default
        this.CHANGE_DEFAULT_CUSTOMER(paymentMethod.id);

        card.clear();
      } catch (error) {
        console.error(error);
      }
    },

    /** update cupon value on type **/
    onTypeCupon(data) {
      !this.typingCupon && (this.typingCupon = true);
      // data: { value, index }
      this.SET_CUPON(data);
    },

    /** input class according to cupon state **/
    isValidCupon(isValid) {
      switch (isValid) {
        case null:
          return '';
        case false:
          return 'is-invalid';
        case true:
          return 'is-valid';
      }
    },

    /** manage "disabled" property in button "Add" cupon **/
    btnAddCuponDisabledState(couponId) {
      return couponId.value.length < 4 || couponId.valid !== null;
    },

    /** **/
    onBlurInputCoupon({ index, valid }) {
      this.typingCupon && (this.typingCupon = false);
      if (valid !== false) {
        return;
      }

      // reset
      this.SET_CUPON({ index, value: '' });
    },

    /** quit cupon **/
    quitCoupon(index) {
      // reset
      this.SET_CUPON({ index, value: '' });
    },

    /** set "title" property to input add cupon **/
    inputCuponTitle(valid) {
      switch (valid) {
        case null:
          return 'Type a coupon ID';
        case true:
          return 'Valid coupon';
        case false:
          return 'Invalid coupon';
      }
    },

    /** validate if coupon is assignable to the current plan **/
    cuponIsAssignable(appliesTo, planProd) {
      return appliesTo === null || appliesTo.products.some(p => p === planProd);
    },

    /** verify cupon **/
    async verifyCupon({ couponId, index, plan, input = null }) {
      // invalid input data
      if (this.btnAddCuponDisabledState(couponId)) {
        return;
      }

      try {
        this.currentVerifyCuponPlan = plan.id;

        const query = gql`
          query($couponId: String!) {
            verifyStripeCoupon(id: $couponId) {
              id
              object
              amountOff
              created
              currency
              duration
              durationInMonths
              livemode
              maxRedemptions
              metadata
              name
              percentOff
              redeemBy
              timesRedeemed
              valid
              appliesTo
            }
          }
        `;

        // backend result
        const result = await this.$axios.graphql({
          query,
          variables: { couponId: couponId.value },
        });

        // validate coupon
        const isAssignable = this.cuponIsAssignable(
          result.data.verifyStripeCoupon.appliesTo,
          plan.product,
        );

        const { valid, percentOff, amountOff } = result.data.verifyStripeCoupon;

        const isValid = valid && isAssignable;
        let discount = null;

        if (isValid) {
          discount = {
            value: percentOff !== null ? percentOff : amountOff,
            type: percentOff !== null ? 'percent' : 'amount',
          };
        }

        this.SET_FULL_CUPON({
          index,
          value: camelToSnakeCaseObj(result.data.verifyStripeCoupon),
        });

        this.SET_CUPON_STATE({
          index,
          value: isValid,
          discount,
        });
      } catch (err) {
        // invalid cupon
        this.SET_CUPON_STATE({
          index,
          value: false,
        });

        // set focus
        if (input) {
          input.focus();
        }
      } finally {
        this.currentVerifyCuponPlan = null;
      }
    },

    /** show plans filtered */
    getFilteredPlans() {
      const plans = [...this.plans];

      /** sort values */
      const sorted = plans.sort((a, b) => {
        if (planIsCore(a.nickname)) {
          return -1;
        }

        return 0;
      });

      const mirrorPeriod = this.defaultPeriod === 'month' ? 'year' : 'month';

      // split in "month" and "year"
      return sorted.reduce(
        (acc, plan) => {
          switch (plan.interval) {
            case this.defaultPeriod:
              // default values
              let discount = null;
              const couponId = { value: '', valid: null, confirmed: false };

              const hasCoupon =
                plan.coupon === null
                  ? false
                  : !!Object.keys(plan.coupon).length;

              // load values of coupon applied
              if (hasCoupon) {
                const { percent_off, amount_off } = plan.coupon;

                // calculate total discount
                discount = {
                  type: percent_off !== null ? 'percent' : 'amount',
                  value: percent_off !== null ? percent_off : amount_off,
                };

                couponId.value = plan.coupon.id;
                couponId.valid = true;
                couponId.confirmed = true;
              }

              let active = plan.active;

              // disabled core
              if (planIsCore(plan.nickname)) active = false;

              return {
                ...acc,
                [this.defaultPeriod]: [
                  ...acc[this.defaultPeriod],
                  {
                    ...plan,
                    discount,
                    couponId,
                    active,
                  },
                ],
              };
              break;

            // yearly
            default:
              return { ...acc, [mirrorPeriod]: [...acc[mirrorPeriod], plan] };
          }
        },
        { month: [], year: [] },
      );
    },

    copyValues(from, to) {
      return to.map((plan, index) => {
        const { checked, users, coupon, discount, couponId, active } = from[
          index
        ];
        return { ...plan, checked, users, coupon, discount, couponId, active };
      });
    },

    /** on reset plan **/
    async onResetPlan({ plan, index }) {
      const { isConfirmed } = await Swal.fire({
        position: 'center',
        title: 'Resubscribe',
        text: `Are you sure you want to resubscribe to plan? We think this is a great idea :-)`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, do It!',
      });

      if (!isConfirmed) {
        return;
      }

      const subscriptionData = {
        planId: plan.id,
        quantity: plan.users,
      };

      // send coupon
      if (plan.couponId.valid) {
        subscriptionData.coupon = plan.couponId.value;
      }

      try {
        await this.addSubscription([subscriptionData]);

        // update view
        this.SET_CANCELED_STATUS_PLAN({
          cancelAt: null,
          canceledAt: null,
          cancelAtPeriodEnd: false,
          index,
        });
      } catch (err) {
        console.error(err);
      }
    },

    /** on checked plan handler */
    async onCheckedPlan(data) {
      // data { planId, nickname, value, isCanceled, index });

      // canceled or core, stop
      if (
        this.subscriptionIsCanceled ||
        this.disabledMirrorPeriod ||
        planIsCore(data.nickname)
      ) {
        return;
      }

      // only in active payment period
      if (this.paymentPeriod === this.defaultPeriod) {
        // subscription already canceled
        if (!data.value && data.isCanceled) {
          data.event.preventDefault();

          Swal.fire({
            position: 'center',
            icon: 'info',
            html: '<h4>This plan already canceled!</h4>',
            showConfirmButton: false,
            timer: 1800,
          });

          return;
        }

        // cancel plan
        if (
          !data.value &&
          this.defaultCheckedPlans.some(v => v.id === data.planId)
        ) {
          data.event.preventDefault();
          delete data.event;

          const { isConfirmed } = await Swal.fire({
            position: 'center',
            title: 'Cancel plan',
            text:
              'Are you sure you want to cancel this product? You will continue to have access to this product until the next billing cycle and your subscription will not renew.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, do It!',
          });

          // execute cancel subscription request
          if (isConfirmed) {
            try {
              const [result] = await this.cancelSubscriptions([
                { planId: data.planId },
              ]);

              delete result.plan;

              // canceled at
              if (result.cancelAtPeriodEnd) {
                this.SET_CANCELED_STATUS_PLAN({
                  ...result,
                  index: data.index,
                });
              } else {
                // set «canceledAt» as null
                this.SET_CANCELED_STATUS_PLAN({
                  ...result,
                  canceledAt: null,
                  index: data.index,
                });

                // quit checked
                this.SET_CHECKED_OR_USERS({
                  prop: 'checked',
                  value: false,
                  index: data.index,
                });

                // quit users
                this.SET_CHECKED_OR_USERS({
                  prop: 'users',
                  value: 0,
                  index: data.index,
                });

                // update default checked plan
                this.SET_DEFAULT_CHECKED_PLANS();
              }
            } catch (e) {
              console.error(e);
            }
          }
          return;
        }
      }

      delete data.event;
      this.SET_CHECKED_OR_USERS({ prop: 'checked', ...data });

      if (!data.value) {
        // quit coupon
        if (this.show[data.index].discount !== 0) {
          this.SET_CUPON({
            value: '',
            index: data.index,
          });
        }

        // quit users
        if (this.show[data.index].users > 0) {
          const plan = this.show[data.index];

          this.UPDATE_USERS({
            value: 0,
            oldValue: plan.users,
            index: data.index,
            mainPlan: null,
          });
        }
      }
    },

    /** get sum of checked plans **/
    getCheckedSum({ planMainId, currentPlanId = null }) {
      return this.show.reduce((sum, plan) => {
        if (
          planMainId === plan.id ||
          (currentPlanId !== null && currentPlanId === plan.id)
        ) {
          return sum;
        }

        return sum + plan.users;
      }, 0);
    },

    /** on change users handler */
    async onChangeUsers({ event = null, value, plan, index }) {
      // no negative and zero accepted
      if (Number(event.target.value) < 1) {
        value = 1;
        event.target.value = 1;
      }

      const defaultPlan = this.defaultCheckedPlans.find(v => v.id === plan.id);

      // reduce users on active plan
      if (!!defaultPlan && value < defaultPlan.users) {
        const libraryKey = getPlanLibraryName(plan.nickname);
        // libraries available amount
        const available = this.getLibrariesAvailable(libraryKey);
        // amout to reduce
        const toReduce = defaultPlan.users - value;

        // well, it can reduce
        if (available >= toReduce) {
          if (planIsCore(plan.nickname)) {
            const sum = this.getCheckedSum({ planMainId: plan.id });
            // the new value is less than the sum of the another checked plans. Restart it
            if (value < sum) {
              event.target.value = defaultPlan.users;
              return;
            }
          }

          // notify to user
          const { isConfirmed } = await Swal.fire({
            title: 'Warning!',
            icon: 'warning',
            position: 'center',
            text: `Está bajando sus licencias de ${libraryKey} de ${defaultPlan.users} a ${value}, este cambio va a ser de manera inmediata. A usted le quedan x días que ya pagó, si hace el cambio pierde sus ${defaultPlan.users} licencias y se quedará con ${value}. Le recomendamos que haga este cambio el día de su fecha de facturación.`,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, do It!',
          });

          // cancel action
          if (!isConfirmed) return;
        } else {
          // if the plan is core reset his value to default
          if (planIsCore(plan.nickname)) {
            event.target.value = defaultPlan.users;
            return;
          }

          // show alert to user and stop execution
          Swal.fire({
            icon: 'info',
            position: 'center',
            text: `Please reduce ${toReduce -
              available} libraries of ${libraryKey} first!`,
            showConfirmButton: true,
          });

          return;
        }
      }

      // update from core plan
      if (planIsCore(plan.nickname)) {
        const sum = this.getCheckedSum({ planMainId: plan.id });

        if (value < sum) {
          value = sum;
          event.target.value = sum;
        }

        this.UPDATE_USERS({
          value,
          oldValue: plan.users,
          index,
          mainPlan: null,
        });

        return;
      }

      // children plans change

      const mainPlan = this.mainPlan(this.paymentPeriod);
      let mainValues = null;

      const sum = this.getCheckedSum({
        planMainId: mainPlan.value.id,
        currentPlanId: plan.id,
      });

      // update main plan
      if (value + sum > mainPlan.value.users) {
        mainValues = {
          newValue: value + sum,
          index: mainPlan.index,
        };
      }

      this.UPDATE_USERS({
        value,
        oldValue: plan.users,
        index,
        mainPlan: mainValues,
      });
    },

    getCurrentCheckedPlans() {
      return this.show.filter(plan => plan.checked).map(plan => plan.id);
    },

    /** change default payment method (with apollo) */
    async changeDefaultPaymentMethod(id) {
      const { isConfirmed } = await Swal.fire({
        title: 'Are you sure?',
        text: 'If you accept this card become your default Payment Method',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, do It!',
      });

      // aborting
      if (!isConfirmed) {
        return;
      }

      // execute request
      try {
        const mutate = gql`
          mutation($id: String!) {
            paymentMethodEdit(paymentMethodId: $id) {
              id
            }
          }
        `;

        // backend result
        const result = await this.$axios.graphql({
          mutate,
          variables: { id },
        });

        this.CHANGE_DEFAULT_CUSTOMER(id);
      } catch (error) {
        console.error(error);
      }
    },

    async deletePaymentMethod(id) {
      const { isConfirmed } = await Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete this Payment method',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, do It!',
      });

      if (!isConfirmed) {
        return;
      }

      // execute request
      try {
        const mutate = gql`
          mutation($id: String!) {
            paymentMethodDelete(paymentMethodId: $id) {
              id
            }
          }
        `;

        // backend result
        const result = await this.$axios.graphql({
          mutate,
          variables: { id },
        });

        // only remove on local, server does not have more data
        if (this.paymentMethods.length < 10) {
          this.REMOVE_PAYMENT_METHOD(id);
          return;
        }

        // fetching data from server
        await this.getPaymentMethods();
      } catch (error) {
        console.error(error);
      }
    },

    async cancelSubscription() {
      const { isConfirmed } = await Swal.fire({
        title: 'Are you sure?',
        text:
          'Are you sure you want to cancel this product? You will continue to have access to this product until the next billing cycle and your subscription will not renew.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, do it!',
      });

      if (!isConfirmed) {
        return;
      }

      const plans = this.defaultCheckedPlans.map(plan => ({ planId: plan.id }));

      try {
        const results = await this.cancelSubscriptions(plans);

        // update view
        for (const planResult of results) {
          const index = this.show.findIndex(
            plan => plan.id === planResult.plan.id,
          );

          const { plan } = planResult;
          delete planResult.plan;

          if (planResult.cancelAtPeriodEnd) {
            this.SET_CANCELED_STATUS_PLAN({
              ...planResult,
              index,
            });
          } else {
            // set «canceledAt» as null
            this.SET_CANCELED_STATUS_PLAN({
              ...planResult,
              canceledAt: null,
              index,
            });

            // quit users quantity
            this.SET_CHECKED_OR_USERS({
              prop: 'users',
              value: 0,
              index,
            });

            // quit checked
            if (!planIsCore(plan.nickname)) {
              this.SET_CHECKED_OR_USERS({
                prop: 'checked',
                value: false,
                index,
              });
            }

            // update default checked plan
            this.SET_DEFAULT_CHECKED_PLANS();
          }
        }

        let canceled = true;
        for (const plan of this.show) {
          if (planIsCore(plan.nickname) && !plan.users) continue;

          if (plan.checked) {
            canceled = false;
            break;
          }
        }

        // canceled immediatly
        if (canceled) {
          this.SET_SUBSCRIBED(false);
        }
      } catch (e) {
        console.error(e);
      }
    },

    async resetSubscription() {
      const { isConfirmed } = await Swal.fire({
        title: 'Resubscribe',
        text: `Are you sure you want to resubscribe to Prima? We think this is a great idea :-)`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, do it!',
      });

      if (!isConfirmed) {
        return;
      }

      const plans = this.show
        .filter(plan => plan.checked && plan.cancelAtPeriodEnd)
        .map(plan => {
          const obj = {
            planId: plan.id,
            quantity: plan.users,
          };

          // // send coupon
          if (plan.couponId.valid) {
            obj.coupon = plan.couponId.value;
          }

          return obj;
        });

      this.updateSubscription(plans);
    },

    async subscribeUpdatePlan() {
      // change from monthly to yearly subscription
      if (
        this.isSubscribed &&
        this.monthlyToYearly &&
        !this.subscriptionIsCanceled
      ) {
        Swal.fire({
          position: 'center',
          icon: 'info',
          html: '<h4>Please cancel the monthly subscription first!</h4>',
          showConfirmButton: false,
          timer: 2200,
        });

        return;
      }

      // TODO:: text for first subscription
      // TODO:: text for anual subscription
      let text = this.isSubscribed
        ? 'Are you sure you want to update?'
        : 'Are you sure you want to subscribe?';

      if (this.defaultTotalPaid !== this.totalPaid && this.isSubscribed) {
        let rest = null;
        let action = '';

        if (this.defaultTotalPaid > this.totalPaid) {
          rest = enUsFormatter.format(this.defaultTotalPaid - this.totalPaid);
          action = 'decrease';
        } else {
          rest = enUsFormatter.format(this.totalPaid - this.defaultTotalPaid);
          action = 'increase';
        }

        text += ` This will ${action} your monthly bill to ${rest}`;
      }

      const { isConfirmed } = await Swal.fire({
        title: 'Are you sure?',
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, do it!',
      });

      if (!isConfirmed) {
        return;
      }

      const plans = this.show
        .filter(plan => plan.checked && !plan.cancelAtPeriodEnd)
        .map(plan => {
          const obj = {
            planId: plan.id,
            quantity: plan.users,
          };

          // send coupon
          if (plan.couponId.valid) {
            obj.coupon = plan.couponId.value;
          }

          return obj;
        });

      this.updateSubscription(plans, true);
    },

    async updateSubscription(plans, updateDefaultTotalPaid = false) {
      try {
        // execute request
        await this.addSubscription(plans);

        // update last subscription period UI
        if (this.isSubscribed && this.paymentPeriod !== this.defaultPeriod) {
          this.mirrorSubscriptionPlans.forEach((plan, index) => {
            if (plan.checked && plan.cancelAtPeriodEnd) {
              this.SET_CANCELED_STATUS_PLAN({
                cancelAt: null,
                canceledAt: null,
                cancelAtPeriodEnd: false,
                index,
                period: this.mirrorPeriod,
              });
            }
          });
        }

        // first subscription
        if (!this.isSubscribed) {
          this.SET_SUBSCRIBED(true);
        }

        // update default payment period
        if (this.paymentPeriod !== this.defaultPeriod) {
          this.SET_DEFAULT_PERIOD(this.paymentPeriod);
        }

        // update default total paid
        if (updateDefaultTotalPaid) {
          this.SET_DEFAULT_TOTAL_PAID(this.totalPaid);
        }

        // apply changes in template
        this.CONFIRM_COUPONS();

        // update default checked plans
        this.SET_DEFAULT_CHECKED_PLANS();

        if (this.valuesChange) {
          this.valuesChange = false;
        }

        const librariesQuantity = {};

        // old canceled plans, update
        this.show.forEach((plan, index) => {
          if (plan.checked && plan.cancelAtPeriodEnd) {
            this.SET_CANCELED_STATUS_PLAN({
              cancelAt: null,
              canceledAt: null,
              cancelAtPeriodEnd: false,
              index,
            });
          }

          for (const prop in libraryKeys) {
            if (includeValue(plan.nickname, libraryKeys[prop].staticValue)) {
              librariesQuantity[libraryKeys[prop].key] = plan.users;
            }
          }
        });

        // update librariesQuantity
        if (!!Object.keys(librariesQuantity).length) {
          this.UPDATE_LIBRARIES_QUANTITY(librariesQuantity);
        }
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>

<style scoped>
.package-selected {
  color: green !important;
  font-weight: bold;
}

.credit-card {
  border: 2px solid gray;
  border-radius: 5px;
}

.credit-card-default {
  background-color: rgba(146, 153, 150, 0.1);
  border: 1px solid #919191;
}

.users-td input {
  max-width: 70px;
}

.is-valid {
  color: rgba(0, 0, 0, 0.3) !important;
}

.spinner-border {
  width: 17px;
  height: 17px;
}

.quit-cupon {
  font-size: 15px;
  cursor: pointer;
}

.text-grey {
  color: rgba(0, 0, 0, 0.4);
}

.quit-cupon-old {
  position: absolute;
  right: 80px;
  z-index: 100;
  width: 25px;
  height: 29.8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.15);
}

.table-plans td {
  vertical-align: middle;
}
</style>
