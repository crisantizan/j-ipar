<template>
  <client-only>
    <div class="table-wrapper">
      <!-- style="min-height: calc(100vh - 95px);" -->
      <!-- custom header -->
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="d-flex">
          <!-- search input component -->
          <search-input v-model="searchTerm" />
          <!-- columns toggle button component -->
          <columns-toggle-button :columns="toggleColumnList" />

          <slot name="header-left"></slot>
        </div>

        <slot name="header-right"></slot>
      </div>

      <slot name="second-header">
      </slot>
      <!-- end custom header -->

      <vue-good-table
        styleClass="vgt-table my-table table-hover"
        :columns="$props.columns"
        :rows="$props.rows"
        max-height="calc(100vh - 275px)"
        :row-style-class="$props.rowStyleClass"
        :pagination-options="{
          mode: 'pages',
          enabled: $props.pagination.enabled,
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
          v-if="$props.pagination.enabled"
          slot="pagination-bottom"
          slot-scope="props"
        >
          <pagination
            v-bind="props"
            :per-page="$props.pagination.perPage"
            :per-page-dropdown="$props.pagination.perPageDropdown"
          />
        </template>
      </vue-good-table>
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
      type: Object,
      default: () => ({
        enabled: true,
        perPageDropdown: [5, 10, 15, 20],
        perPage: 5,
      }),
    },
    rowStyleClass: {
      type: [String, Function],
      default: '',
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
