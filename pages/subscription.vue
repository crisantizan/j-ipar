<template>
  <div class="row col-12 mt-2">
    <div class="col-md-5">
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
              <div id="card-errors" role="alert" style="color: red;"></div>

              <div class="text-right">
                <button
                  type="submit"
                  class="btn btn-success mt-2"
                  id="add-payment-method"
                >
                  <!-- v-bind:disabled="isProcesing ? '' : disabled"
              v-bind:disabled="isProcesing ? '' : disabled" -->
                  Add
                </button>
                <div></div>
              </div>
            </form>
          </div>
        </div>

        <hr class="mt-1" />

        <div class="row p-2">
          <div v-if="paymentMethods == null">Add Payment Method</div>
          <!-- go to 489 line -->
          <div
            v-else
            class="col-md-6"
            v-for="paymentMethod in paymentMethods"
            :key="paymentMethod.id"
          >
            <!-- v-if="paymentMethods !== null" -->
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
                    <!-- {{ paymentMethod.card.brand }} -->
                  </span>
                  <span style="font-size: larger;"
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
                      :click="changeDefaultPaymentMethod(paymentMethod.id)"
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

          <!-- <div v-if="paymentMethods == null">Add Payment Method</div> -->
        </div>
      </div>
    </div>

    <div class="col-md-7">
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
                    @change="periodChange()"
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
                    @change="periodChange()"
                  />
                  <label for="payment-period-year">Year</label>
                </div>
              </div>

              <table class="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Package</th>
                    <th class="text-center">User(s)</th>
                    <th class="text-center">Price</th>
                    <th class="text-center">Discount</th>
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
                          :id="plan.id"
                          type="checkbox"
                          :checked="plan.checked"
                          @change="
                            onCheckedPlan({
                              value: !plan.checked,
                              index,
                            })
                          "
                        />
                        <label :for="plan.id">
                          {{ plan.nickname }}
                        </label>
                      </div>

                      <div class="text-success" v-if="isIncluded(plan)">
                        <b> Discount:</b> 5% for 12 months
                      </div>

                      <div v-else class="input-group input-group-sm mt-1">
                        <input
                          type="text"
                          class="form-control form-control-sm"
                          placeholder="Add Coupon"
                        />
                        <div class="input-group-append">
                          <button
                            class="btn btn-sm btn-outline-secondary"
                            type="button"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </td>
                    <td class="users-td">
                      <input
                        class="form-control form-control-sm"
                        type="number"
                        maxlength="3"
                        min="0"
                        size="3"
                        :value="plan.users"
                        @change="
                          onChangeUsers({
                            value: Number($event.target.value),
                            index,
                          })
                        "
                      />
                    </td>
                    <td class="text-center">
                      {{ plan.amount | slice(0, -2) | enUsFormatter }}
                    </td>
                    <td class="text-center">$0</td>
                    <td class="text-center">
                      {{
                        plan.amount
                          | slice(0, -2)
                          | multiply(plan.users)
                          | enUsFormatter
                      }}
                    </td>
                  </tr>

                  <tr>
                    <td colspan="4">
                      <b>Total to pay per {{ paymentPeriod }}</b>
                    </td>
                    <td class="text-right">
                      <b>{{ totalPaid | enUsFormatter }}</b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="text-right mb-3">
              <button
                type="button"
                class="btn btn-success"
                v-if="paymentMethods != null"
                v-on:click="subscribeUpdatePlan()"
              >
                Subscribe / Update
              </button>
            </div>

            <span v-if="plans === null"> Loading ... </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import gql from 'graphql-tag';

