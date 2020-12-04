<template>
  <div class="card p-2">
    <h2 class="mb-0">Card Information</h2>

    <div class="row">
      <div class="col-md-12">
        <form id="subscription-form">
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

    <div class="row p-2 cards-list">
      <div v-if="!paymentMethods.length">Add Payment Method</div>
      <!-- go to 489 line -->
      <div v-else v-for="paymentMethod in paymentMethods" :key="paymentMethod.id">
        <div
          class="card-box credit-card ribbon-box px-2 m-1"
          :class="{
            'credit-card-default': isDefaultPaymentMethod(paymentMethod),
            'credit-card-default--expired':
              isDefaultPaymentMethod(paymentMethod) && defaultPaymentMethodIsExpirated,
          }"
        >
          <div
            class="ribbon float-left"
            :class="[
              isDefaultPaymentMethod(paymentMethod) && defaultPaymentMethodIsExpirated
                ? 'ribbon-danger'
                : 'ribbon-primary',
            ]"
          >
            <span v-if="isDefaultPaymentMethod(paymentMethod)">Active</span>
            Payment Method
            <span v-if="isDefaultPaymentMethod(paymentMethod) && defaultPaymentMethodIsExpirated">
              (EXPIRATED)
            </span>
          </div>
          <h5 class="text-primary float-right mt-0"></h5>
          <div class="ribbon-content">
            <div class="mb-0">
              <span class="d-block"
                ><i class="fab fa-cc-mastercard fa-2x"></i>
                <i class="fa fa-cc-visa fa-2x"></i>
              </span>
              <span style="font-size: larger">**** **** **** {{ paymentMethod.card.last4 }}</span>
              <br />
              Valid
              <strong>{{ paymentMethod.card.exp_month }}</strong> /
              <strong>{{ paymentMethod.card.exp_year }}</strong>
              <br />

              <div class="d-flex justify-content-between mt-1" style="height: 33.06px;">
                <a
                  class="btn btn-sm btn-secondary"
                  href="#"
                  v-if="paymentMethod.id != customer.invoiceSettings.default_payment_method"
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
</template>

<script>
import gql from 'graphql-tag';
import { mapMutations, mapActions, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['loading']),
    ...mapGetters('plans', [
      'customer',
      'paymentMethods',
      'defaultPaymentMethod',
      'defaultPaymentMethodIsExpirated',
    ]),
  },

  watch: {
    defaultPaymentMethodIsExpirated: {
      handler(val) {
        if (val) {
          this.showAlertOnExpiratedDefaultPaymentMethod();
        }
      },
    },
  },

  mounted() {
    if (this.defaultPaymentMethodIsExpirated) {
      this.showAlertOnExpiratedDefaultPaymentMethod();
    }

    // create a Stripe client.
    const stripe = Stripe(process.env.STRIPE_PUBLISHABLE_KEY);

    // create an instance of Elements.
    const elements = stripe.elements();

    const style = {
      base: {
        color: '#32325d',
        lineHeight: '1.429',
      },

      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    };

    const cardElement = elements.create('card', { style: style });
    cardElement.mount('#card-element');

    cardElement.on('change', e => {
      if (event.error) {
        const displayError = document.getElementById('card-errors');

        displayError.textContent = event.error.message;
      }
    });

    const form = document.getElementById('subscription-form');

    form.addEventListener('submit', e => {
      e.preventDefault();

      // create payment method
      this.createPaymentMethod(stripe, cardElement);
    });
  },

  methods: {
    ...mapMutations('plans', [
      'ADD_PAYMENT_METHOD',
      'CHANGE_DEFAULT_CUSTOMER',
      'REMOVE_PAYMENT_METHOD',
    ]),
    ...mapActions('plan', ['getPaymentMethods']),

    showAlertOnExpiratedDefaultPaymentMethod() {
      Swal.fire({
        title: 'Warning!',
        icon: 'error',
        text: 'Your default payment method is expirated!',
      });
    },

    isDefaultPaymentMethod(paymentMethod) {
      return this.defaultPaymentMethod.id === paymentMethod.id;
    },

    /** create payment method*/
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
  },
};
</script>

<style scoped>
.cards-list {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  justify-items: center;
  column-gap: 20px;
  row-gap: 10px;
}

@media (min-width: 992px) {
  .cards-list {
    max-height: calc(100vh - 320px);
    overflow-y: auto;
  }
}

.credit-card {
  border: 1px solid rgba(0, 0, 0, 0.15);
  width: 250px;
}

.credit-card-default {
  border-color: rgba(0, 59, 252, 0.5);
}

.credit-card-default--expired {
  border-color: rgba(252, 0, 0, 0.5);
}

@media (min-width: 620px) {
  .cards-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .cards-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 992px) {
  .cards-list {
    grid-template-columns: repeat(1, 1fr);
  }
}

@media (min-width: 1790px) {
  .cards-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
