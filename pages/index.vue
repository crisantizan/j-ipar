<template>
  <div class="row myRow col-12 mt-3">
    <div class="col-md-6">
      <div class="card myPad">
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

        <div class="row">
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
                      v-on:click="changeDefaultPaymentMethod(paymentMethod.id)"
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

          <div v-if="paymentMethods == null">Add Payment Method</div>
        </div>
      </div>
    </div>

    <div class="col-md-6">
      <div class="card myPad">
        <h2 class="mb-0">Select Plan</h2>

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
                  <!-- v-bind:disabled="isProcesing ? '' : disabled" -->
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
                  <!-- v-bind:disabled="isProcesing ? '' : disabled" -->
                  <label for="payment-period-year">Year</label>
                </div>
              </div>

              <div class="overflow-auto">
                <table class="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Package</th>
                      <th class="text-center">User(s)</th>
                      <th class="text-right">Price</th>
                      <th class="text-right">Discount</th>
                      <th class="text-right">Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="plan in show.included"
                      :key="plan.id"
                      :class="{ 'package-selected': plan.checked }"
                    >
                      <td>
                        <div class="checkbox checkbox-success">
                          <input
                            :id="plan.id"
                            type="checkbox"
                            v-model="plan.checked"
                            @change="checkedChange(plan)"
                          />
                          <!-- v-bind:disabled="isProcesing ? '' : disabled" -->
                          <label :for="plan.id">
                            {{ plan.nickname }}
                          </label>
                        </div>
                        <div class="text-success">
                          <b> Discount:</b> 5% for 12 months
                        </div>
                      </td>
                      <td class="text-center">
                        <input
                          class="form-control form-control-sm"
                          type="number"
                          maxlength="3"
                          min="0"
                          size="3"
                          value="1"
                          v-model="plan.users"
                          @change="usersChange(plan)"
                        />
                        <!-- v-bind:disabled="isProcesing ? '' : disabled" -->
                      </td>
                      <td class="text-right">
                        {{ '$ ' + plan.amount.toString().slice(0, -2) }}
                      </td>
                      <td class="text-right">$ 0</td>
                      <td class="text-right">
                        $
                        {{
                          (plan.users * plan.amount.toString().slice(0, -2))
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }}
                      </td>
                    </tr>

                    <tr
                      v-for="plan in show.notIncluded"
                      :key="plan.id"
                      :class="{ 'package-selected': plan.checked }"
                    >
                      <td>
                        <div class="checkbox checkbox-success">
                          <input
                            :id="plan.id"
                            type="checkbox"
                            v-model="plan.checked"
                            @change="checkedChange(plan)"
                          />
                          <!-- v-bind:disabled="isProcesing ? '' : disabled" -->
                          <label :for="plan.id">
                            {{ plan.nickname }}
                          </label>
                        </div>
                        <div class="input-group input-group-sm mt-1">
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
                      <td class="text-center">
                        <input
                          class="form-control form-control-sm"
                          type="number"
                          maxlength="3"
                          min="0"
                          size="3"
                          value="1"
                          v-model="plan.users"
                          @change="usersChange(plan)"
                        />
                        <!-- v-bind:disabled="isProcesing ? '' : disabled" -->
                      </td>
                      <td class="text-right">
                        {{ '$ ' + plan.amount.toString().slice(0, -2) }}
                      </td>
                      <td class="text-right">$ 0</td>
                      <td class="text-right">
                        $
                        {{
                          (plan.users * plan.amount.toString().slice(0, -2))
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }}
                      </td>
                    </tr>

                    <tr>
                      <td colspan="4">
                        <b>Total to pay per {{ paymentPeriod }}</b>
                      </td>
                      <td class="text-right">
                        <b
                          >$
                          {{
                            totalToPaid
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          }}</b
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="text-right mb-3">
              <button
                type="button"
                class="btn btn-success"
                v-if="plans != null"
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

