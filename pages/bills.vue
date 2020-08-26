<template>
  <div class="mt-2">
    <div class="card-box">
      <h4>Invoices list</h4>
      <datatable :headers="headers" :columns="invoices" />
    </div>
    <!-- end card-box-->
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
      {
        title: 'Email',
        field: 'customerEmail',
        sortable: true,
      },
      {
        title: 'Payment Method',
        field: 'defaultPaymentMethod',
        sortable: true,
      },
      {
        title: 'PDF',
        field: 'invoicePdf',
        sortable: true,
        align: 'center',
        formatter: data => {
          return `<a class="btn btn-link btn-sm" href="${data}" target="_blank" title="Download PDF"><i class="fas fa-download"></i></a>`;
        },
      },
      {
        title: 'Total',
        field: 'total',
        sortable: true,
        align: 'right',
        formatter(data, { currency }) {
          return `${data} ${currency}`;
        },
      },
      { field: 'currency', visible: false },
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
