<template>
  <div class="d-flex align-items-center" style="height: calc(100vh - 69.6px);">
    <datatable
      :columns="columns"
      :rows="invoices"
      class="bills-table"
      :pagination="{
        enabled: true,
        perPageDropdown: [5, 10, 15, 20, 50, 100],
        perPage: 100,
      }"
    >
      <!-- 210 -->
      <template slot="table-row" slot-scope="props">
        <!-- generate PDF button -->
        <template v-if="props.column.field === 'invoicePdf'">
          <a
            class="btn btn-link btn-sm"
            :href="props.row.invoicePdf"
            target="_blank"
            title="Download PDF"
            ><i class="fas fa-download"></i
          ></a>
        </template>
        <!-- print default data -->
        <span v-else>
          {{ props.formattedRow[props.column.field] }}
        </span>
      </template>
    </datatable>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import dayjs from 'dayjs';
import { enUsFormatter } from '../helpers/number-format';

export default {
  components: {
    Datatable: () => import('@/components/Table'),
  },
  data: () => ({
    // datatable headers
    columns: [
      {
        label: 'Date',
        field: 'created',
        hidden: false,
        toggle: true,
        type: 'date',
        tdClass: 'text-left',
        thClass: 'text-left',
        formatFn: val => dayjs.unix(val).format('MM/DD/YYYY'),
      },
      {
        label: 'Email',
        field: 'customerEmail',
        hidden: false,
        toggle: true,
      },
      {
        label: 'Payment Method',
        field: 'defaultPaymentMethod',
        hidden: false,
        toggle: true,
      },
      {
        label: 'PDF',
        field: 'invoicePdf',
        hidden: false,
        toggle: true,
        sortable: false,
        tdClass: 'text-center',
        thClass: 'text-center',
      },
      {
        label: 'Total',
        field: 'total',
        hidden: false,
        toggle: true,
        type: 'number',
        formatFn: value => enUsFormatter.format(value),
      },
    ],
  }),
  computed: {
    ...mapGetters('invoices', ['invoices']),
  },
};
</script>