export default {
  data: () => ({
    message: 'La vida loca',
    plans: [],
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6OTYsInRlbmFudENvZGUiOiJCNkdMVTIxNjA0MTk4MTciLCJlbWFpbCI6ImphbWVzQGJldHpvbGRsYXcuY29tIiwidXNlcklkIjoxLCJzZXNzaW9uSWQiOiI1YzZmMDg0ZC05YjA2LTQ5MDYtODhkYy1iMDJlOWZhMzZjMzUiLCJpYXQiOjE1OTgyNzU3NDksImV4cCI6MTU5ODg4MDU0OX0.XZe-CKEhiDSTS46Qtwp_50JJ9PAib0tlb-DJa3X4GSQ',
    graphqlUrl: 'https://graph-staging.primafacieapp.com/graphql',
    totalToPaid: 0,
    isProcesing: true,
    iAmCreating: true,
    paymentMethods: null,
    customer: null,
    coreIds: [
      'price_1Gv7zkEHlNK1KgjMGy4WHzUf',
      'price_1Gv80DEHlNK1KgjMaPRisapB',
    ],
  }),
  computed: {
    ...mapGetters('plans', ['show']),
    paymentPeriod: {
      get() {
        return this.$store.getters['plans/period'];
      },
      set(period) {
        this.$store.commit('plans/SET_PERIOD', period);
      },
    },
    url() {
      return `${this.graphqlUrl}?token=${this.token}`;
    },
  },
  async created() {
    await Promise.all([this.getPlans(), this.getPaymentMethods()]);
  },
  mounted() {
    let _this = this;

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
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      this.isProcesing = true;

      // Create Payment method
      createPaymentMethod(cardElement);
    });

    function createPaymentMethod(cardElement) {
      _this.isProcesing = true;
      return stripe
        .createPaymentMethod({
          type: 'card',
          card: cardElement,
        })
        .then(result => {
          let data = {
            query:
              `mutation {
                paymentMethodEdit(paymentMethodId: "` +
              result.paymentMethod.id +
              `") {
                  id
                },
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

          this.$this
            .$axios(config)
            .then(function(response) {
              console.log(JSON.stringify(response.data));
              cardElement.clear();
              _this.getPaymentMethods();
              _this.isProcesing = false;
            })
            .catch(function(error) {
              console.log(error);
            });
        });
    }

    // this.getPlans();
    // this.getPaymentMethods();
  },
  methods: {
    ...mapMutations('plans', ['SET_MONTHLY', 'SET_YEARLY', 'TOGGLE_ACTIVE']),
    /** fetch plans */
    async getPlans() {
      // creating Query
      const data = JSON.stringify({
        query:
          'query {  \n stripePlans {\n  id\n  object\n  active\n  aggregateUsage\n  amount\n  amountDecimal\n  billingScheme\n  created\n  currency\n  interval\n  intervalCount\n  livemode\n  metadata\n  nickname\n  product\n  tiers\n  tiersMode\n  transformUsage\n  trialPeriodDays\n  usageType\n checked users }\n}',
        variables: {},
      });

      // config for Axios
      const config = {
        method: 'post',
        url: this.url,
        headers: {
          'Content-Type': 'application/json',
          Cookie: '__cfduid=d7b532d41aedc247cf6265a3f7af83cd31591630565',
        },
        data: data,
      };

      try {
        this.isProcesing = true;
        const res = await this.$axios(config);

        this.plans = res.data.data.stripePlans;
        this.addLocalValuesToPlans();

        const { month, year } = this.getFilteredPlans();
        this.SET_MONTHLY(month);
        this.SET_YEARLY(this.setYearlyActiveItems(month, year));
      } catch (error) {
        console.error(error);
      } finally {
        this.isProcesing = false;
      }
    },
    /** show plans filtered */
    getFilteredPlans() {
      return this.plans.reduce(
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
                  notIncluded: [...filtered.month.notIncluded, plan],
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
    },
    /** set yearly active items */
    setYearlyActiveItems(monthly, yearly) {
      const included = yearly.included.map((plan, index) => {
        const checked = monthly.included[index].checked;
        return { ...plan, checked };
      });

      const notIncluded = yearly.notIncluded.map((plan, index) => {
        const checked = monthly.notIncluded[index].checked;
        return { ...plan, checked };
      });

      return { included, notIncluded };
    },
    getPaymentMethods() {
      let _this = this;

      _this.isProcesing = true;

      // Creating Query
      var data = JSON.stringify({
        query:
          'query {stripePaymentMethods {id, card}, stripeCustomer {  id, invoiceSettings} }',
        variables: {},
      });

      // Config for Axios
      var config = {
        method: 'post',
        url: this.url,
        headers: {
          'Content-Type': 'application/json',
          Cookie: '__cfduid=d7b532d41aedc247cf6265a3f7af83cd31591630565',
        },
        data: data,
      };

      // Execute Axios Request
      this.$axios(config)
        .then(response => {
          // TODO:: doesn't return an array, set to null while
          _this.paymentMethods = Array.isArray(
            response.data.data.stripePaymentMethods,
          )
            ? response.data.data.stripePaymentMethods
            : null;
          // "stripePaymentMethods": {
          //   "id": null,
          //   "card": null
          // },
          _this.customer = response.data.data.stripeCustomer;
          _this.addLocalValuesToPlans();
          _this.isProcesing = false;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    addLocalValuesToPlans() {
      let _this = this;

      _this.plans.forEach(plan => {
        // plan.users = 0;
        // plan.checked = false;
      });
    },
    usersChange(plan) {
      const users = plan.users;
      const product = plan.product;

      this.plans.forEach(forEachplan => {
        if (forEachplan.product === product) {
          forEachplan.users = users;
        }
      });

      this.updateReactivity();
    },
    checkedChange(plan) {
      this.updateReactivity();
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

      this.updateReactivity();
      console.log(productsToSwitch);
    },
    updateReactivity() {
      this.$forceUpdate();
      this.totalToPaidCalc();
    },
    totalToPaidCalc() {
      let total = 0;

      this.plans.forEach(plan => {
        if (plan.checked === true) {
          let totalPlan = (plan.amount * plan.users) / 100;
          total = total + totalPlan;
        }
      });

      this.totalToPaid = total;
    },
    changeDefaultPaymentMethod(paymentMethodId) {
      let _this = this;

      Swal.fire({
        title: 'Are you sure?',
        text: 'If you accept this card become your default Payment Method',
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
                 paymentMethodEdit(paymentMethodId: "` +
              paymentMethodId +
              `") {id},
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

          this.$axios(config)
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

.myRow {
  margin-right: 0;
  margin-left: 0;
}

.myPad {
  padding-right: 15px;
  padding-left: 15px;
}
</style>