export default {
  data: () => ({
    isProcesing: true,
    coreIds: [
      'price_1Gv7zkEHlNK1KgjMGy4WHzUf',
      'price_1Gv80DEHlNK1KgjMaPRisapB',
    ],
  }),
  computed: {
    ...mapGetters('plans', [
      'show',
      'plans',
      'totalPaid',
      'customer',
      'paymentMethods',
    ]),
    paymentPeriod: {
      get() {
        return this.$store.getters['plans/period'];
      },
      set(period) {
        this.$store.commit('plans/SET_PERIOD', period);
      },
    },
  },
  async created() {
    // set monthly and yearly plans, one time
    if (!this.show.length) {
      const { month, year } = this.getFilteredPlans();
      this.SET_MONTHLY(month);
      this.SET_YEARLY(this.copyMonthlyValues(month, year));
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
  methods: {
    ...mapMutations('plans', [
      'SET_MONTHLY',
      'SET_YEARLY',
      'SET_CHECKED_OR_USERS',
    ]),

    /** verify if the current plan is included in "coreIds" */
    isIncluded(plan) {
      return this.coreIds.includes(plan.id);
    },

    /** create payment method (with apollo) */
    async createPaymentMethod(stripe, card) {
      try {
        this.isProcesing = true;

        // get stripe payment method
        const { paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card,
        });

        // TODO: should be "create" instead of "edit"
        const mutation = gql`
          mutation($paymentMethodId: String!) {
            paymentMethodEdit(paymentMethodId: $paymentMethodId) {
              id
            }
          }
        `;

        // backend result
        const result = await this.$apollo.mutate({
          mutation,
          variables: { paymentMethodId: paymentMethod.id },
        });

        // TODO: update payment methods list
        card.clear();
        console.log(result);
      } catch (error) {
        console.error(error);
      } finally {
        this.isProcesing = false;
      }
    },

    /** show plans filtered */
    getFilteredPlans() {
      // california: price_1GrnVtEHlNK1KgjMvTmvPR5f
      // immigration: price_1GrnRoEHlNK1KgjMXEMUQh3q
      const checkedItems = [
        { name: 'california', id: 'price_1GrnVtEHlNK1KgjMvTmvPR5f' },
        { name: 'immigration', id: 'price_1GrnRoEHlNK1KgjMXEMUQh3q' },
      ]
      const data = this.plans.reduce(
        (filtered, plan) => {
          switch (plan.interval) {
            case 'month':
              // included in "coreIds" array
              if (this.coreIds.includes(plan.id)) {
                return {
                  ...filtered,
                  month: {
                    ...filtered.month,
                    included: [...filtered.month.included, plan],
                  },
                };
              }

              // add to not-included
              return {
                ...filtered,
                month: {
                  ...filtered.month,
                  notIncluded: [...filtered.month.notIncluded, {
                    ...plan, checked: checkedItems.some(v => v.id === plan.id)
                  }],
                },
              };

            default:
              // included in "coreIds" array
              if (this.coreIds.includes(plan.id)) {
                return {
                  ...filtered,
                  year: {
                    ...filtered.year,
                    included: [...filtered.year.included, plan],
                  },
                };
              }

              // add to not-included
              return {
                ...filtered,
                year: {
                  ...filtered.year,
                  notIncluded: [...filtered.year.notIncluded, plan],
                },
              };
          }
        },
        {
          month: { included: [], notIncluded: [] },
          year: { included: [], notIncluded: [] },
        },
      );

      return Object.entries(data).reduce(
        (acc, [key, values]) => {
          return { ...acc, [key]: [...values.included, ...values.notIncluded] };
        },
        { month: [], year: [] },
      );
    },

    /** copy monthly values to yearly */
    copyMonthlyValues(monthly, yearly) {
      return yearly.map((plan, index) => {
        const { checked, users } = monthly[index];
        return { ...plan, checked, users };
      });
    },

    /** on checked plan handler */
    onCheckedPlan(data) {
      // data { value, index });
      this.SET_CHECKED_OR_USERS({ prop: 'checked', ...data });
    },

    /** on change users handler */
    onChangeUsers(data) {
      // data { value, index });
      this.SET_CHECKED_OR_USERS({ prop: 'users', ...data });
    },

    periodChange() {
      let productsToSwitch = [];
      let planToUncheck = [];

      this.plans.forEach(plan => {
        if (plan.checked) {
          productsToSwitch.push(plan.product);
          planToUncheck.push(plan.id);
        }
      });

      // console.log(productsToSwitch);
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
        this.isProcesing = true;

        const mutation = gql`
          mutation($id: String!) {
            paymentMethodEdit(paymentMethodId: $id) {
              id
            }
          }
        `;

        // backend result
        const result = await this.$apollo.mutate({
          mutation,
          variables: { id },
        });

        // TODO: update payment methods list
        console.log(result);
      } catch (error) {
        console.error(error);
      } finally {
        this.isProcesing = false;
      }
    },

    deletePaymentMethod(paymentMethodId) {
      let _this = this;

      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete this Payment method',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, do It!',
      }).then(result => {
        if (result.isConfirmed) {
          _this.isProcesing = true;
          let data = {
            query:
              `
              mutation {
                paymentMethodDelete(paymentMethodId: "` +
              paymentMethodId +
              `") { id },
              }`,
            variables: {},
          };

          var config = {
            method: 'post',
            url: this.url,
            headers: {
              'Content-Type': 'application/json',
              Cookie: '__cfduid=d786e683ada5a0538598f646cca563d951591798240',
            },
            data: data,
          };

          this.$axios
            .post(config)
            .then(function(response) {
              console.log(JSON.stringify(response.data));

              _this.getPaymentMethods();
              _this.isProcesing = false;
            })
            .catch(function(error) {
              console.log(error);
            });
        }
      });
    },

    subscribeUpdatePlan() {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Are you sure you want to update your subscription?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, do it!',
      });
      console.log('A subscribirse papa');
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

.users-td {
  display: flex;
  justify-content: center;
}

.users-td input {
  max-width: 70px;
}
</style>
