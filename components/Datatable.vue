<template>
  <client-only>
    <div class="Datatable">
      <BootstrapTable
        :columns="$props.headers"
        :data="orderedColumns"
        :options="options"
      ></BootstrapTable>
    </div>
  </client-only>
</template>

<script>
export default {
  data: () => ({
    orderedColumns: [],
    // bootstrap-table options
    options: {
      toggle: 'table',
      search: true,
      searchTimeOut: 200,
      showColumns: true,
      buttonsClass: 'primary',
      pageList: [5, 10, 20],
      pageSize: '5',
      pagination: true,
      paginationLoop: false,
      paginationNextText: '»',
      paginationPreText: '«',
      theadClasses: 'thead-light',
      clickToSelect: true,
      classes: 'table table-borderless table-hover',
    },
  }),
  props: {
    headers: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
  },
  head() {
    return {
      link: [{ rel: 'stylesheet', href: 'css/datatable.css' }],
      script: [{ src: 'js/datatable.js' }],
    };
  },
  watch: {
    '$props.columns': {
      immediate: true,
      deep: true,
      handler(val, oldVal) {
        if (!val.length) {
          return;
        }

        // get field names of "headers" prop
        const orderBy = this.$props.headers.map(h => h.field);
        // sort by positions of array "orderBy"
        const orderedByHeader = this.$props.columns.map(column => {
          const obj = {};
          orderBy.forEach(key => {
            obj[key] = column[key];
          });
          return obj;
        });
        this.orderedColumns = orderedByHeader;
      },
    },
  },
};
</script>

<style scoped>
.Datatable {
  border: 1px solid #dee2e6;
  padding: 0.5rem 0.75rem;
  border-radius: 3px;
}
</style>
