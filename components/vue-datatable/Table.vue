<template>
  <client-only>
    <div class="card-box p-3 mb-0">
      <div class="table-wrapper">
        <!-- custom header -->
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div class="d-flex">
            <!-- search input component -->
            <search-input v-model="searchTerm" />
            <!-- columns toggle button component -->
            <columns-toggle-button :columns="toggleColumnList" />
          </div>

          <slot name="header-right"></slot>
        </div>
        <!-- end custom header -->

        <vue-good-table
          styleClass="vgt-table my-table table-hover"
          :columns="$props.columns"
          :rows="$props.rows"
          :pagination-options="{
            enabled: $props.pagination,
            mode: 'pages',
          }"
          :search-options="{
            enabled: true,
            externalQuery: searchTerm,
          }"
        >
          <!-- table-row slot -->
          <template slot="table-row" slot-scope="props">
            <slot name="table-row" v-bind="props"></slot>
          </template>

          <!-- pagination slot -->
          <template
            v-if="$props.pagination"
            slot="pagination-bottom"
            slot-scope="props"
          >
            <pagination v-bind="props" />
          </template>
        </vue-good-table>
      </div>
    </div>
  </client-only>
</template>

<script>
export default {
  components: {
    Pagination: () => import('./Pagination'),
    ColumnsToggleButton: () => import('./ColumnsToggleButton'),
    SearchInput: () => import('./SearchInput'),
  },
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    rows: {
      type: Array,
      default: () => [],
    },
    pagination: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    /** search value */
    searchTerm: '',
  }),
  computed: {
    /** get columns "toggleables" */
    toggleColumnList() {
      return this.$props.columns.filter(column => column.toggle);
    },
  },
};
</script>
