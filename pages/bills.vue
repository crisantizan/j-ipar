<template>
  <div class="row">
    <div class="col-12">
      <div class="card-box">
        <h4 class="header-title">Invoices list</h4>
        <datatable :headers="headers" :columns="invoices" />
      </div>
      <!-- end card-box-->
    </div>
    <!-- end col-->
  </div>
  <!-- end row-->
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  components: {
    datatable: () => import('~/components/Datatable'),
  },
  data: () => ({
    headers: [
      { title: 'Date', field: 'created', sortable: true },
      { title: 'Email', field: 'customerEmail', sortable: true },
      {
        title: 'Payment Method',
        field: 'defaultPaymentMethod',
        sortable: true,
      },
      { title: 'Total', field: 'total', sortable: true },
      { title: 'Download PDF', field: 'invoicePdf', sortable: true },
    ],
  }),
  computed: {
    ...mapGetters('invoices', ['invoices']),
  },
  created() {
    this.getInvoices();
  },
  methods: {
    ...mapActions('invoices', ['getInvoices']),
  },
};
</script>
