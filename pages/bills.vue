<template>
  <div class="card-box mt-2">
    <h4>Invoices list</h4>
    <datatable :headers="headers" :columns="invoices" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import dayjs from 'dayjs';
import { enUsFormatter } from '../helpers/number-format';

export default {
  components: {
    datatable: () => import('~/components/Datatable'),
  },
  data: () => ({
    // datatable headers
    headers: [
      {
        title: 'Date',
        field: 'created',
        sortable: true,
        formatter(data) {
          return dayjs(data).format('YYYY/MM/DD');
        },
      },
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
        formatter: value => enUsFormatter.format(value),
      },
    ],
  }),
  computed: {
    ...mapGetters('invoices', ['invoices']),
  },
};
</script>
