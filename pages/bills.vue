<template>
  <div class="row">
    <div class="col-12">
      <div class="card-box">
        <h4>Invoices list</h4>
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
      { title: 'Date', field: 'created', sortable: true, align: 'center' },
      {
        title: 'Email',
        field: 'customerEmail',
        sortable: true,
        align: 'center',
      },
      {
        title: 'Payment Method',
        field: 'defaultPaymentMethod',
        sortable: true,
        align: 'center',
      },
      { title: 'Total', field: 'total', sortable: true, align: 'center' },
      {
        title: 'Download PDF',
        field: 'invoicePdf',
        sortable: true,
        align: 'center',
        formatter: data => {
          return `<a class="btn btn-outline-primary btn-sm" href="${data}" target="_blank">Download PDF</a>`;
        },
      },
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
